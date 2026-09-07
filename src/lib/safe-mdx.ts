import { createProcessor } from "@mdx-js/mdx";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import type { Root, Element, RootContent } from "hast";
import type { Root as MarkdownRoot } from "mdast";
import { contentURL, type AssetContext } from "./study-assets.ts";

export interface RenderedContent {
  tree: Root;
  headings: { id: string; title: string; depth: number }[];
}

export class RichContentError extends Error {
  status = 422;

  constructor(
    message = "El contenido contiene Markdown/MDX no compatible o instrucciones no permitidas.",
  ) {
    super(message);
    this.name = "RichContentError";
  }
}

type ContentNode = {
  type: string;
  name?: string | null;
  value?: string;
  children?: ContentNode[];
  attributes?: { type: string; name?: string; value?: unknown }[];
  data?: Record<string, unknown>;
};

const elements: Record<string, string> = {
  Callout: "ooi-callout",
  Steps: "ooi-steps",
  Step: "ooi-step",
  Image: "img",
  details: "details",
  summary: "summary",
  img: "img",
  a: "a",
  p: "p",
  div: "div",
  span: "span",
  br: "br",
  hr: "hr",
  strong: "strong",
  b: "b",
  em: "em",
  i: "i",
  s: "s",
  del: "del",
  kbd: "kbd",
  sub: "sub",
  sup: "sup",
  ul: "ul",
  ol: "ol",
  li: "li",
  blockquote: "blockquote",
  table: "table",
  thead: "thead",
  tbody: "tbody",
  tr: "tr",
  th: "th",
  td: "td",
  caption: "caption",
  code: "code",
  pre: "pre",
  figure: "figure",
  figcaption: "figcaption",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

function staticAttribute(value: unknown): string | number | boolean | null {
  if (value === null || value === undefined) return true;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  )
    return value;
  const expression = value as {
    type?: string;
    data?: {
      estree?: {
        body?: {
          type: string;
          expression?: { type: string; value?: unknown };
        }[];
      };
    };
  };
  const statements = expression.data?.estree?.body;
  const literal = statements?.[0]?.expression;
  if (
    expression.type === "mdxJsxAttributeValueExpression" &&
    statements?.length === 1 &&
    statements[0].type === "ExpressionStatement" &&
    literal?.type === "Literal" &&
    ["string", "number", "boolean"].includes(typeof literal.value)
  ) {
    return literal.value as string | number | boolean;
  }
  throw new RichContentError();
}

function restrictMDX(node: ContentNode) {
  if (node.type === "mdxjsEsm") throw new RichContentError();
  if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
    const value = `{${node.value ?? ""}}`;
    const flow = node.type === "mdxFlowExpression";
    node.type = flow ? "paragraph" : "text";
    delete node.data;
    if (flow) {
      node.children = [{ type: "text", value }];
      delete node.value;
    } else node.value = value;
    return;
  }
  if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
    const tag =
      node.name && Object.hasOwn(elements, node.name)
        ? elements[node.name]
        : null;
    if (!tag) throw new RichContentError();
    const properties: Record<string, string | number | boolean> = {};
    for (const attribute of node.attributes ?? []) {
      if (
        attribute.type !== "mdxJsxAttribute" ||
        !attribute.name ||
        /^on/i.test(attribute.name)
      )
        throw new RichContentError();
      const value = staticAttribute(attribute.value);
      const permitted = [
        "href",
        "src",
        "alt",
        "title",
        "width",
        "height",
        "open",
        "start",
        "align",
        "type",
      ];
      if (!permitted.includes(attribute.name)) throw new RichContentError();
      if (value !== null) properties[attribute.name] = value;
    }
    if (
      tag === "ooi-callout" &&
      !["info", "warning", "error", "success"].includes(
        String(properties.type ?? "info"),
      )
    )
      throw new RichContentError();
    const flow = node.type === "mdxJsxFlowElement";
    node.type = flow ? "blockquote" : "emphasis";
    node.data = { hName: tag, hProperties: properties };
    delete node.attributes;
    delete node.name;
  }
  for (const child of node.children ?? []) restrictMDX(child);
}

const schema: typeof defaultSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "ooi-callout",
    "ooi-steps",
    "ooi-step",
    "details",
    "summary",
    "figure",
    "figcaption",
  ],
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ["className", /^language-[a-z0-9_-]+$/i, "math-inline", "math-display"],
    ],
    "ooi-callout": [["type", "info", "warning", "error", "success"]],
    details: ["open"],
    img: ["src", "alt", "title", "width", "height"],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https"],
    src: ["http", "https"],
  },
};

function textContent(node: RootContent | Root): string {
  if (node.type === "text") return node.value;
  return "children" in node
    ? node.children.map((child) => textContent(child as RootContent)).join("")
    : "";
}

export async function renderRichContent(
  source: string,
  options: AssetContext & { format?: "mdx" | "markdown" } = {},
): Promise<RenderedContent> {
  if (typeof source !== "string")
    throw new RichContentError(
      "El contenido debe ser una cadena Markdown/MDX.",
    );
  if (source.length > 2_000_000)
    throw new RichContentError(
      "El documento supera el tamaño admitido para lectura.",
    );
  try {
    const markdown = options.format === "markdown";
    const parser = markdown
      ? unified().use(remarkParse).use(remarkGfm).use(remarkMath)
      : createProcessor({ remarkPlugins: [remarkGfm, remarkMath] });
    const tree = parser.parse(source) as MarkdownRoot;
    if (!markdown) restrictMDX(tree as unknown as ContentNode);
    const processor = unified().use(remarkRehype, {
      allowDangerousHtml: markdown,
    });
    if (markdown) processor.use(rehypeRaw);
    const safeTree = (await processor
      .use(rehypeSanitize, schema)
      .use(rehypeSlug, { prefix: "study-" })
      .run(tree)) as Root;
    const headings: RenderedContent["headings"] = [];
    const visit = (node: Root | RootContent) => {
      if (node.type === "element") {
        const element = node as Element;
        if (/^h[1-6]$/.test(element.tagName)) {
          headings.push({
            id: String(element.properties.id),
            title: textContent(element),
            depth: Number(element.tagName[1]),
          });
        }
        if (element.tagName === "a") {
          const url = contentURL(
            String(element.properties.href ?? ""),
            false,
            options,
          );
          if (url)
            element.properties.href =
              url.startsWith("#") && !url.startsWith("#study-")
                ? `#study-${url.slice(1)}`
                : url;
          else delete element.properties.href;
        }
        if (element.tagName === "img") {
          const url = contentURL(
            String(element.properties.src ?? ""),
            true,
            options,
          );
          if (url) element.properties.src = url;
          else {
            element.tagName = "span";
            element.children = [
              {
                type: "text",
                value: `Imagen no disponible${element.properties.alt ? `: ${element.properties.alt}` : ""}`,
              },
            ];
            element.properties = {};
          }
        }
      }
      if ("children" in node)
        for (const child of node.children) visit(child as RootContent);
    };
    visit(safeTree);
    const rendered = (await unified()
      .use(rehypeKatex, {
        trust: false,
        maxExpand: 1000,
        maxSize: 10,
        strict: "ignore",
      })
      .use(rehypeHighlight, { ignoreMissing: true, detect: false })
      .run(safeTree)) as Root;
    return { tree: rendered, headings };
  } catch (error) {
    if (error instanceof RichContentError) throw error;
    throw new RichContentError();
  }
}
