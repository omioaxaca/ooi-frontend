import type { StudyLevel } from "@/lib/mdx";

const colors = {
  AZUL: "bg-blue-600",
  AMARILLO: "bg-yellow-400 ring-1 ring-yellow-600/40",
  VERDE: "bg-green-600",
  MISC: "bg-zinc-400",
};

export function StudyLevelLabel({
  level,
}: {
  level: Pick<StudyLevel, "color" | "name">;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${colors[level.color]}`}
      />
      {level.name}
    </span>
  );
}
