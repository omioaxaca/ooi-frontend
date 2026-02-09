import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/nav-bar";
import { getNavigationStructure, getPostsByCategory, getCategories } from "@/lib/mdx";
import { DocsSidebar, DocsMobileSidebar } from "@/components/docs-sidebar";
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
import { Clock, Calendar, User, FileText } from "lucide-react";
import fs from "fs";
import path from "path";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    category,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const configPath = path.join(process.cwd(), "content", "docs", category, "_category.json");
  let categoryName = category;
  let description = "";

  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    categoryName = config.name || category;
    description = config.description || "";
  }

  return {
    title: `${categoryName} | Documentación | OOI`,
    description: description || `Artículos sobre ${categoryName}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categories = getNavigationStructure();
  const posts = getPostsByCategory(category);

  // Find current category info
  const currentCategory = categories.find((c) => c.slug === category);

  if (!currentCategory) {
    notFound();
  }

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
                  <BreadcrumbPage>{currentCategory.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Category Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
              {currentCategory.description && (
                <p className="text-muted-foreground text-lg">
                  {currentCategory.description}
                </p>
              )}
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No hay artículos en esta categoría todavía.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${category}/${post.slug}`}
                    className="block"
                  >
                    <Card className="transition-all hover:shadow-md hover:border-primary/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <FileText className="h-5 w-5 text-primary" />
                          {post.title}
                        </CardTitle>
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
                        {post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
