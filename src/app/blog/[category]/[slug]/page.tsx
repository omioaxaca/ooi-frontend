import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/nav-bar";
import {
  getPost,
  getStudyNavigation,
  getStudyPostContext,
  getAllPostSlugs,
} from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-components";
import { DocsSidebar, DocsMobileSidebar } from "@/components/docs-sidebar";
import { StudyLevelLabel } from "@/components/study-level-label";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Clock, Calendar, User, ChevronLeft, ChevronRight } from "lucide-react";

interface PostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map(({ category, slug }) => ({
    category,
    slug,
  }));
}

// Generate metadata for the post
export async function generateMetadata({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPost(category, slug);

  if (!post) {
    return {
      title: "Artículo no encontrado | OOI",
    };
  }

  const context = getStudyPostContext(getStudyNavigation(), category, slug);
  return {
    title: `${context?.post.title ?? post.meta.title} | OOI`,
    description: post.meta.description,
    authors: [{ name: post.meta.author }],
    keywords: post.meta.tags,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  const levels = getStudyNavigation();

  if (!post) {
    notFound();
  }

  const context = getStudyPostContext(levels, category, slug);
  const currentCategory = context?.section;
  const prevPost = context?.previous;
  const nextPost = context?.next;
  const title = context?.post.title ?? post.meta.title;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <DocsSidebar levels={levels} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Sidebar */}
            <DocsMobileSidebar levels={levels} />

            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Guía De Estudio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {context && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/blog?nivel=${context.level.slug}`}
                      >
                        <StudyLevelLabel level={context.level} />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={
                      context
                        ? `/blog?nivel=${context.level.slug}#${context.level.slug}-${context.section.slug}`
                        : `/blog/${category}`
                    }
                  >
                    {currentCategory?.name || category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Article */}
            <article className="max-w-3xl">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">
                    {currentCategory?.name || category}
                  </Badge>
                  {post.meta.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl font-bold mb-4 break-words">{title}</h1>

                <p className="text-xl text-muted-foreground mb-6">
                  {post.meta.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-6">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.meta.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.meta.date).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.meta.readingTime}
                  </span>
                </div>
              </header>

              {/* Content */}
              <div className="max-w-none">
                <MDXContent source={post.content} />
              </div>

              {/* Navigation */}
              <nav className="mt-12 pt-6 border-t">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  {prevPost ? (
                    <Link
                      href={`/blog/${prevPost.category}/${prevPost.slug}`}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex h-full w-full flex-col items-start rounded-md border px-4 py-4 hover:bg-accent">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <ChevronLeft className="h-3 w-3" />
                          Anterior
                        </span>
                        <span className="text-sm font-medium break-words max-w-full">
                          {prevPost.title}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {nextPost ? (
                    <Link
                      href={`/blog/${nextPost.category}/${nextPost.slug}`}
                      className="min-w-0 flex-1"
                    >
                      <div className="flex h-full w-full flex-col items-end rounded-md border px-4 py-4 text-right hover:bg-accent">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          Siguiente
                          <ChevronRight className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-medium break-words max-w-full">
                          {nextPost.title}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}
                </div>
              </nav>
            </article>
          </div>

          {/* Table of Contents */}
          <TableOfContents content={post.content} />
        </div>
      </main>
    </div>
  );
}
