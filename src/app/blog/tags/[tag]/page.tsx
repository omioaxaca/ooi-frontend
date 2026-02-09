import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav-bar";
import { getPostsByTag, getAllTags } from "@/lib/mdx";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Clock, Calendar, User, Tag } from "lucide-react";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

// Generate static params for all tags
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Artículos con etiqueta "${decodedTag}" | OOI`,
    description: `Todos los artículos etiquetados con ${decodedTag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Documentación</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Etiqueta: {decodedTag}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Tag className="h-8 w-8" />
              Etiqueta: {decodedTag}
            </h1>
            <p className="text-muted-foreground">
              {posts.length} {posts.length === 1 ? "artículo" : "artículos"} encontrados
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={`${post.category}-${post.slug}`}
                href={`/blog/${post.category}/${post.slug}`}
                className="block"
              >
                <Card className="transition-all hover:shadow-md hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readingTime}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
