"use client";

import { useStudyResource } from "@/hooks/use-study-resource";
import { isMigrationTag, type GuideSummary } from "@/lib/study-content";
import { GuideList } from "./resource-lists";
import { StudyError, StudyLoading } from "./study-state";
import { LevelNavigation } from "./level-navigation";

export function GuideDirectory({
  category,
  tag,
}: {
  category?: string;
  tag?: string;
}) {
  const parameters = new URLSearchParams();
  if (category) parameters.set("category", category);
  if (tag) parameters.set("tag", tag);
  const resource = useStudyResource<GuideSummary[]>(`directory?${parameters}`);
  return (
    <div className="min-w-0 space-y-6">
      <LevelNavigation active={!category && !tag ? "MISC" : undefined} />
      <h1 className="text-2xl font-semibold text-ooi-dark-blue break-words">
        {tag && !isMigrationTag(tag)
          ? `Guías: ${tag}`
          : category
            ? "Guías de estudio"
            : "MISC"}
      </h1>
      {resource.loading ? (
        <StudyLoading />
      ) : resource.error ? (
        <StudyError error={resource.error} retry={resource.retry} />
      ) : (
        resource.data && (
          <>
            <p className="text-sm text-muted-foreground">
              {resource.data.length}{" "}
              {resource.data.length === 1
                ? "guía disponible"
                : "guías disponibles"}
            </p>
            {resource.data.length ? (
              <GuideList guides={resource.data} />
            ) : (
              <p className="text-muted-foreground">
                No hay guías disponibles en esta sección.
              </p>
            )}
          </>
        )
      )}
    </div>
  );
}
