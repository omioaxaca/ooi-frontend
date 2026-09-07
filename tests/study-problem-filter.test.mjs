import assert from "node:assert/strict";
import test from "node:test";
import { getProblemListView } from "../src/app/dashboard/syllabus/_components/problem-filter.ts";

const problems = Object.freeze([
  Object.freeze({ documentId: "shared", difficulty: "medium", rank: 0 }),
  Object.freeze({ documentId: "easy-first", difficulty: "easy", rank: 0 }),
  Object.freeze({ documentId: "unspecified", difficulty: null, rank: 0 }),
  Object.freeze({ documentId: "easy-second", difficulty: "easy", rank: 0 }),
]);

test("difficulty filter uses actual counts and preserves backend order and document identity", () => {
  const all = getProblemListView(problems, "all");
  assert.equal(all.problems, problems);
  assert.deepEqual(all.counts, {
    all: 4,
    easy: 2,
    medium: 1,
    hard: 0,
    unspecified: 1,
  });
  const easy = getProblemListView(problems, "easy");
  assert.deepEqual(easy.problems, [problems[1], problems[3]]);
  assert.equal(easy.problems[0], problems[1]);
  assert.deepEqual(easy.counts, all.counts);
});

test("unclassified problems remain visible and empty difficulty filters do not fabricate rows", () => {
  assert.deepEqual(getProblemListView(problems, "unspecified").problems, [
    problems[2],
  ]);
  assert.deepEqual(getProblemListView(problems, "hard").problems, []);
  assert.deepEqual(getProblemListView([], "all"), {
    problems: [],
    counts: { all: 0, easy: 0, medium: 0, hard: 0, unspecified: 0 },
  });
});

test("filtering one topic does not consume a shared problem from another topic", () => {
  const first = getProblemListView([problems[0], problems[1]], "medium");
  const second = getProblemListView([problems[0]], "all");
  assert.equal(first.problems[0], second.problems[0]);
  assert.equal(second.counts.all, 1);
});
