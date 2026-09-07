import { SyllabusShell } from "../_components/syllabus-shell";
import { GuideDirectory } from "../_components/guide-directory";

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
  const { category, tag } = await searchParams;
  return <SyllabusShell section="Guías de estudio"><GuideDirectory category={category} tag={tag} /></SyllabusShell>;
}