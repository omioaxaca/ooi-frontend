import Link from "next/link";
import Navbar from "@/components/nav-bar";
import { getStudyNavigation } from "@/lib/mdx";
import { StudyLevelLabel } from "@/components/study-level-label";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Guía De Estudio | OOI",
  description:
    "Recursos de estudio, tutoriales y guías para la Olimpiada de Informática",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  const levels = getStudyNavigation();
  const activeLevel = levels.find((level) => level.slug === nivel) ?? levels[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Guía de estudio</h1>
            <p className="text-muted-foreground">
              Programación competitiva en C++
            </p>
          </header>
          <nav
            aria-label="Niveles"
            className="mb-8 flex flex-wrap gap-2 border-b pb-4"
          >
            {levels.map((level) => (
              <Link
                key={level.slug}
                href={`/blog?nivel=${level.slug}`}
                aria-current={
                  activeLevel?.slug === level.slug ? "page" : undefined
                }
                className={cn(
                  "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition-colors",
                  activeLevel?.slug === level.slug
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                <StudyLevelLabel level={level} />
                <span className="text-xs tabular-nums text-muted-foreground">
                  {level.categories.reduce(
                    (total, category) => total + category.posts.length,
                    0,
                  )}
                </span>
              </Link>
            ))}
          </nav>
          {activeLevel && (
            <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
              <nav
                aria-label="Categorías"
                className="lg:sticky lg:top-24 lg:self-start"
              >
                <ol className="space-y-1">
                  {activeLevel.categories.map((category, index) => (
                    <li key={category.slug}>
                      <a
                        href={`#${activeLevel.slug}-${category.slug}`}
                        className="flex items-start gap-3 py-2 text-sm hover:text-primary"
                      >
                        <span className="w-5 shrink-0 tabular-nums text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="min-w-0 break-words">
                          {category.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="min-w-0 space-y-10">
                {activeLevel.categories.map((category, categoryIndex) => (
                  <section
                    key={category.slug}
                    id={`${activeLevel.slug}-${category.slug}`}
                    className="scroll-mt-24"
                  >
                    <h2 className="mb-3 text-xl font-semibold break-words">
                      {category.name}
                    </h2>
                    <ol
                      start={activeLevel.categories
                        .slice(0, categoryIndex)
                        .reduce(
                          (total, section) => total + section.posts.length,
                          1,
                        )}
                      className="ml-7 list-decimal border-t marker:text-muted-foreground marker:text-sm"
                    >
                      {category.posts.map((post) => (
                        <li
                          key={`${post.category}/${post.slug}`}
                          className="border-b pl-2"
                        >
                          <Link
                            href={`/blog/${post.category}/${post.slug}`}
                            className="group flex min-w-0 items-center justify-between gap-4 py-4 hover:text-primary"
                          >
                            <span className="min-w-0 break-words text-sm font-medium sm:text-base">
                              {post.title}
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
                            />
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
