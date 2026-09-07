import assert from "node:assert/strict";
import test from "node:test";
import { serveStudyRequest, studyErrorResponse } from "../src/lib/study-api.ts";
import axiosInstance from "../src/services/authService.ts";
import { AxiosError } from "axios";
import qs from "qs";
import { fetchStudyData } from "../src/services/studyService.ts";

test("read-only API requires the student's bearer token and never substitutes an admin token", async () => {
  let calls = 0;
  const factory = (authorization) => async () => {
    calls++;
    assert.equal(authorization, "Bearer student-test-session");
    return { data: [], meta: { pagination: { page: 1, pageCount: 0, total: 0 } } };
  };
  const unauthorized = await serveStudyRequest(new Request("https://frontend.test/api/study/curriculum"), ["curriculum"], factory);
  assert.equal(unauthorized.status, 401);
  assert.equal(calls, 0);
  const authorized = await serveStudyRequest(new Request("https://frontend.test/api/study/curriculum", { headers: { Authorization: "Bearer student-test-session" } }), ["curriculum"], factory);
  assert.equal(authorized.status, 200);
  assert.deepEqual(await authorized.json(), { data: [] });
  assert.equal(authorized.headers.get("cache-control"), "private, no-store");
  assert.equal(authorized.headers.get("vary"), "Authorization");
});

test("permission and missing-document responses are distinct from empty collections and omit private errors", async () => {
  for (const status of [401, 403, 404, 429]) {
    const result = studyErrorResponse({ response: { status }, message: "private database connection details" });
    assert.equal(result.status, status);
    assert.ok(!(await result.text()).includes("database"));
  }
  const result = await serveStudyRequest(new Request("https://frontend.test/api/study/users", { headers: { Authorization: "Bearer student-test-session" } }), ["users"], () => async () => { throw new Error("Must not query arbitrary collections"); });
  assert.equal(result.status, 404);
});

test("existing Axios client keeps per-request server credentials and never runs browser refresh on server 401", async () => {
  const original = axiosInstance.defaults.adapter;
  const seen = [];
  axiosInstance.defaults.adapter = async (config) => {
    seen.push(config.headers.Authorization);
    if (config.url === "/unauthorized") throw new AxiosError("Unauthorized", "ERR_BAD_REQUEST", config, null, { status: 401, data: {}, headers: {}, config, statusText: "Unauthorized" });
    return { status: 200, data: { data: { documentId: "flat" } }, headers: {}, config, statusText: "OK" };
  };
  try {
    const result = await axiosInstance.get("/guides", { headers: { Authorization: "Bearer first-session" } });
    assert.deepEqual(result.data, { data: { documentId: "flat" } });
    await assert.rejects(axiosInstance.get("/unauthorized", { headers: { Authorization: "Bearer second-session" } }), /Unauthorized/);
    assert.deepEqual(seen, ["Bearer first-session", "Bearer second-session"]);
  } finally {
    axiosInstance.defaults.adapter = original;
  }
});

test("problem details use the canonical ID, exhaust inverse topic pagination, and render useful imported limits/assets", async () => {
  const parent = (documentId) => ({ documentId, title: documentId, level: "Principiante", rank: 0, category: null });
  const requests = [];
  const response = await serveStudyRequest(new Request("https://frontend.test/api/study/problems/shared", { headers: { Authorization: "Bearer test-session" } }), ["problems", "shared"], () => async (url) => {
    requests.push(url);
    const [pathname, search] = url.split("?");
    const query = qs.parse(search);
    if (pathname === "/api/problems/shared") return { data: {
      documentId: "shared", title: "Suma", description: "## Entrada\n\n![Diagrama](figure.png)",
      constraints: JSON.stringify({ limits: { TimeLimit: 1000 }, statement_images: { "figure.png": "/uploads/figure.png" }, settings: { secret: "private metadata" } }),
      externalProblemId: "suma-alias", alias: "suma-alias", platform: "OMEGAUP", difficulty: "easy", language: "es", qualitySeal: true,
      tags: [{ value: "omegaup-syllabus-import-v1" }, { value: "sumas" }], photos: [], syllabi: [parent("first")],
    } };
    assert.equal(pathname, "/api/syllabi");
    assert.equal(query.filters.problems.documentId.$eq, "shared");
    const page = Number(query.pagination.page);
    return { data: [parent(page === 1 ? "first" : "second")], meta: { pagination: { page, pageCount: 2, total: 2 } } };
  }, "https://api.test");
  assert.equal(response.status, 200);
  const { data } = await response.json();
  assert.equal(data.documentId, "shared");
  assert.deepEqual(data.syllabi.map((entry) => entry.documentId), ["first", "second"]);
  assert.deepEqual(data.tags, ["sumas"]);
  assert.deepEqual(data.limits, [{ label: "Tiempo", value: "1000 ms" }]);
  assert.ok(JSON.stringify(data.content.tree).includes("https://api.test/uploads/figure.png"));
  assert.ok(!JSON.stringify(data.constraintContent).includes("private metadata"));
  assert.equal(data.solveUrl, "https://omegaup.com/arena/problem/suma-alias/");
  assert.equal(requests.length, 3);
});

test("client requests the same-origin API, unwraps data once, and preserves explicit errors instead of returning empty arrays", async () => {
  const original = axiosInstance.defaults.adapter;
  axiosInstance.defaults.adapter = async (config) => {
    assert.equal(config.baseURL, "");
    assert.ok(config.url.startsWith("/api/study/"));
    if (config.url.endsWith("forbidden")) throw new AxiosError("Forbidden", "ERR_BAD_REQUEST", config, null, { status: 403, data: { error: { message: "Sin permiso" } }, headers: {}, config, statusText: "Forbidden" });
    return { status: 200, data: config.url.endsWith("invalid") ? {} : { data: [] }, headers: {}, config, statusText: "OK" };
  };
  try {
    assert.deepEqual(await fetchStudyData("directory"), []);
    await assert.rejects(fetchStudyData("forbidden"), { status: 403, message: "Sin permiso" });
    await assert.rejects(fetchStudyData("invalid"), /inválida/);
  } finally {
    axiosInstance.defaults.adapter = original;
  }
});