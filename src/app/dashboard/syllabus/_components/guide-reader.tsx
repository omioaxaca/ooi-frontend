"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MDXContent } from "@/components/mdx-components";
import { DocsSidebar, DocsMobileSidebar } from "@/components/docs-sidebar";
import { useStudyResource } from "@/hooks/use-study-resource";
import { guideHref, topicHref } from "@/lib/study-content";
import type { GuidePayload } from "@/lib/study-api";
import { StudyError, StudyLoading } from "./study-state";
import { GuideMetadata, StudyTags } from "./resource-lists";
import { LevelNavigation } from "./level-navigation";

export function GuideReader({ documentId, source }: { documentId: string; source?: string }) {
  const request = documentId === "legacy" ? `guides/legacy?source=${encodeURIComponent(source ?? "")}` : `guides/${encodeURIComponent(documentId)}`;
  const resource = useStudyResource<GuidePayload>(request);
  const router = useRouter();

  useEffect(() => {
    if (!resource.data) return;
    document.title = `${resource.data.title} | OOI`;
    if (documentId === "legacy") router.replace(guideHref(resource.data) + window.location.hash, { scroll: false });
    const scrollToHeading = () => {
      try {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        if (!hash) return;
        const heading = document.getElementById(hash) ?? document.getElementById(`study-${hash}`);
        heading?.scrollIntoView();
      } catch {
        return;
      }
    };
    scrollToHeading();
    window.addEventListener("hashchange", scrollToHeading);
    return () => window.removeEventListener("hashchange", scrollToHeading);
  }, [resource.data, documentId, router]);

  if (resource.loading) return <StudyLoading />;
  if (resource.error) return <StudyError error={resource.error} retry={resource.retry} />;
  if (!resource.data) return null;
  const guide = resource.data;
  const sidebar = { topics: guide.navigation.curriculum, currentTopic: guide.syllabus?.documentId, guides: guide.navigation.siblings, currentGuide: guide.documentId };
  const back = guide.syllabus ? topicHref(guide.syllabus) : "/dashboard/syllabus/library";
  return (
    <div className="min-w-0 space-y-6">
      <LevelNavigation active={guide.syllabus?.level ?? "MISC"} />
      <div className="flex min-w-0 gap-6">
        <DocsSidebar {...sidebar} />
        <div className="min-w-0 flex-1">
          <DocsMobileSidebar {...sidebar} />
          <article className="min-w-0 max-w-3xl space-y-8">
            <header className="space-y-4">
              <Link href={back} className="inline-flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 shrink-0" /><span>{guide.syllabus?.title ?? "MISC"}</span></Link>
              <h1 className="text-3xl font-bold text-ooi-dark-blue break-words">{guide.title}</h1>
              {guide.description && <p className="text-lg text-muted-foreground break-words">{guide.description}</p>}
              <GuideMetadata guide={guide} />
              <StudyTags tags={guide.tags} />
            </header>
            {guide.content.headings.length > 0 && (
              <details className="border-y py-3">
                <summary className="cursor-pointer text-sm font-medium">En esta guía</summary>
                <nav aria-label="Contenido de la guía" className="mt-3">
                  <ul className="space-y-2 text-sm">{guide.content.headings.map((heading) => <li key={heading.id} className={heading.depth > 2 ? "ml-4" : ""}><a href={`#${heading.id}`} className="break-words text-muted-foreground hover:text-primary">{heading.title}</a></li>)}</ul>
                </nav>
              </details>
            )}
            {guide.body.trim() ? <MDXContent content={guide.content} /> : <p className="text-muted-foreground">Esta guía aún no tiene contenido.</p>}
            {guide.syllabus && <Button asChild variant="outline"><Link href={`${back}#problemas`}><Code className="h-4 w-4" />Practicar este tema</Link></Button>}
            <nav aria-label="Guía anterior y siguiente" className="grid gap-4 border-t pt-6 sm:grid-cols-2">
              <div>{guide.navigation.previous && <Link href={guideHref(guide.navigation.previous)} className="flex h-full items-start gap-2 rounded-md border p-4 text-sm hover:bg-accent"><ArrowLeft className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words"><span className="mb-1 block text-xs text-muted-foreground">Anterior</span>{guide.navigation.previous.title}</span></Link>}</div>
              <div>{guide.navigation.next && <Link href={guideHref(guide.navigation.next)} className="flex h-full items-start justify-end gap-2 rounded-md border p-4 text-right text-sm hover:bg-accent"><span className="min-w-0 break-words"><span className="mb-1 block text-xs text-muted-foreground">Siguiente</span>{guide.navigation.next.title}</span><ArrowRight className="h-4 w-4 shrink-0" /></Link>}</div>
            </nav>
          </article>
        </div>
      </div>
    </div>
  );
}