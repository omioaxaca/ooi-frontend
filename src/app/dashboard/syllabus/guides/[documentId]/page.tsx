import { SyllabusShell } from "../../_components/syllabus-shell";
import { GuideReader } from "../../_components/guide-reader";

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ documentId: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const [{ documentId }, { source }] = await Promise.all([
    params,
    searchParams,
  ]);
  return (
    <SyllabusShell section="Guía de estudio">
      <GuideReader
        key={`${documentId}-${source ?? ""}`}
        documentId={documentId}
        source={source}
      />
    </SyllabusShell>
  );
}
