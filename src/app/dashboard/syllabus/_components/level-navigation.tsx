import Link from "next/link";
import {
  studyLevels,
  levelHref,
  type StudyLevelValue,
} from "@/lib/study-content";
import { StudyLevelLabel } from "@/components/study-level-label";
import { cn } from "@/lib/utils";

export function LevelNavigation({
  active,
}: {
  active?: StudyLevelValue | "MISC";
}) {
  return (
    <nav
      aria-label="Niveles del temario"
      className="flex flex-wrap gap-2 border-b pb-4"
    >
      {studyLevels.map((level) => (
        <Link
          key={level.slug}
          href={levelHref(level.value)}
          aria-current={active === level.value ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
            active === level.value && "bg-accent text-accent-foreground",
          )}
        >
          <StudyLevelLabel level={level} />
          <span className="ml-2 text-muted-foreground">{level.value}</span>
        </Link>
      ))}
      <Link
        href="/dashboard/syllabus/library"
        aria-current={active === "MISC" ? "page" : undefined}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
          active === "MISC" && "bg-accent",
        )}
      >
        <StudyLevelLabel level={{ name: "MISC", color: "MISC" }} />
      </Link>
    </nav>
  );
}
