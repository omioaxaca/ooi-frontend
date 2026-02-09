import * as runtime from "react/jsx-runtime";
import { compile, run } from "@mdx-js/mdx";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";

// Custom components for MDX
const components = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className={cn(
        "mt-8 scroll-m-20 text-4xl font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: ComponentPropsWithoutRef<"h5">) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: ComponentPropsWithoutRef<"h6">) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isInternal = href && (href.startsWith("/") || href.startsWith("#"));
    if (isInternal) {
      return (
        <Link
          href={href}
          className={cn("font-medium text-primary underline underline-offset-4", className)}
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("font-medium text-primary underline underline-offset-4", className)}
        {...props}
      />
    );
  },
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-primary/50 pl-6 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  img: ({ className, alt, src, ...props }: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("rounded-lg border border-border my-6", className)}
      alt={alt}
      src={src}
      {...props}
    />
  ),
  hr: ({ ...props }) => <hr className="my-8 border-border" {...props} />,
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={cn("w-full", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className={cn("m-0 border-t border-border p-0 even:bg-muted/50", className)} {...props} />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th
      className={cn(
        "border border-border bg-muted/50 px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td
      className={cn(
        "border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={cn(
        "mb-4 mt-6 overflow-x-auto rounded-lg border border-border bg-zinc-950 p-4 dark:bg-zinc-900",
        className
      )}
      data-code-block="true"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Check if code is inside a pre block by checking for language class or data attribute
    // Code blocks have language- class OR are direct children of pre (handled by parent)
    const isCodeBlock = className?.includes("language-");

    // For inline code
    if (!isCodeBlock) {
      return (
        <code
          className={cn(
            "relative rounded font-mono text-sm bg-zinc-800 px-[0.4rem] py-[0.2rem] text-white",
            className
          )}
          {...props}
        />
      );
    }

    // For code blocks (inside pre)
    return (
      <code
        className={cn(
          "relative font-mono text-sm text-zinc-50",
          className
        )}
        {...props}
      />
    );
  },
  // Custom components you can use in MDX
  Image: ({ alt = "", ...props }: ComponentPropsWithoutRef<typeof Image>) => (
    <Image className="rounded-lg border my-6" alt={alt} {...props} />
  ),
  Callout: ({
    children,
    type = "info",
  }: {
    children: React.ReactNode;
    type?: "info" | "warning" | "error" | "success";
  }) => {
    const styles = {
      info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
      warning:
        "bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100",
      error:
        "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
      success:
        "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    };

    const icons = {
      info: "💡",
      warning: "⚠️",
      error: "❌",
      success: "✅",
    };

    return (
      <div className={cn("my-6 rounded-lg border p-4", styles[type])}>
        <span className="mr-2">{icons[type]}</span>
        {children}
      </div>
    );
  },
  Steps: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 ml-4 border-l-2 border-muted pl-6 [counter-reset:step]">
      {children}
    </div>
  ),
  Step: ({ children }: { children: React.ReactNode }) => (
    <div className="relative mt-6 [counter-increment:step] before:absolute before:-left-[33px] before:flex before:h-8 before:w-8 before:items-center before:justify-center before:rounded-full before:border before:border-muted before:bg-background before:text-sm before:font-medium before:content-[counter(step)]">
      {children}
    </div>
  ),
};

interface MDXContentProps {
  source: string;
}

export async function MDXContent({ source }: MDXContentProps) {
  // Compile MDX to JavaScript
  const code = await compile(source, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, rehypeKatex],
  });

  // Run the compiled code
  const { default: MDXComponent } = await run(String(code), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <div className="mdx-content">
      <MDXComponent components={components} />
    </div>
  );
}

export { components };
