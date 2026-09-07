"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, FileText, FolderOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StudyLevelLabel } from "@/components/study-level-label";
import { studyLevels, levelHref, groupStudyTopics, topicHref, guideHref, type TopicSummary, type GuideSummary } from "@/lib/study-content";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  topics: TopicSummary[];
  currentTopic?: string;
  guides: GuideSummary[];
  currentGuide: string;
}

function Navigation({ topics, currentTopic, guides, currentGuide, onNavigate }: DocsSidebarProps & { onNavigate?: () => void }) {
  return (
    <div className="space-y-3">
      {studyLevels.map((level) => {
        const entries = topics.filter((topic) => topic.level === level.value);
        return (
          <details key={level.slug} open={entries.some((topic) => topic.documentId === currentTopic)} className="group">
            <summary className="cursor-pointer rounded-md px-2 py-2 text-sm font-semibold hover:bg-accent"><StudyLevelLabel level={level} /></summary>
            <Link href={levelHref(level.value)} onClick={onNavigate} className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Temario {level.name}</Link>
            {groupStudyTopics(entries).map((group) => (
              <div key={group.category?.documentId ?? "uncategorized"} className="mb-4">
                <h3 className="px-2 py-2 text-xs font-semibold text-muted-foreground break-words">{group.category?.name ?? "Sin categoría"}</h3>
                <ol className="space-y-1 border-l pl-2">
                  {group.topics.map((topic) => (
                    <li key={topic.documentId}>
                      <Link href={topicHref(topic)} onClick={onNavigate} className={cn("block rounded-md px-2 py-2 text-sm break-words hover:bg-accent", topic.documentId === currentTopic && "font-semibold bg-accent/50")}>
                        {topic.title}
                      </Link>
                      {topic.documentId === currentTopic && <GuideLinks guides={guides} currentGuide={currentGuide} onNavigate={onNavigate} />}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </details>
        );
      })}
      <div className="border-t pt-3">
        <Link href="/dashboard/syllabus/library" onClick={onNavigate} className="block px-2 py-2 text-sm font-semibold"><StudyLevelLabel level={{ name: "MISC", color: "MISC" }} /></Link>
        {!currentTopic && <GuideLinks guides={guides} currentGuide={currentGuide} onNavigate={onNavigate} />}
      </div>
    </div>
  );
}

function GuideLinks({ guides, currentGuide, onNavigate }: Pick<DocsSidebarProps, "guides" | "currentGuide"> & { onNavigate?: () => void }) {
  return <ul className="ml-2 space-y-1 border-l pl-2">{guides.map((guide) => (
    <li key={guide.documentId}><Link href={guideHref(guide)} onClick={onNavigate} aria-current={guide.documentId === currentGuide ? "page" : undefined}
      className={cn("flex items-start gap-2 rounded-md px-2 py-2 text-sm break-words hover:bg-accent", guide.documentId === currentGuide ? "bg-accent font-medium" : "text-muted-foreground")}>
      <FileText className="mt-0.5 h-4 w-4 shrink-0" /><span className="min-w-0">{guide.title}</span>
    </Link></li>
  ))}</ul>;
}

export function DocsSidebar(props: DocsSidebarProps) {
  const pathname = usePathname();
  return <aside className="hidden w-60 shrink-0 xl:block"><div className="sticky top-4 h-[calc(100vh-2rem)]"><ScrollArea className="h-full pr-4"><nav aria-label="Temario de estudio"><Navigation key={pathname} {...props} /></nav></ScrollArea></div></aside>;
}

export function DocsMobileSidebar(props: DocsSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="xl:hidden">
      <CollapsibleTrigger className="mb-4 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium"><FolderOpen className="h-4 w-4" />Temario{open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</CollapsibleTrigger>
      <CollapsibleContent><nav aria-label="Temario de estudio" className="mb-6 border-y py-3"><Navigation key={pathname} {...props} onNavigate={() => setOpen(false)} /></nav></CollapsibleContent>
    </Collapsible>
  );
}