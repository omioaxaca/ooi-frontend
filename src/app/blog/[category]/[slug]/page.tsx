import { notFound, redirect } from "next/navigation";
import { legacyGuideDestination } from "@/lib/study-content";

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const destination = legacyGuideDestination(category, slug);
  if (!destination) notFound();
  redirect(destination);
}
