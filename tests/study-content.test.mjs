import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeGuideDetail,
  normalizeProblem,
  normalizeProblemDetail,
  normalizeTags,
  fetchStudyCollection,
  guideHref,
  problemHref,
  createStudyRepository,
  legacyGuideDestination,
  legacyLevelDestination,
} from "../src/lib/study-content.ts";
import qs from "qs";
import fs from "node:fs";
import path from "node:path";

const topic = (documentId = "topic-one") => ({
  documentId,
  title: "Recursión",
  level: "Principiante",
  rank: 2,
  category: null,
});
const guide = (documentId = "guide-one") => ({
  id: 999,
  documentId,
  title: "Guía",
  body: "<Callout>Texto</Callout>\n\n```cpp\nint main() {}\n```",
  tags: [
    { value: "c++" },
    { value: "study-guide-import-v1" },
    { value: "study-guide-source:content/docs/recursion/memorizacion.mdx" },
  ],
  syllabus: topic(),
  createdDate: "2026-09-07T00:00:00Z",
});

test("Strapi 5 normalization preserves string bodies and document identity, not export IDs", () => {
  const normalized = normalizeGuideDetail(guide());
  assert.equal(normalized.documentId, "guide-one");
  assert.equal(normalized.body, guide().body);
  assert.deepEqual(normalized.tags, ["c++"]);
  assert.deepEqual(normalized.sourcePaths, ["recursion/memorizacion.mdx"]);
  assert.equal(guideHref(normalized), "/dashboard/syllabus/guides/guide-one");
  assert.throws(
    () => normalizeGuideDetail({ id: 1, attributes: guide() }),
    /Strapi 5/,
  );
  assert.throws(() => normalizeGuideDetail({ ...guide(), body: [] }), /texto/);
});

test("migration tags are hidden and missing relations are errors, not empty content", () => {
  assert.deepEqual(
    normalizeTags([
      { value: "omegaup-syllabus-import-v1" },
      { value: "omegaup-syllabus-link-v1:123" },
      { value: "study-guide-source:../../secret.mdx" },
      { value: "DP" },
      { value: "DP" },
    ]),
    { tags: ["DP"], sourcePaths: [] },
  );
  const missing = guide();
  delete missing.syllabus;
  assert.throws(() => normalizeGuideDetail(missing), /permisos/);
  assert.equal(
    normalizeGuideDetail({ ...guide(), syllabus: null }).syllabus,
    null,
  );
});

test("collection pagination follows backend pageCount even if its page size is capped", async () => {
  const urls = [];
  const data = await fetchStudyCollection(
    async (url) => {
      urls.push(url);
      const page = Number(
        new URL(url, "https://api.invalid").searchParams.get(
          "pagination[page]",
        ),
      );
      return {
        data: [guide(`guide-${page}`)],
        meta: { pagination: { page, pageCount: 3, pageSize: 1, total: 3 } },
      };
    },
    "study-guides",
    { fields: ["title"] },
    normalizeGuideDetail,
  );
  assert.equal(data.length, 3);
  assert.equal(urls.length, 3);
  assert.ok(urls.every((url) => !url.includes("attributes")));
});

test("empty collections remain empty and permission errors propagate", async () => {
  assert.deepEqual(
    await fetchStudyCollection(
      async () => ({
        data: [],
        meta: { pagination: { page: 1, pageCount: 0, total: 0 } },
      }),
      "study-guides",
      {},
      normalizeGuideDetail,
    ),
    [],
  );
  await assert.rejects(
    fetchStudyCollection(
      async () => {
        throw Object.assign(new Error("Forbidden"), { status: 403 });
      },
      "study-guides",
      {},
      normalizeGuideDetail,
    ),
    /Forbidden/,
  );
  await assert.rejects(
    fetchStudyCollection(
      async () => ({ data: [guide()] }),
      "study-guides",
      {},
      normalizeGuideDetail,
    ),
    /inválida/,
  );
});

test("shared problems keep a single document identity and string external aliases", () => {
  const problem = normalizeProblem({
    documentId: "shared",
    title: "Suma",
    externalProblemId: "sumas-faciles",
    difficulty: "easy",
    platform: "OMEGAUP",
    tags: [],
    syllabi: [topic(), topic("topic-two"), topic()],
  });
  assert.equal(problem.externalProblemId, "sumas-faciles");
  assert.equal(problem.syllabi.length, 2);
  assert.equal(problemHref(problem), "/dashboard/syllabus/problems/shared");
});

test("problem details normalize explicit null media without losing the statement or constraints", () => {
  const problem = {
    documentId: "problem-without-photos",
    title: "Suma",
    description: "## Entrada\n\n![Diagrama](figure.png)",
    constraints: JSON.stringify({
      statement_images: { "figure.png": "/uploads/figure.png" },
    }),
    tags: [],
    syllabi: [topic()],
    photos: null,
  };
  for (const photos of [null, []]) {
    const normalized = normalizeProblemDetail({ ...problem, photos });
    assert.deepEqual(normalized.photos, []);
    assert.equal(normalized.documentId, problem.documentId);
    assert.equal(normalized.description, problem.description);
    assert.equal(normalized.constraints, problem.constraints);
    assert.equal(normalized.syllabi[0].documentId, "topic-one");
  }
  const photo = {
    url: "/uploads/figure.png",
    name: "figure.png",
    alternativeText: "Diagram",
  };
  assert.deepEqual(
    normalizeProblemDetail({ ...problem, photos: [photo] }).photos,
    [photo],
  );
  assert.equal(problem.photos, null);
});

test("nullable media does not hide missing population or malformed relation data", () => {
  const problem = { documentId: "problem-one", tags: [], syllabi: [] };
  assert.throws(() => normalizeProblemDetail(problem), /photos.*permisos/);
  for (const photos of [undefined, "", false, {}, { data: [] }]) {
    assert.throws(
      () => normalizeProblemDetail({ ...problem, photos }),
      /tipo lista/,
    );
  }
  assert.throws(
    () => normalizeProblemDetail({ ...problem, photos: null, tags: null }),
    /tipo lista/,
  );
  assert.throws(
    () => normalizeProblemDetail({ ...problem, photos: null, syllabi: null }),
    /tipo lista/,
  );
});

test("topic resources exhaust filtered relations, preserve available order, and deduplicate only within each topic", async () => {
  const requests = [];
  const shared = {
    documentId: "shared",
    title: "Compartido",
    externalProblemId: "alias",
    tags: [],
    syllabi: [topic(), topic("topic-two")],
    rank: 0,
  };
  const repository = createStudyRepository(async (url) => {
    requests.push(url);
    const [pathname, search] = url.split("?");
    const query = qs.parse(search);
    if (pathname.startsWith("/api/syllabi/"))
      return {
        data: {
          ...topic(pathname.split("/").at(-1)),
          body: "Tema",
          youtubeLinks: [],
          pdfLinks: [],
          studyGuides: [{ documentId: "guide-2" }],
          problems: [{ documentId: "shared" }],
        },
      };
    const page = Number(query.pagination.page);
    if (pathname === "/api/study-guides") {
      assert.ok(query.filters.syllabus.documentId.$eq);
      assert.ok(!query.fields.includes("body"));
      return {
        data: [guide(`guide-${page}`)],
        meta: { pagination: { page, pageCount: 2, total: 2 } },
      };
    }
    assert.ok(query.filters.syllabi.documentId.$eq);
    assert.ok(!query.fields.includes("description"));
    assert.ok(!query.sort.some((value) => value.includes("rank")));
    return {
      data: [shared, shared],
      meta: { pagination: { page, pageCount: 1, total: 2 } },
    };
  });
  const first = await repository.topic("topic-one");
  const second = await repository.topic("topic-two");
  assert.deepEqual(
    first.guides.map((entry) => entry.documentId),
    ["guide-2", "guide-1"],
  );
  assert.equal(first.problems.length, 1);
  assert.equal(second.problems[0].documentId, first.problems[0].documentId);
  assert.equal(
    requests.filter((url) => url.startsWith("/api/study-guides?")).length,
    4,
  );
});

test("old URLs resolve by exact provenance and then load a full document, never by title", async () => {
  const requests = [];
  const repository = createStudyRepository(async (url) => {
    requests.push(url);
    if (url.startsWith("/api/study-guides/guide-one?"))
      return { data: guide() };
    const query = qs.parse(url.split("?")[1]);
    assert.ok(
      query.filters.tags.value.$in.includes(
        "study-guide-source:recursion/memorizacion.mdx",
      ),
    );
    return {
      data: [guide()],
      meta: { pagination: { page: 1, pageCount: 1, total: 1 } },
    };
  });
  assert.equal(
    (await repository.legacyGuide("recursion/memorizacion.mdx")).documentId,
    "guide-one",
  );
  assert.equal(requests.length, 2);
  assert.ok(!requests.some((url) => url.includes("filters[title]")));
  await assert.rejects(repository.legacyGuide("../private.mdx"), {
    status: 404,
  });
});

test("missing and ambiguous legacy documents are explicit not-found/conflict states", async () => {
  const empty = createStudyRepository(async () => ({
    data: [],
    meta: { pagination: { page: 1, pageCount: 0, total: 0 } },
  }));
  await assert.rejects(empty.legacyGuide("recursion/memorizacion.mdx"), {
    status: 404,
  });
  assert.deepEqual(await empty.directory(), []);
  const ambiguous = createStudyRepository(async () => ({
    data: [guide("one"), guide("two")],
    meta: { pagination: { page: 1, pageCount: 1, total: 2 } },
  }));
  await assert.rejects(ambiguous.legacyGuide("recursion/memorizacion.mdx"), {
    status: 409,
  });
});

test("every original blog URL redirects to a provenance lookup, including URLs unrelated to the syllabus", () => {
  const paths = JSON.parse(
    fs.readFileSync("tests/fixtures/docs-legacy-paths.json", "utf8"),
  );
  for (const path of paths) {
    const [category, slug] = path.split("/");
    assert.equal(
      legacyGuideDestination(category, slug),
      `/dashboard/syllabus/guides/legacy?source=${encodeURIComponent(path + ".mdx")}`,
    );
  }
  assert.equal(legacyGuideDestination("..", "secrets"), null);
  assert.equal(
    legacyLevelDestination("amarillo"),
    "/dashboard/syllabus/intermediate",
  );
  assert.equal(legacyLevelDestination("misc"), "/dashboard/syllabus/library");
  assert.equal(legacyLevelDestination("verde"), "/dashboard/syllabus/advanced");
});

test("direct-entry navigation uses relation order, skips empty topics and crosses levels into MISC", async () => {
  const topics = [
    topic("first"),
    { ...topic("empty"), rank: 3 },
    { ...topic("last"), level: "Intermedio", rank: 0 },
  ];
  const guides = [
    { ...guide("first-a"), syllabus: topics[0] },
    { ...guide("first-b"), syllabus: topics[0] },
    { ...guide("last-guide"), syllabus: topics[2] },
    { ...guide("extra"), syllabus: null },
  ];
  const repository = createStudyRepository(async (url) => {
    const [pathname, search] = url.split("?");
    const query = qs.parse(search);
    let data;
    if (pathname === "/api/syllabi") data = topics;
    else if (pathname.startsWith("/api/syllabi/")) {
      const id = pathname.split("/").at(-1);
      return {
        data: {
          ...topics.find((entry) => entry.documentId === id),
          studyGuides: guides
            .filter((entry) => entry.syllabus?.documentId === id)
            .map(({ documentId }) => ({ documentId })),
        },
      };
    } else {
      assert.ok(!query.fields.includes("body"));
      const filter = query.filters.syllabus.documentId;
      data = guides
        .filter((entry) =>
          filter.$null
            ? !entry.syllabus
            : entry.syllabus?.documentId === filter.$eq,
        )
        .reverse();
    }
    return {
      data,
      meta: {
        pagination: {
          page: 1,
          pageCount: data.length ? 1 : 0,
          total: data.length,
        },
      },
    };
  });
  const middle = await repository.guideNavigation(
    normalizeGuideDetail(guides[1]),
  );
  assert.equal(middle.previous.documentId, "first-a");
  assert.equal(middle.next.documentId, "last-guide");
  assert.deepEqual(
    middle.siblings.map((entry) => entry.documentId),
    ["first-a", "first-b"],
  );
  const last = await repository.guideNavigation(
    normalizeGuideDetail(guides[2]),
  );
  assert.equal(last.previous.documentId, "first-b");
  assert.equal(last.next.documentId, "extra");
  const extra = await repository.guideNavigation(
    normalizeGuideDetail(guides[3]),
  );
  assert.equal(extra.previous.documentId, "last-guide");
  assert.equal(extra.next, null);
});

test("application routes and UI never import the local filesystem content loader", () => {
  const check = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) check(file);
      else if (/\.[jt]sx?$/.test(entry.name)) {
        const source = fs.readFileSync(file, "utf8");
        assert.doesNotMatch(source, /["'][^"']*\/lib\/mdx(?:\.ts)?["']/, file);
        assert.doesNotMatch(source, /readFileSync\([^)]*content\/docs/, file);
      }
    }
  };
  for (const root of ["src/app", "src/components", "src/services", "src/hooks"])
    check(root);
});
