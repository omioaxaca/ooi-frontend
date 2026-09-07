import assert from "node:assert/strict";
import test from "node:test";
import {
  contentURL,
  safeWebURL,
  solveURL,
  parseProblemConstraints,
  dashboardReturnPath,
} from "../src/lib/study-assets.ts";

test("URLs reject unsafe protocols, credentials, control characters and protocol-relative redirects", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///etc/passwd",
    "https://user:secret@example.com/a",
    "https:\\evil.test",
    "//evil.test/a",
    "java\nscript:alert(1)",
  ]) {
    assert.equal(contentURL(url), null, url);
  }
  assert.equal(
    contentURL("/blog/recursion/memorizacion#caso-base"),
    "/blog/recursion/memorizacion#caso-base",
  );
  assert.equal(
    contentURL("/uploads/figure.png", true, { apiBase: "https://api.test" }),
    "https://api.test/uploads/figure.png",
  );
  assert.equal(
    safeWebURL("https://cses.fi/problemset/task/1/"),
    "https://cses.fi/problemset/task/1/",
  );
  assert.equal(dashboardReturnPath("//evil.test"), "/dashboard");
  assert.equal(
    dashboardReturnPath("/dashboard/syllabus/guides/abc?tema=def#inicio"),
    "/dashboard/syllabus/guides/abc?tema=def#inicio",
  );
});

test("problem links preserve aliases and never interpret every external ID as a numeric export ID", () => {
  assert.equal(
    solveURL({
      platform: "OMEGAUP",
      sourceURL: "",
      alias: "sumas-faciles",
      externalProblemId: "alias-not-a-number",
    }),
    "https://omegaup.com/arena/problem/sumas-faciles/",
  );
  assert.equal(
    solveURL({
      platform: "UVA",
      sourceURL: "",
      alias: "",
      externalProblemId: "100",
    }),
    null,
  );
  assert.equal(
    solveURL({
      platform: "CODEFORCES",
      sourceURL: "",
      alias: "",
      externalProblemId: "123A",
    }),
    "https://codeforces.com/problemset/problem/123/A",
  );
  assert.equal(
    solveURL({
      platform: "CSES",
      sourceURL: "javascript:alert(1)",
      alias: "",
      externalProblemId: "1",
    }),
    null,
  );
});

test("imported limits and assets are extracted defensively without exposing raw settings", () => {
  const parsed = parseProblemConstraints(
    JSON.stringify({
      settings: {
        limits: { TimeLimit: 1000, MemoryLimit: 33554432 },
        validator: { secret: "not for display" },
      },
      statement_sources: {
        es: "https://assets.test/problem/statements/es.markdown",
      },
      statement_images: {
        "images/diagram.png": "/uploads/diagram.png",
        "bad.png": "javascript:alert(1)",
      },
    }),
    [
      {
        name: "photo.png",
        url: "/uploads/photo.png",
        alternativeText: "Diagrama",
      },
    ],
    "https://api.test",
    "es",
  );
  assert.deepEqual(parsed.limits, [
    { label: "Tiempo", value: "1000 ms" },
    { label: "Memoria", value: "32 MiB" },
  ]);
  assert.equal(parsed.prose, "");
  assert.equal(
    contentURL("images/diagram.png", true, parsed),
    "https://api.test/uploads/diagram.png",
  );
  assert.equal(
    contentURL("photo.png", true, parsed),
    "https://api.test/uploads/photo.png",
  );
  assert.equal(
    contentURL("relative.png", true, parsed),
    "https://assets.test/problem/statements/relative.png",
  );
  assert.equal(parsed.assets["bad.png"], undefined);
});

test("legacy prose stays readable; malformed or unsupported import JSON is not dumped into the page", () => {
  assert.equal(
    parseProblemConstraints("$1 \\le n \\le 100$").prose,
    "$1 \\le n \\le 100$",
  );
  for (const source of ["{broken", "[]"]) {
    const parsed = parseProblemConstraints(source);
    assert.equal(parsed.prose, "");
    assert.ok(parsed.warning);
  }
  assert.deepEqual(parseProblemConstraints("{}").limits, []);
});
