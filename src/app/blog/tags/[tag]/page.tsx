import { notFound, redirect } from "next/navigation";
import { isMigrationTag } from "@/lib/study-content";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  if (isMigrationTag(tag)) notFound();
  redirect(`/dashboard/syllabus/library?tag=${encodeURIComponent(tag)}`);
}
