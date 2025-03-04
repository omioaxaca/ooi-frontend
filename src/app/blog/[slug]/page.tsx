import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

// Mock blog posts data - in a real app, this would come from a database or CMS
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    description: "Learn how to create modern web applications with Next.js",
    date: "2023-12-15",
    author: "John Doe",
    slug: "getting-started-with-nextjs",
    content: `
      <p>Next.js is a React framework that enables server-side rendering and generating static websites for React based web applications.</p>
      
      <h2>Why Next.js?</h2>
      <p>Next.js simplifies the development process and provides several features:</p>
      <ul>
        <li>Server-side rendering</li>
        <li>Static site generation</li>
        <li>API routes</li>
        <li>Built-in CSS and Sass support</li>
        <li>Fast refresh</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To create a new Next.js app, run the following command:</p>
      <pre><code>npx create-next-app@latest my-next-app</code></pre>
      
      <p>This is just the beginning of your journey with Next.js. Stay tuned for more in-depth tutorials!</p>
    `,
  },
  {
    id: 2,
    title: "The Power of Tailwind CSS",
    description: "Discover how Tailwind CSS can transform your development workflow",
    date: "2023-12-20",
    author: "Jane Smith",
    slug: "power-of-tailwind-css",
    content: `
      <p>Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without ever leaving your HTML.</p>
      
      <h2>Benefits of Tailwind CSS</h2>
      <p>Here's why many developers are switching to Tailwind:</p>
      <ul>
        <li>No more custom CSS files</li>
        <li>Design directly in your markup</li>
        <li>Responsive design made easy</li>
        <li>Consistent spacing, typography, and colors</li>
        <li>Highly customizable</li>
      </ul>
      
      <h2>Setting Up Tailwind</h2>
      <p>Install Tailwind CSS with the following commands:</p>
      <pre><code>npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>
      
      <p>Tailwind CSS has revolutionized how we write CSS and build user interfaces!</p>
    `,
  },
  {
    id: 3,
    title: "Building UI Components with shadcn/ui",
    description: "A comprehensive guide to using shadcn/ui in your projects",
    date: "2024-01-05",
    author: "Alex Johnson",
    slug: "building-ui-with-shadcn",
    content: `
      <p>shadcn/ui is a collection of reusable components built using Radix UI and Tailwind CSS.</p>
      
      <h2>Why shadcn/ui?</h2>
      <p>shadcn/ui offers several advantages:</p>
      <ul>
        <li>Beautifully designed components</li>
        <li>Fully accessible and follows WAI-ARIA patterns</li>
        <li>Customizable and themeable</li>
        <li>Copy and paste - use what you need</li>
        <li>TypeScript support</li>
      </ul>
      
      <h2>Getting Started with shadcn/ui</h2>
      <p>To add shadcn/ui to your project:</p>
      <pre><code>npx shadcn-ui@latest init</code></pre>
      
      <p>Then add components as needed:</p>
      <pre><code>npx shadcn-ui@latest add button</code></pre>
      
      <p>shadcn/ui has changed how we approach component libraries in modern web development.</p>
    `,
  },
  {
    id: 4,
    title: "Authentication Best Practices",
    description: "Learn how to implement secure authentication in your web applications",
    date: "2024-01-18",
    author: "Sarah Williams",
    slug: "authentication-best-practices",
    content: `
      <p>Authentication is a critical aspect of web application security that requires careful implementation.</p>
      
      <h2>Key Authentication Principles</h2>
      <p>Follow these best practices for secure authentication:</p>
      <ul>
        <li>Use HTTPS everywhere</li>
        <li>Implement proper password hashing</li>
        <li>Enforce strong password policies</li>
        <li>Use multi-factor authentication when possible</li>
        <li>Implement proper session management</li>
        <li>Rate limit authentication attempts</li>
      </ul>
      
      <h2>JWT vs. Session-based Authentication</h2>
      <p>Both approaches have pros and cons:</p>
      <ul>
        <li>JWT: Stateless, good for distributed systems, but can't be invalidated easily</li>
        <li>Sessions: Easy to invalidate, but requires server storage</li>
      </ul>
      
      <p>Security is never a one-time implementation, but an ongoing process!</p>
    `,
  },
];

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              ← Back to Blog
            </Button>
          </Link>
          
          <article>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="text-gray-500 mb-6">
              By {post.author} • {post.date}
            </div>
            
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          
          <div className="mt-12 pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Read More</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 2)
                .map((p) => (
                  <div key={p.id} className="border rounded-lg p-4 hover:shadow-md">
                    <h4 className="font-medium mb-1">
                      <Link href={`/blog/${p.slug}`} className="hover:text-blue-600">
                        {p.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600">{p.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 