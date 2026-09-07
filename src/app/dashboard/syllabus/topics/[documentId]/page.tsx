import { SyllabusShell } from "../../_components/syllabus-shell";
import { TopicReader } from "../../_components/topic-content";

export default async function TopicPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = await params;
  return <SyllabusShell section="Tema"><TopicReader key={documentId} documentId={documentId} /></SyllabusShell>;
}