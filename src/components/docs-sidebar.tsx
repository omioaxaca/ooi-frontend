"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/mdx";
import { ChevronDown, ChevronRight, FileText, FolderOpen } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocsSidebarProps {
  categories: Category[];
}

export function DocsSidebar({ categories }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 h-[calc(100vh-5rem)]">
        <ScrollArea className="h-full pb-10">
          <nav className="pr-4 py-6">
            <div className="space-y-2">
              {categories.map((category) => (
                <CategorySection
                  key={category.slug}
                  category={category}
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

interface CategorySectionProps {
  category: Category;
  pathname: string;
}

function CategorySection({ category, pathname }: CategorySectionProps) {
  const isActive = pathname.includes(`/blog/${category.slug}`);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent">
        <span className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          {category.name}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-4 mt-1 space-y-1 border-l pl-4">
          {category.posts.map((post) => {
            const href = `/blog/${category.slug}/${post.slug}`;
            const isPostActive = pathname === href;

            return (
              <Link
                key={post.slug}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isPostActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <FileText className="h-4 w-4" />
                <span className="truncate">{post.title}</span>
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Mobile sidebar for docs
interface DocsMobileSidebarProps {
  categories: Category[];
}

export function DocsMobileSidebar({ categories }: DocsMobileSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        <nav className="mb-6 rounded-lg border bg-card p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <CategorySection
                key={category.slug}
                category={category}
                pathname={pathname}
              />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
