import { redirect } from "next/navigation";
import { legacyLevelDestination } from "@/lib/study-content";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  redirect(legacyLevelDestination(nivel));
}
