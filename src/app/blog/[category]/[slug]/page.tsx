import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/nav-bar";
import { getPost, getNavigationStructure, getAllPostSlugs } from "@/lib/mdx";
import { MDXContent } from "@/components/mdx-components";
import { DocsSidebar, DocsMobileSidebar } from "@/components/docs-sidebar";
import { TableOfContents } from "@/components/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  return {
    title: `${post.meta.title} | OOI`,
    description: post.meta.description,
    authors: [{ name: post.meta.author }],
    keywords: post.meta.tags,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = getPost(category, slug);
  const categories = getNavigationStructure();

  if (!post) {
    notFound();
  }

  // Find current category
  const currentCategory = categories.find((c) => c.slug === category);

  // Find prev/next posts within the same category
  const currentCategoryPosts = currentCategory?.posts || [];
  const currentIndex = currentCategoryPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? currentCategoryPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < currentCategoryPosts.length - 1
      ? currentCategoryPosts[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <DocsSidebar categories={categories} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Sidebar */}
            <DocsMobileSidebar categories={categories} />

            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/blog">Documentación</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/blog/${category}`}>
                    {currentCategory?.name || category}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{post.meta.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Article */}
            <article className="max-w-3xl">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{currentCategory?.name || category}</Badge>
                  {post.meta.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-4xl font-bold mb-4">{post.meta.title}</h1>

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
                <div className="flex justify-between gap-4">
                  {prevPost ? (
                    <Link href={`/blog/${category}/${prevPost.slug}`} className="flex-1">
                      <Button variant="outline" className="w-full h-auto py-4 flex-col items-start">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          <ChevronLeft className="h-3 w-3" />
                          Anterior
                        </span>
                        <span className="text-sm font-medium truncate max-w-full">
                          {prevPost.title}
                        </span>
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {nextPost ? (
                    <Link href={`/blog/${category}/${nextPost.slug}`} className="flex-1">
                      <Button variant="outline" className="w-full h-auto py-4 flex-col items-end">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                          Siguiente
                          <ChevronRight className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-medium truncate max-w-full">
                          {nextPost.title}
                        </span>
                      </Button>
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
