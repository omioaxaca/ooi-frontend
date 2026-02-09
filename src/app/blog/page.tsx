import Link from "next/link";
import Navbar from "@/components/nav-bar";
import { getNavigationStructure, getAllPosts, getAllTags } from "@/lib/mdx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User, Tag, FolderOpen } from "lucide-react";

export const metadata = {
  title: "Documentación | OOI",
  description: "Recursos de estudio, tutoriales y guías para la Olimpiada de Informática",
};

export default function BlogPage() {
  const categories = getNavigationStructure();
  const allPosts = getAllPosts();
  const allTags = getAllTags();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Documentación</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recursos de estudio, tutoriales y guías para prepararte en la Olimpiada
              de Informática. Explora los diferentes temas y aprende a tu propio ritmo.
            </p>
          </div>

          {/* Categories Overview */}
          {categories.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FolderOpen className="h-6 w-6" />
                Categorías
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog/${category.slug}`}
                    className="block"
                  >
                    <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FolderOpen className="h-5 w-5 text-primary" />
                          {category.name}
                        </CardTitle>
                        {category.description && (
                          <CardDescription>{category.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {category.posts.length}{" "}
                          {category.posts.length === 1 ? "artículo" : "artículos"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tags Section */}
          {allTags.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Tag className="h-6 w-6" />
                Etiquetas
              </h2>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Link key={tag} href={`/blog/tags/${tag}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Recent Posts */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Artículos Recientes</h2>
            {allPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No hay artículos disponibles todavía. ¡Pronto agregaremos contenido!
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {allPosts.slice(0, 10).map((post) => (
                  <Card key={`${post.category}-${post.slug}`} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="outline">{post.category}</Badge>
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl">
                        <Link
                          href={`/blog/${post.category}/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{post.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readingTime}
                      </span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}