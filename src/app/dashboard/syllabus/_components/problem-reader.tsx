"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MDXContent } from "@/components/mdx-components";
import { useStudyResource } from "@/hooks/use-study-resource";
import { topicHref } from "@/lib/study-content";
import type { ProblemPayload } from "@/lib/study-api";
import { StudyError, StudyLoading } from "./study-state";
import { ProblemMetadata, StudyTags } from "./resource-lists";
import { LevelNavigation } from "./level-navigation";

export function ProblemReader({
  documentId,
  topicId,
}: {
  documentId: string;
  topicId?: string;
}) {
  const resource = useStudyResource<ProblemPayload>(
    `problems/${encodeURIComponent(documentId)}`,
  );
  useEffect(() => {
    if (resource.data) document.title = `${resource.data.title} | OOI`;
  }, [resource.data]);
  if (resource.loading) return <StudyLoading />;
  if (resource.error)
    return <StudyError error={resource.error} retry={resource.retry} />;
  if (!resource.data) return null;
  const problem = resource.data;
  const topic =
    problem.syllabi.find((entry) => entry.documentId === topicId) ??
    problem.syllabi[0];
  return (
    <div className="min-w-0 space-y-6">
      <LevelNavigation active={topic?.level} />
      <article className="min-w-0 max-w-4xl space-y-8">
        <header className="space-y-4">
          <Link
            href={
              topic ? `${topicHref(topic)}#problemas` : "/dashboard/syllabus"
            }
            className="inline-flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>{topic?.title ?? "Volver al temario"}</span>
          </Link>
          <h1 className="text-3xl font-bold text-ooi-dark-blue break-words">
            {problem.title}
          </h1>
          <ProblemMetadata problem={problem} />
          <StudyTags tags={problem.tags} />
          {problem.externalProblemId && (
            <p className="text-xs text-muted-foreground">
              Identificador original:{" "}
              <span className="break-all font-mono">
                {problem.externalProblemId}
              </span>
            </p>
          )}
          {problem.solveUrl ? (
            <Button asChild>
              <a
                href={problem.solveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Resolver en {problem.platform ?? "la plataforma original"}
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enlace original no disponible.
            </p>
          )}
        </header>
        {problem.description.trim() ? (
          <section aria-label="Enunciado">
            <MDXContent content={problem.content} />
          </section>
        ) : (
          <p className="text-muted-foreground">
            El enunciado aún no está disponible.
          </p>
        )}
        {(problem.limits.length > 0 ||
          problem.constraintContent.tree.children.length > 0 ||
          problem.constraintNotice) && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Límites y restricciones</h2>
            {problem.limits.length > 0 && (
              <dl className="grid gap-4 sm:grid-cols-2">
                {problem.limits.map((limit) => (
                  <div key={limit.label}>
                    <dt className="text-sm text-muted-foreground">
                      {limit.label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-medium">
                      {limit.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <MDXContent content={problem.constraintContent} />
            {problem.constraintNotice && (
              <p className="text-sm text-muted-foreground">
                {problem.constraintNotice}
              </p>
            )}
          </section>
        )}
        {problem.photos.length > 0 && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Imágenes</h2>
            {problem.photos.map((photo, index) => (
              <figure key={`${photo.url}-${index}`} className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={
                    photo.alternativeText || photo.name || "Imagen del problema"
                  }
                  loading="lazy"
                  className="h-auto max-w-full rounded-md border"
                />
                {photo.alternativeText && (
                  <figcaption className="text-sm text-muted-foreground">
                    {photo.alternativeText}
                  </figcaption>
                )}
              </figure>
            ))}
          </section>
        )}
        {problem.syllabi.length > 0 && (
          <nav aria-label="Temas asociados" className="space-y-3 border-t pt-6">
            <h2 className="text-xl font-semibold">Temas asociados</h2>
            <ul className="space-y-2">
              {problem.syllabi.map((parent) => (
                <li key={parent.documentId}>
                  <Link
                    href={`${topicHref(parent)}#problemas`}
                    className="text-sm text-ooi-second-blue hover:underline"
                  >
                    {parent.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </div>
  );
}
