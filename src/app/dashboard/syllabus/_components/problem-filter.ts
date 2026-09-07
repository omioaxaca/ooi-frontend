import type { ProblemSummary } from "@/lib/study-content";

export const problemDifficultyLabels = {
  all: "Todas",
  easy: "Fácil",
  medium: "Media",
  hard: "Difícil",
  unspecified: "Sin especificar",
};

export type ProblemDifficultyFilter = keyof typeof problemDifficultyLabels;

export function getProblemListView(
  problems: ProblemSummary[],
  difficulty: ProblemDifficultyFilter,
) {
  const counts = {
    all: problems.length,
    easy: 0,
    medium: 0,
    hard: 0,
    unspecified: 0,
  };
  for (const problem of problems) counts[problem.difficulty ?? "unspecified"]++;

  return {
    counts,
    problems:
      difficulty === "all"
        ? problems
        : problems.filter(
            (problem) => (problem.difficulty ?? "unspecified") === difficulty,
          ),
  };
}
