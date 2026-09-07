"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudyResource } from "@/hooks/use-study-resource";
import {
  groupStudyTopics,
  topicHref,
  type StudyLevelValue,
  type TopicSummary,
} from "@/lib/study-content";
import { LevelNavigation } from "./level-navigation";
import { TopicResources } from "./topic-content";
import { StudyError, StudyLoading } from "./study-state";

export function LevelContent({
  level,
  title,
}: {
  level: StudyLevelValue;
  title: string;
}) {
  const resource = useStudyResource<TopicSummary[]>(
    `curriculum?level=${encodeURIComponent(level)}`,
  );
  const [openTopic, setOpenTopic] = useState("");
  const groups = groupStudyTopics(resource.data ?? []);
  return (
    <div className="min-w-0 space-y-6">
      <LevelNavigation active={level} />
      {resource.loading ? (
        <StudyLoading />
      ) : resource.error ? (
        <StudyError error={resource.error} retry={resource.retry} />
      ) : !groups.length ? (
        <p className="py-8 text-center text-muted-foreground">
          Aún no hay temas disponibles para el nivel {title.toLowerCase()}.
        </p>
      ) : (
        <>
          <nav
            aria-label="Categorías del nivel"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {groups.map((group) => (
              <a
                key={group.category?.documentId ?? "uncategorized"}
                href={`#category-${group.category?.documentId ?? "uncategorized"}`}
                className="min-w-0 rounded-lg border border-l-4 p-4 hover:bg-accent"
                style={{ borderLeftColor: group.category?.color ?? "#64748b" }}
              >
                <span className="block break-words text-sm font-semibold">
                  {group.category?.name ?? "Sin categoría"}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {group.topics.length}{" "}
                  {group.topics.length === 1 ? "tema" : "temas"}
                </span>
              </a>
            ))}
          </nav>
          {groups.map((group) => (
            <Card
              key={group.category?.documentId ?? "uncategorized"}
              id={`category-${group.category?.documentId ?? "uncategorized"}`}
              className="scroll-mt-20 min-w-0 overflow-hidden"
            >
              <div
                className="h-1.5"
                style={{ backgroundColor: group.category?.color ?? "#64748b" }}
              />
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg text-ooi-dark-blue">
                  <Layers className="mt-0.5 h-5 w-5 shrink-0" />
                  <span className="min-w-0 flex-1 break-words">
                    {group.category?.name ?? "Sin categoría"}
                  </span>
                  <Badge variant="outline">{group.topics.length}</Badge>
                </CardTitle>
                {group.category?.description && (
                  <p className="text-sm text-muted-foreground">
                    {group.category.description}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Accordion
                  type="single"
                  collapsible
                  value={openTopic}
                  onValueChange={setOpenTopic}
                  className="space-y-2"
                >
                  {group.topics.map((topic) => (
                    <AccordionItem
                      key={topic.documentId}
                      value={topic.documentId}
                      className="min-w-0 rounded-lg border px-4"
                    >
                      <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <AccordionTrigger className="w-full min-w-0 items-center gap-3 py-4 text-left hover:no-underline">
                            <span className="min-w-0 space-y-1">
                              <span className="block break-words text-base font-medium">
                                {topic.title}
                              </span>
                              {topic.description && (
                                <span className="line-clamp-2 break-words text-sm font-normal text-muted-foreground">
                                  {topic.description}
                                </span>
                              )}
                            </span>
                          </AccordionTrigger>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 shrink-0 px-0 sm:w-auto sm:px-3"
                        >
                          <Link
                            href={topicHref(topic)}
                            aria-label={`Abrir tema: ${topic.title}`}
                            title={`Abrir tema: ${topic.title}`}
                          >
                            <span className="hidden sm:inline">Abrir tema</span>
                            <ArrowRight
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          </Link>
                        </Button>
                      </div>
                      <AccordionContent className="min-w-0 pb-5">
                        {openTopic === topic.documentId && (
                          <TopicResources documentId={topic.documentId} />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
