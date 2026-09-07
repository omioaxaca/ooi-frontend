import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";
import { renderRichContent } from "../src/lib/safe-mdx.ts";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

function elements(tree) {
  const found = [];
  const visit = (node) => {
    if (node.type === "element") found.push(node);
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  return found;
}

test("restricted MDX retains components, tables, highlighted C++, math, links and headings", async () => {
  const content = await renderRichContent(`## Caso base

<Callout type="warning">

Texto **importante** con $n^2$.

</Callout>

<Steps>
<Step>

Una tarea.

</Step>
</Steps>

| Valor | Resultado |
| --- | --- |
| 1 | 2 |

<details><summary>Respuesta</summary>Dos.</details>

[Otra guía](/blog/recursion/memorizacion#caso-base)

[Aquí](#caso-base)

\`\`\`cpp
int main() { return 0; }
\`\`\`
`);
  const nodes = elements(content.tree);
  for (const name of [
    "ooi-callout",
    "ooi-steps",
    "ooi-step",
    "table",
    "details",
    "summary",
    "pre",
    "code",
  ])
    assert.ok(
      nodes.some((node) => node.tagName === name),
      name,
    );
  assert.ok(nodes.some((node) => node.properties.className?.includes("katex")));
  assert.ok(
    nodes.some((node) => node.properties.className?.includes("hljs-keyword")),
  );
  assert.deepEqual(content.headings, [
    { id: "study-caso-base", title: "Caso base", depth: 2 },
  ]);
  assert.ok(nodes.some((node) => node.properties.href === "#study-caso-base"));
  assert.ok(
    nodes.some(
      (node) =>
        node.properties.href === "/blog/recursion/memorizacion#caso-base",
    ),
  );
});

test("CMS JavaScript, imports, event handlers, spreads and unknown components are never executed", async () => {
  globalThis.cmsExecuted = false;
  for (const source of [
    "import fs from 'node:fs'\n\nTexto",
    "<Callout {...{type: 'info'}}>Texto</Callout>",
    '<img src="https://safe.test/x.png" onError="alert(1)" />',
    "<Callout type={(() => { globalThis.cmsExecuted = true; return 'info'; })()}>Texto</Callout>",
    "<script>globalThis.cmsExecuted = true</script>",
    "<Unknown>Texto</Unknown>",
  ])
    await assert.rejects(renderRichContent(source), { status: 422 }, source);
  const inert = await renderRichContent(
    "{globalThis.cmsExecuted = true}\n\nDivisores: {1, 2, 3, 6}.",
  );
  assert.ok(
    JSON.stringify(inert.tree).includes("{globalThis.cmsExecuted = true}"),
  );
  assert.ok(JSON.stringify(inert.tree).includes("{1, 2, 3, 6}"));
  assert.equal(globalThis.cmsExecuted, false);
  delete globalThis.cmsExecuted;
});

test("Markdown HTML is sanitized and unsafe URLs never survive into renderer props", async () => {
  const result = await renderRichContent(
    `<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)"><a href="javascript:alert(1)">Ir</a><div style="position:fixed" onclick="alert(1)">Texto</div>`,
    { format: "markdown" },
  );
  const nodes = elements(result.tree);
  assert.ok(
    !nodes.some((node) => ["script", "iframe", "style"].includes(node.tagName)),
  );
  assert.ok(!JSON.stringify(result).includes("javascript:"));
  assert.ok(
    nodes.every(
      (node) =>
        !Object.keys(node.properties).some((property) =>
          /^on|^style$/i.test(property),
        ),
    ),
  );
});

test("images support static JSX dimensions and backend/statement asset resolution", async () => {
  const result = await renderRichContent(
    '<Image src="figure.png" alt="Diagrama" width={300} height={200} />',
    {
      apiBase: "https://api.test",
      assets: { "figure.png": "/uploads/figure.png" },
    },
  );
  const image = elements(result.tree).find((node) => node.tagName === "img");
  assert.equal(image.properties.src, "https://api.test/uploads/figure.png");
  assert.equal(image.properties.width, 300);
});

test("sanitized trees render through React without HTML or JavaScript injection", async () => {
  const content = await renderRichContent(
    '<a href="javascript:alert(1)">Abrir</a>\n\n```js\nthrow new Error("never execute");\n```\n\n$\\href{javascript:alert(1)}{x}$',
    { format: "markdown" },
  );
  const html = renderToStaticMarkup(
    toJsxRuntime(content.tree, { Fragment, jsx, jsxs }),
  );
  assert.doesNotMatch(html, /href="javascript:|<script|onerror=/);
  assert.match(html, /never execute/);
  assert.match(html, /katex/);
});

test("existing local documents remain compatible reference fixtures, not runtime content", async () => {
  const root = "content/docs";
  for (const directory of fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())) {
    for (const name of fs
      .readdirSync(path.join(root, directory.name))
      .filter((name) => name.endsWith(".mdx"))) {
      const file = path.join(root, directory.name, name);
      const { content } = matter(fs.readFileSync(file, "utf8"));
      await assert.doesNotReject(renderRichContent(content), file);
    }
  }
});
