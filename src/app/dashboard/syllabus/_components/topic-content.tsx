"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Code, ExternalLink, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MDXContent } from "@/components/mdx-components";
import { useStudyResource } from "@/hooks/use-study-resource";
import { levelHref, topicHref, type TopicSummary } from "@/lib/study-content";
import type { TopicPayload } from "@/lib/study-api";
import { StudyError, StudyLoading } from "./study-state";
import { GuideList, ProblemList } from "./resource-lists";
import { LevelNavigation } from "./level-navigation";

export function TopicResources({ documentId }: { documentId: string }) {
  const resource = useStudyResource<TopicPayload>(`topics/${encodeURIComponent(documentId)}`);
  if (resource.loading) return <StudyLoading />;
  if (resource.error) return <StudyError error={resource.error} retry={resource.retry} />;
  if (!resource.data) return null;
  return (
    <div className="space-y-6">
      <Button asChild variant="outline" size="sm"><Link href={topicHref(resource.data)}>Abrir tema<ArrowRight className="h-4 w-4" /></Link></Button>
      <TopicMaterial topic={resource.data} />
    </div>
  );
}

export function TopicMaterial({ topic }: { topic: TopicPayload }) {
  return (
    <div className="min-w-0 space-y-8">
      {topic.body.trim() && <section aria-label="Material del tema"><MDXContent content={topic.content} /></section>}
      <section id="guias" className="scroll-mt-20">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ooi-dark-blue"><BookOpen className="h-5 w-5" />Guías de estudio<Badge variant="secondary">{topic.guides.length}</Badge></h2>
        <GuideList guides={topic.guides} />
      </section>
      <section id="problemas" className="scroll-mt-20">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ooi-dark-blue"><Code className="h-5 w-5" />Problemas de práctica<Badge variant="secondary">{topic.problems.length}</Badge></h2>
        <ProblemList problems={topic.problems} topic={topic.documentId} />
      </section>
      {topic.youtubeLinks.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Video className="h-5 w-5 text-red-600" />Videos</h2>
          {topic.youtubeLinks.map((url) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-ooi-second-blue hover:underline"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-all">{url}</span></a>)}
        </section>
      )}
      {topic.pdfLinks.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><FileText className="h-5 w-5" />Documentos</h2>
          {topic.pdfLinks.map((url) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm text-ooi-second-blue hover:underline"><ExternalLink className="mt-0.5 h-4 w-4 shrink-0" /><span className="break-all">{url}</span></a>)}
        </section>
      )}
      {topic.externalReferences.trim() && <section className="space-y-3"><h2 className="text-lg font-semibold">Referencias</h2><MDXContent content={topic.referenceContent} /></section>}
    </div>
  );
}

export function TopicReader({ documentId }: { documentId: string }) {
  const resource = useStudyResource<TopicPayload>(`topics/${encodeURIComponent(documentId)}`);
  const curriculum = useStudyResource<TopicSummary[]>("curriculum");
  if (resource.loading || curriculum.loading) return <StudyLoading />;
  if (resource.error) return <StudyError error={resource.error} retry={resource.retry} />;
  if (curriculum.error) return <StudyError error={curriculum.error} retry={curriculum.retry} />;
  if (!resource.data || !curriculum.data) return null;
  const topic = resource.data;
  const index = curriculum.data.findIndex((entry) => entry.documentId === topic.documentId);
  const previous = curriculum.data[index - 1];
  const next = curriculum.data[index + 1];
  return (
    <div className="min-w-0 space-y-6">
      <LevelNavigation active={topic.level} />
      <Link href={levelHref(topic.level)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{topic.category?.name || "Temario del nivel"}</Link>
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold text-ooi-dark-blue break-words">{topic.title}</h1>
        {topic.description && <MDXContent content={topic.descriptionContent} />}
      </header>
      <TopicMaterial topic={topic} />
      <nav aria-label="Temas anterior y siguiente" className="grid gap-4 border-t pt-6 sm:grid-cols-2">
        <div>{previous && <Link href={topicHref(previous)} className="flex items-start gap-2 text-sm hover:text-primary"><ArrowLeft className="h-4 w-4 shrink-0" /><span>Tema anterior: {previous.title}</span></Link>}</div>
        <div>{next && <Link href={topicHref(next)} className="flex items-start justify-end gap-2 text-right text-sm hover:text-primary"><span>Siguiente tema: {next.title}</span><ArrowRight className="h-4 w-4 shrink-0" /></Link>}</div>
      </nav>
    </div>
  );
}