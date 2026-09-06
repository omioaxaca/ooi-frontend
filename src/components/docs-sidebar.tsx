"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category, StudyLevel } from "@/lib/mdx";
import { StudyLevelLabel } from "@/components/study-level-label";
import { ChevronDown, ChevronRight, FileText, FolderOpen } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsSidebarProps {
  levels: StudyLevel[];
}

export function DocsSidebar({ levels }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 h-[calc(100vh-5rem)]">
        <ScrollArea className="h-full pb-10">
          <nav aria-label="Temario" className="pr-4 py-6">
            <div className="space-y-2">
              {levels.map((level) => (
                <LevelSection
                  key={`${level.slug}-${pathname}`}
                  level={level}
                  pathname={pathname}
                />
              ))}
            </div>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}

function LevelSection({
  level,
  pathname,
  onNavigate,
}: {
  level: StudyLevel;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(
    level.categories.some((category) =>
      category.posts.some(
        (post) => pathname === `/blog/${post.category}/${post.slug}`,
      ),
    ),
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-3 text-sm font-semibold hover:bg-accent">
        <StudyLevelLabel level={level} />
        {isOpen ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Link
          href={`/blog?nivel=${level.slug}`}
          onClick={onNavigate}
          className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Temario {level.name}
        </Link>
        {level.categories.map((category) => (
          <CategorySection
            key={category.slug}
            category={category}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface CategorySectionProps {
  category: Category;
  pathname: string;
  onNavigate?: () => void;
}

function CategorySection({
  category,
  pathname,
  onNavigate,
}: CategorySectionProps) {
  const isActive = category.posts.some(
    (post) => pathname === `/blog/${post.category}/${post.slug}`,
  );
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold hover:bg-accent">
        <span className="flex min-w-0 items-start gap-2">
          <FolderOpen className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="break-words">{category.name}</span>
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-1 border-l pl-4">
          {category.posts.map((post) => {
            const href = `/blog/${post.category}/${post.slug}`;
            const isPostActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={isPostActive ? "page" : undefined}
                className={cn(
                  "flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                  isPostActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="min-w-0 break-words">{post.title}</span>
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DocsMobileSidebar({ levels }: DocsSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="docs-mobile-navigation"
        className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium mb-4"
      >
        <FolderOpen className="h-4 w-4" />
        Navegación
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <nav
          id="docs-mobile-navigation"
          aria-label="Temario"
          className="mb-6 border-y py-4"
        >
          <div className="space-y-2">
            {levels.map((level) => (
              <LevelSection
                key={`${level.slug}-${pathname}`}
                level={level}
                pathname={pathname}
                onNavigate={() => setIsOpen(false)}
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
