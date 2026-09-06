import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";

const root = "content/docs";
const args = process.argv.slice(2);
const checkCpp = args.includes("--cpp");
const filters = args.filter((argument) => !argument.startsWith("--"));
const files = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .flatMap((entry) =>
    fs
      .readdirSync(path.join(root, entry.name))
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => path.join(root, entry.name, file)),
  )
  .filter(
    (file) =>
      filters.length === 0 || filters.some((filter) => file.includes(filter)),
  );
const failures = [];
let examples = 0;

for (const file of files) {
  try {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    if (!data.title || !data.description || !Array.isArray(data.tags))
      throw new Error("Missing guide metadata");
    if (/\$O\([^$\n]+\)`/.test(content))
      throw new Error(
        "Math expression ends with a backtick instead of a dollar sign",
      );
    const blocks = [];
    const inspect = () => (tree) => {
      const visit = (node) => {
        if (node.type === "link" && node.url.startsWith("/blog/")) {
          const segments = new URL(node.url, "https://local.invalid").pathname
            .split("/")
            .filter(Boolean)
            .map(decodeURIComponent);
          if (segments[1] !== "tags") {
            const target = path.join(
              root,
              segments[1],
              segments.length === 3 ? `${segments[2]}.mdx` : "",
            );
            if (!fs.existsSync(target))
              throw new Error(`Broken link: ${node.url}`);
          }
        }
        if (node.type === "code") blocks.push(node);
        for (const child of node.children ?? []) visit(child);
      };
      visit(tree);
    };
    await compile(content, {
      remarkPlugins: [remarkGfm, remarkMath, inspect],
      rehypePlugins: [rehypeSlug, rehypeKatex],
    });
    if (!checkCpp) continue;
    for (const [index, block] of blocks.entries()) {
      if (block.lang !== "cpp" || block.meta !== "test") continue;
      const following = blocks.slice(index + 1);
      const boundary = following.findIndex((next) => next.lang === "cpp");
      const fixtures =
        boundary === -1 ? following : following.slice(0, boundary);
      const input =
        fixtures.find((fixture) => fixture.meta === "input")?.value ?? "";
      const output = fixtures.find(
        (fixture) => fixture.meta === "output",
      )?.value;
      if (output === undefined)
        throw new Error(`C++ example ${index + 1} needs a text output fixture`);
      const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "ooi-guide-"));
      try {
        const executable = path.join(temporary, "example");
        const compiler = spawnSync(
          process.env.CXX ?? "c++",
          [
            "-std=c++17",
            "-O1",
            "-Wall",
            "-Wextra",
            "-x",
            "c++",
            "-",
            "-o",
            executable,
          ],
          {
            input: block.value,
            encoding: "utf8",
            timeout: 30000,
          },
        );
        if (compiler.status !== 0)
          throw new Error(compiler.error?.message ?? compiler.stderr);
        const result = spawnSync(executable, {
          input: `${input}\n`,
          encoding: "utf8",
          timeout: 3000,
        });
        if (result.status !== 0)
          throw new Error(
            result.error?.message ?? result.stderr ?? "Example failed",
          );
        if (result.stdout.trim() !== output.trim())
          throw new Error(
            `Expected ${JSON.stringify(output)}, received ${JSON.stringify(result.stdout.trim())}`,
          );
        examples++;
      } finally {
        fs.rmSync(temporary, { recursive: true, force: true });
      }
    }
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
  }
}

if (files.length === 0) failures.push("No guides matched the requested paths");
console.log(
  `Checked ${files.length} MDX guides${checkCpp ? ` and ${examples} runnable C++17 examples` : ""}.`,
);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
}
