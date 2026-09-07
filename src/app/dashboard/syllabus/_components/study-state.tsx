"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudyRequestError } from "@/services/studyService";

export function StudyLoading() {
  return (
    <div role="status" aria-live="polite" className="min-w-0 space-y-4 py-6">
      <span className="sr-only">Cargando contenido...</span>
      <Skeleton className="h-6 w-2/3 max-w-sm" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function StudyError({
  error,
  retry,
}: {
  error: StudyRequestError;
  retry: () => void;
}) {
  const missing = error.status === 404;
  return (
    <div
      role="alert"
      className="space-y-4 rounded-lg border border-red-200 p-6"
    >
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
        {missing ? "Contenido no encontrado" : "No se pudo cargar el contenido"}
      </h2>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={retry}>
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/syllabus">
            <ArrowLeft className="h-4 w-4" />
            Volver al temario
          </Link>
        </Button>
      </div>
    </div>
  );
}
