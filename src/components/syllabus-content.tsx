"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Book, Video, FileText, ExternalLink, Layers } from "lucide-react";
import type {
  SyllabusLevel,
  SyllabusByCategory,
} from "@/types/dashboard/syllabus";
import { fetchSyllabiByLevelGrouped } from "@/services/syllabusService";

interface SyllabusContentProps {
  level: SyllabusLevel;
  title: string;
}

export function SyllabusContent({ level, title }: SyllabusContentProps) {
  const [groupedSyllabi, setGroupedSyllabi] = useState<SyllabusByCategory[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSyllabi = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSyllabiByLevelGrouped(level);
        setGroupedSyllabi(data);
      } catch (err) {
        console.error("Error loading syllabi:", err);
        setError(
          "No se pudieron cargar los temas. Intenta de nuevo más tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSyllabi();
  }, [level]);

  if (loading) {
    return <SyllabusLoadingSkeleton />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 text-center">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (groupedSyllabi.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              Aún no hay temas disponibles para el nivel {title.toLowerCase()}.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary of categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-ooi-dark-blue">
              Categorías del nivel {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupedSyllabi.map((group) => (
                <div
                  key={group.category.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: group.category.color,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block h-3 w-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.category.color }}
                      />
                      <h3 className="font-semibold text-sm truncate">
                        {group.category.name}
                      </h3>
                    </div>
                    {group.category.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {group.category.description}
                      </p>
                    )}
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {group.syllabi.length}{" "}
                      {group.syllabi.length === 1 ? "tema" : "temas"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Syllabi grouped by category */}
      {groupedSyllabi.map((group, groupIndex) => (
        <motion.div
          key={group.category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + groupIndex * 0.1 }}
        >
          <Card className="overflow-hidden">
            <div
              className="h-1.5"
              style={{ backgroundColor: group.category.color }}
            />
            <CardHeader>
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${group.category.color}20`,
                    color: group.category.color,
                  }}
                >
                  <Layers className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <CardTitle className="text-lg text-ooi-dark-blue">
                    {group.category.name}
                  </CardTitle>
                  {group.category.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {group.category.description}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: group.category.color,
                    color: group.category.color,
                  }}
                >
                  {group.syllabi.length}{" "}
                  {group.syllabi.length === 1 ? "tema" : "temas"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion type="single" collapsible className="space-y-2">
                {group.syllabi.map((syllabus) => (
                  <AccordionItem
                    key={syllabus.documentId}
                    value={syllabus.documentId}
                    className="rounded-lg border px-4"
                  >
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex flex-col items-start text-left">
                        <h3 className="font-medium text-base">
                          {syllabus.title}
                        </h3>
                        {syllabus.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {syllabus.description}
                          </p>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        {/* YouTube Links */}
                        {syllabus.youtubeLinks &&
                          syllabus.youtubeLinks.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Video className="h-4 w-4 text-red-500" />
                                Videos
                              </h4>
                              <div className="space-y-2">
                                {syllabus.youtubeLinks.map((link) => (
                                  <a
                                    key={link.id}
                                    href={link.value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 rounded-md border p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                      <Video className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm text-blue-600 hover:underline truncate">
                                      {link.value}
                                    </span>
                                    <ExternalLink className="h-3 w-3 ml-auto text-gray-400 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* PDF Links */}
                        {syllabus.pdfLinks && syllabus.pdfLinks.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              Documentos
                            </h4>
                            <div className="space-y-2">
                              {syllabus.pdfLinks.map((link) => (
                                <a
                                  key={link.id}
                                  href={link.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 rounded-md border p-3 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-4 w-4" />
                                  </div>
                                  <span className="text-sm text-blue-600 hover:underline truncate">
                                    {link.value}
                                  </span>
                                  <ExternalLink className="h-3 w-3 ml-auto text-gray-400 flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* External References */}
                        {syllabus.externalReferences && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                              <Book className="h-4 w-4 text-green-500" />
                              Referencias externas
                            </h4>
                            <div className="rounded-md border p-3 bg-gray-50">
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {syllabus.externalReferences}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Empty state for a syllabus with no resources */}
                        {(!syllabus.youtubeLinks ||
                          syllabus.youtubeLinks.length === 0) &&
                          (!syllabus.pdfLinks ||
                            syllabus.pdfLinks.length === 0) &&
                          !syllabus.externalReferences && (
                            <p className="text-sm text-gray-400 italic">
                              Aún no hay recursos disponibles para este tema.
                            </p>
                          )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function SyllabusLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {[1, 2].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-1.5 bg-gray-200" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="rounded-lg border p-4">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
