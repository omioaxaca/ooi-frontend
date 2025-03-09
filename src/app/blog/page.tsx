import Link from "next/link";
import Navbar from "@/components/nav-bar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    description: "Learn how to create modern web applications with Next.js",
    date: "2023-12-15",
    author: "John Doe",
    slug: "getting-started-with-nextjs",
  },
  {
    id: 2,
    title: "The Power of Tailwind CSS",
    description: "Discover how Tailwind CSS can transform your development workflow",
    date: "2023-12-20",
    author: "Jane Smith",
    slug: "power-of-tailwind-css",
  },
  {
    id: 3,
    title: "Building UI Components with shadcn/ui",
    description: "A comprehensive guide to using shadcn/ui in your projects",
    date: "2024-01-05",
    author: "Alex Johnson",
    slug: "building-ui-with-shadcn",
  },
  {
    id: 4,
    title: "Authentication Best Practices",
    description: "Learn how to implement secure authentication in your web applications",
    date: "2024-01-18",
    author: "Sarah Williams",
    slug: "authentication-best-practices",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Blog</h1>
          <p className="text-gray-600 mb-8">
            Latest articles, tutorials, and resources for web developers.
          </p>

          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Click to read the full article about {post.title.toLowerCase()}.</p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <span>By {post.author}</span>
                  <span>{post.date}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 