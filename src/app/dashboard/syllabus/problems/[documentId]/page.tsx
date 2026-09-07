import { SyllabusShell } from "../../_components/syllabus-shell";
import { ProblemReader } from "../../_components/problem-reader";

export default async function ProblemPage({ params, searchParams }: {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ tema?: string }>;
}) {
  const [{ documentId }, { tema }] = await Promise.all([params, searchParams]);
  return <SyllabusShell section="Problema de práctica"><ProblemReader key={documentId} documentId={documentId} topicId={tema} /></SyllabusShell>;
}