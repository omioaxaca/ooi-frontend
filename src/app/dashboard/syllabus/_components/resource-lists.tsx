import Link from "next/link";
import { BadgeCheck, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { guideHref, problemHref, isMigrationTag, type GuideSummary, type ProblemSummary } from "@/lib/study-content";
import { solveURL } from "@/lib/study-assets";

export function StudyTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.filter((tag) => !isMigrationTag(tag)).map((tag) => <Badge key={tag} variant="secondary" className="max-w-full whitespace-normal break-words">{tag}</Badge>)}
    </div>
  );
}

export function GuideMetadata({ guide }: { guide: GuideSummary }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {guide.author && <span>{guide.author}</span>}
      {guide.createdDate && <time dateTime={guide.createdDate}>{new Date(guide.createdDate).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>}
    </div>
  );
}

export function GuideList({ guides }: { guides: GuideSummary[] }) {
  if (!guides.length) return <p className="py-3 text-sm text-muted-foreground">Aún no hay guías disponibles para este tema.</p>;
  return (
    <ul className="divide-y">
      {guides.map((guide) => (
        <li key={guide.documentId} className="min-w-0 space-y-2 py-4">
          <Link href={guideHref(guide)} className="flex items-start gap-2 font-medium text-ooi-second-blue hover:underline">
            <FileText className="mt-0.5 h-4 w-4 shrink-0" /><span className="min-w-0 break-words">{guide.title}</span>
          </Link>
          {guide.description && <p className="text-sm text-muted-foreground break-words">{guide.description}</p>}
          <GuideMetadata guide={guide} />
          <StudyTags tags={guide.tags} />
        </li>
      ))}
    </ul>
  );
}

const difficultyNames = { easy: "Fácil", medium: "Media", hard: "Difícil" };
const difficultyColors = {
  easy: "border-green-300 text-green-700 dark:text-green-300",
  medium: "border-yellow-400 text-yellow-800 dark:text-yellow-300",
  hard: "border-red-300 text-red-700 dark:text-red-300",
};

export function ProblemMetadata({ problem }: { problem: ProblemSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Badge variant="outline" className={problem.difficulty ? difficultyColors[problem.difficulty] : ""}>
        {problem.difficulty ? difficultyNames[problem.difficulty] : "Dificultad no especificada"}
      </Badge>
      <span>{problem.platform ?? "Plataforma no especificada"}</span>
      <span>{problem.language || "Idioma no especificado"}</span>
      <span className="inline-flex items-center gap-1">
        {problem.qualitySeal && <BadgeCheck className="h-4 w-4 text-green-600" />}
        {problem.qualitySeal ? "Sello de calidad" : "Sin sello de calidad"}
      </span>
    </div>
  );
}

export function ProblemList({ problems, topic }: { problems: ProblemSummary[]; topic: string }) {
  if (!problems.length) return <p className="py-3 text-sm text-muted-foreground">Aún no hay problemas disponibles para este tema.</p>;
  return (
    <ul className="divide-y">
      {problems.map((problem) => {
        const source = solveURL(problem);
        return (
          <li key={problem.documentId} className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:justify-between">
            <div className="min-w-0 space-y-2">
              <Link href={problemHref(problem, topic)} className="font-medium text-ooi-second-blue hover:underline break-words">{problem.title}</Link>
              <ProblemMetadata problem={problem} />
              <StudyTags tags={problem.tags} />
            </div>
            {source && <Button asChild size="sm" variant="outline" className="shrink-0"><a href={source} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" />Resolver</a></Button>}
          </li>
        );
      })}
    </ul>
  );
}