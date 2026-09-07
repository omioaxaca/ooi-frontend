"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  guideHref,
  problemHref,
  isMigrationTag,
  type GuideSummary,
  type ProblemSummary,
} from "@/lib/study-content";
import { solveURL } from "@/lib/study-assets";
import {
  getProblemListView,
  problemDifficultyLabels,
  type ProblemDifficultyFilter,
} from "./problem-filter";

export function StudyTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags
        .filter((tag) => !isMigrationTag(tag))
        .map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="max-w-full whitespace-normal break-words"
          >
            {tag}
          </Badge>
        ))}
    </div>
  );
}

export function GuideMetadata({ guide }: { guide: GuideSummary }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {guide.author && <span>{guide.author}</span>}
      {guide.createdDate && (
        <time dateTime={guide.createdDate}>
          {new Date(guide.createdDate).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </time>
      )}
    </div>
  );
}

export function GuideList({ guides }: { guides: GuideSummary[] }) {
  if (!guides.length)
    return (
      <p className="py-3 text-sm text-muted-foreground">
        Aún no hay guías disponibles para este tema.
      </p>
    );
  return (
    <ul className="divide-y">
      {guides.map((guide) => (
        <li key={guide.documentId} className="min-w-0 py-3">
          <Link
            href={guideHref(guide)}
            className="group flex items-start gap-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ooi-second-blue" />
            <span className="min-w-0 space-y-1">
              <span className="block break-words font-medium text-ooi-second-blue group-hover:underline">
                {guide.title}
              </span>
              {guide.description && (
                <span className="line-clamp-2 break-words text-muted-foreground">
                  {guide.description}
                </span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const difficultyColors = {
  easy: "border-green-300 text-green-700 dark:text-green-300",
  medium: "border-yellow-400 text-yellow-800 dark:text-yellow-300",
  hard: "border-red-300 text-red-700 dark:text-red-300",
};

export function ProblemMetadata({ problem }: { problem: ProblemSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Badge
        variant="outline"
        className={
          problem.difficulty ? difficultyColors[problem.difficulty] : ""
        }
      >
        {problem.difficulty
          ? problemDifficultyLabels[problem.difficulty]
          : "Dificultad no especificada"}
      </Badge>
      <span>{problem.platform ?? "Plataforma no especificada"}</span>
      <span>{problem.language || "Idioma no especificado"}</span>
      <span className="inline-flex items-center gap-1">
        {problem.qualitySeal && (
          <BadgeCheck className="h-4 w-4 text-green-600" />
        )}
        {problem.qualitySeal ? "Sello de calidad" : "Sin sello de calidad"}
      </span>
    </div>
  );
}

export function ProblemList({
  problems,
  topic,
}: {
  problems: ProblemSummary[];
  topic: string;
}) {
  const [difficulty, setDifficulty] = useState<ProblemDifficultyFilter>("all");
  const filterId = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const view = getProblemListView(problems, difficulty);

  if (!problems.length)
    return (
      <p className="py-3 text-sm text-muted-foreground">
        Aún no hay problemas disponibles para este tema.
      </p>
    );
  return (
    <div className="min-w-0 space-y-3 pt-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <label
            htmlFor={filterId}
            className="text-xs font-medium text-muted-foreground"
          >
            Dificultad
          </label>
          <Select
            value={difficulty}
            onValueChange={(value) => {
              if (!Object.hasOwn(problemDifficultyLabels, value)) return;
              setDifficulty(value as ProblemDifficultyFilter);
              viewport.current?.scrollTo({ top: 0 });
            }}
          >
            <SelectTrigger
              id={filterId}
              className="h-9 w-44 max-w-full text-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.keys(
                  problemDifficultyLabels,
                ) as ProblemDifficultyFilter[]
              ).map((value) => (
                <SelectItem key={value} value={value}>
                  {problemDifficultyLabels[value]} ({view.counts[value]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p
          id={`${filterId}-count`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-xs tabular-nums text-muted-foreground"
        >
          {view.problems.length} de {problems.length} problemas
        </p>
      </div>
      <div
        ref={viewport}
        role="region"
        aria-label="Lista de problemas de práctica"
        aria-describedby={`${filterId}-count`}
        tabIndex={0}
        className="h-80 max-h-[60vh] overflow-auto overscroll-contain rounded-md border [scrollbar-gutter:stable] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <table className="w-full min-w-[30rem] table-fixed border-separate border-spacing-0 text-sm">
          <caption className="sr-only">Problemas de práctica del tema</caption>
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th
                scope="col"
                className="sticky top-0 z-10 border-b bg-muted px-3 py-2.5 font-medium"
              >
                Problema
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 w-28 border-b bg-muted px-3 py-2.5 font-medium"
              >
                Dificultad
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 w-28 border-b bg-muted px-3 py-2.5 font-medium"
              >
                Plataforma
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 hidden w-20 border-b bg-muted px-3 py-2.5 font-medium sm:table-cell"
              >
                Idioma
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 w-16 border-b bg-muted px-2 py-2.5 text-center font-medium"
              >
                Resolver
              </th>
            </tr>
          </thead>
          <tbody>
            {view.problems.map((problem) => {
              const source = solveURL(problem);
              return (
                <tr
                  key={problem.documentId}
                  className="hover:bg-muted/40 [&>td]:border-b [&>td]:px-3 [&>td]:py-2 last:[&>td]:border-b-0"
                >
                  <td>
                    <div className="flex items-start gap-1.5">
                      <Link
                        href={problemHref(problem, topic)}
                        title={problem.title}
                        className="min-w-0 line-clamp-2 break-words font-medium text-ooi-second-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {problem.title}
                      </Link>
                      {problem.qualitySeal && (
                        <span
                          title="Sello de calidad"
                          className="mt-0.5 shrink-0"
                        >
                          <BadgeCheck
                            aria-hidden="true"
                            className="h-4 w-4 text-green-600"
                          />
                          <span className="sr-only">Sello de calidad</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge
                      variant="outline"
                      className={`whitespace-normal text-xs ${problem.difficulty ? difficultyColors[problem.difficulty] : "text-muted-foreground"}`}
                    >
                      {problem.difficulty
                        ? problemDifficultyLabels[problem.difficulty]
                        : "Sin definir"}
                    </Badge>
                  </td>
                  <td className="break-words text-xs text-muted-foreground">
                    {problem.platform ?? "Sin plataforma"}
                  </td>
                  <td className="hidden break-words text-xs text-muted-foreground sm:table-cell">
                    {problem.language || "Sin definir"}
                  </td>
                  <td className="text-center">
                    {source ? (
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Resolver ${problem.title} en ${problem.platform ?? "la plataforma original"}`}
                          title="Resolver en la plataforma original"
                        >
                          <ExternalLink
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        </a>
                      </Button>
                    ) : (
                      <span
                        aria-label="Enlace original no disponible"
                        title="Enlace original no disponible"
                        className="text-muted-foreground"
                      >
                        -
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!view.problems.length && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-muted-foreground"
                >
                  No hay problemas con esta dificultad.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
