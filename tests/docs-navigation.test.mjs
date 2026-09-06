import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { createProcessor } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  buildStudyNavigation,
  getStudyPostContext,
  getStudyNavigation,
  getAllPosts,
  getAllPostSlugs,
  getPost,
} from "../src/lib/mdx.ts";

const post = (category, slug, title = slug, extra = {}) => ({
  category,
  slug,
  title,
  description: "",
  date: "2026-09-06",
  author: "OOI",
  tags: [],
  readingTime: "1 min read",
  ...extra,
});

const syllabus = [
  {
    slug: "azul",
    name: "Azul",
    color: "AZUL",
    categories: [
      {
        slug: "introduccion",
        name: "Introduccion",
        topics: [
          { path: "fundamentos/segundo", title: "Primer tema" },
          { path: "introduccion/primero", title: "Segundo tema" },
        ],
      },
    ],
  },
  {
    slug: "amarillo",
    name: "Amarillo",
    color: "AMARILLO",
    categories: [
      {
        slug: "matematicas",
        name: "Matematicas",
        topics: [{ path: "matematicas/primos", title: "Numeros primos" }],
      },
    ],
  },
];

test("syllabus order wins over folder, date, title and legacy IDs; URLs stay intact", () => {
  const levels = buildStudyNavigation(
    [
      post("introduccion", "primero", "A", { syllabusId: 1 }),
      post("matematicas", "primos"),
      post("fundamentos", "segundo", "Z", { syllabusId: 99 }),
    ],
    syllabus,
  );
  assert.deepEqual(
    levels.map((level) => level.color),
    ["AZUL", "AMARILLO"],
  );
  assert.deepEqual(
    levels[0].categories[0].posts.map((guide) => [
      guide.title,
      guide.category,
      guide.slug,
    ]),
    [
      ["Primer tema", "fundamentos", "segundo"],
      ["Segundo tema", "introduccion", "primero"],
    ],
  );
});

test("every unassigned published guide appears once in MISC, after the syllabus", () => {
  const levels = buildStudyNavigation(
    [
      post("extra", "bienvenida"),
      post("extra", "borrador", "Draft", { draft: true }),
      post("fundamentos", "segundo"),
      post("introduccion", "primero"),
      post("matematicas", "primos"),
    ],
    syllabus,
  );
  assert.equal(levels.at(-1).color, "MISC");
  assert.deepEqual(
    levels.at(-1).categories[0].posts.map((guide) => guide.slug),
    ["bienvenida"],
  );
  assert.equal(
    levels.flatMap((level) =>
      level.categories.flatMap((category) => category.posts),
    ).length,
    4,
  );
});

test("missing and duplicate references fail visibly instead of dropping lessons", () => {
  assert.throws(
    () => buildStudyNavigation([], syllabus),
    /Syllabus guide not found/,
  );
  assert.throws(
    () =>
      buildStudyNavigation(
        [
          post("fundamentos", "segundo"),
          post("introduccion", "primero"),
          post("matematicas", "primos"),
        ],
        [syllabus[0], syllabus[0]],
      ),
    /Duplicate syllabus guide/,
  );
});

test("previous and next cross folder, section and level boundaries in syllabus order", () => {
  const levels = buildStudyNavigation(
    [
      post("fundamentos", "segundo"),
      post("introduccion", "primero"),
      post("matematicas", "primos"),
      post("extra", "bienvenida"),
    ],
    syllabus,
  );
  const context = getStudyPostContext(levels, "introduccion", "primero");
  assert.equal(context.level.color, "AZUL");
  assert.equal(context.previous.category, "fundamentos");
  assert.equal(context.next.category, "matematicas");
  assert.equal(
    getStudyPostContext(levels, "fundamentos", "segundo").previous,
    null,
  );
  assert.equal(getStudyPostContext(levels, "extra", "bienvenida").next, null);
  assert.equal(getStudyPostContext(levels, "missing", "missing"), null);
});

test("published syllabus has the requested level, category and topic sequence", () => {
  const levels = getStudyNavigation();
  const config = JSON.parse(
    fs.readFileSync("content/docs/_config.json", "utf8"),
  );
  assert.deepEqual(
    levels.map((level) => level.color),
    ["AZUL", "AMARILLO", "VERDE", "MISC"],
  );
  assert.deepEqual(
    levels
      .slice(0, 3)
      .map((level) =>
        level.categories.map((category) => [
          category.slug,
          category.posts.length,
        ]),
      ),
    [
      [
        ["introduccion", 4],
        ["programacion-cpp", 6],
        ["estructuras-de-datos", 6],
        ["recursividad", 6],
        ["busquedas", 6],
        ["iteracion-inteligente", 6],
      ],
      [
        ["matematicas", 8],
        ["comunicacion", 4],
        ["interactivos", 4],
        ["solo-salida", 3],
        ["programacion-dinamica", 3],
        ["estructuras-avanzadas", 5],
        ["arboles", 5],
        ["grafos", 6],
      ],
      [
        ["grafos-intermedios", 5],
        ["strings-avanzados", 6],
        ["arboles-avanzados", 6],
        ["grafos-avanzados", 7],
        ["estructuras-persistentes", 3],
        ["teoria-juegos", 5],
        ["dp-avanzada", 5],
        ["matematicas-avanzadas", 5],
      ],
    ],
  );
  const ordered = levels
    .slice(0, 3)
    .flatMap((level) => level.categories.flatMap((category) => category.posts));
  const configured = config.levels.flatMap((level) =>
    level.categories.flatMap((category) => category.topics),
  );
  assert.equal(ordered.length, 114);
  assert.deepEqual(
    ordered.map((guide) => [`${guide.category}/${guide.slug}`, guide.title]),
    configured.map((topic) => [topic.path, topic.title]),
  );
  const all = levels.flatMap((level) =>
    level.categories.flatMap((category) => category.posts),
  );
  assert.equal(
    new Set(all.map((guide) => `${guide.category}/${guide.slug}`)).size,
    all.length,
  );
  assert.deepEqual(
    new Set(all.map((guide) => `${guide.category}/${guide.slug}`)),
    new Set(getAllPosts().map((guide) => `${guide.category}/${guide.slug}`)),
  );
});

test("all 71 original URLs remain published, including every supplemental MISC guide", () => {
  const original = JSON.parse(
    fs.readFileSync("tests/fixtures/docs-legacy-paths.json", "utf8"),
  );
  assert.equal(original.length, 71);
  const levels = getStudyNavigation();
  const routes = new Set(
    getAllPostSlugs().map((post) => `${post.category}/${post.slug}`),
  );
  for (const originalPath of original) {
    const [category, slug] = originalPath.split("/");
    assert.ok(routes.has(originalPath), originalPath);
    assert.ok(getPost(category, slug), originalPath);
    assert.ok(getStudyPostContext(levels, category, slug), originalPath);
  }
  const assigned = new Set(
    levels
      .slice(0, 3)
      .flatMap((level) =>
        level.categories.flatMap((section) =>
          section.posts.map((post) => `${post.category}/${post.slug}`),
        ),
      ),
  );
  const misc = levels
    .at(-1)
    .categories.flatMap((category) =>
      category.posts.map((post) => `${post.category}/${post.slug}`),
    );
  assert.equal(misc.length, 16);
  assert.deepEqual(
    new Set(misc),
    new Set(original.filter((originalPath) => !assigned.has(originalPath))),
  );
});

test("real previous/next links walk every published guide without skipping category or level boundaries", () => {
  const levels = getStudyNavigation();
  const ordered = levels.flatMap((level) =>
    level.categories.flatMap((section) => section.posts),
  );
  for (const [index, post] of ordered.entries()) {
    const context = getStudyPostContext(levels, post.category, post.slug);
    assert.deepEqual(context.previous, ordered[index - 1] ?? null);
    assert.deepEqual(context.next, ordered[index + 1] ?? null);
  }
});

test("legacy in-article next-topic links agree with the syllabus instead of the old folder order", () => {
  const levels = getStudyNavigation();
  const ordered = levels.flatMap((level) =>
    level.categories.flatMap((section) => section.posts),
  );
  const parser = createProcessor({ remarkPlugins: [remarkGfm, remarkMath] });
  let checked = 0;
  for (const [index, post] of ordered.entries()) {
    const { content } = getPost(post.category, post.slug);
    const tree = parser.parse(content);
    const heading = tree.children.findIndex(
      (node) =>
        node.type === "heading" &&
        node.children.map((child) => child.value ?? "").join("") ===
          "Siguiente paso",
    );
    if (heading === -1) continue;
    const link = tree.children[heading + 1]?.children?.find(
      (node) => node.type === "link",
    );
    const next = ordered[index + 1];
    assert.equal(
      link?.url,
      next ? `/blog/${next.category}/${next.slug}` : "/blog",
      `${post.category}/${post.slug}`,
    );
    checked++;
  }
  assert.ok(checked > 0);
});
