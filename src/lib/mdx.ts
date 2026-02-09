import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const contentDirectory = path.join(process.cwd(), "content");

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  tags: string[];
  category: string;
  readingTime: string;
  draft?: boolean;
  syllabusId?: number;
  order?: number;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  order?: number;
  posts: PostMeta[];
}

/**
 * Get all categories from the content directory
 */
export function getCategories(): string[] {
  const docsPath = path.join(contentDirectory, "docs");
  if (!fs.existsSync(docsPath)) {
    return [];
  }
  return fs
    .readdirSync(docsPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 * Get all posts from a specific category
 */
export function getPostsByCategory(category: string): PostMeta[] {
  const categoryPath = path.join(contentDirectory, "docs", category);
  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const filePath = path.join(categoryPath, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContents);
      const slug = file.replace(/\.mdx$/, "");

      return {
        title: data.title || slug,
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "Anonymous",
        slug,
        tags: data.tags || [],
        category,
        readingTime: readingTime(content).text,
        draft: data.draft || false,
        syllabusId: data.syllabusId || undefined,
        order: data.order || undefined,
      } as PostMeta;
    })
    .filter((post) => !post.draft)
    // Sort by syllabusId first, then by order, then by date
    .sort((a, b) => {
      // If both have syllabusId, sort by syllabusId ascending
      if (a.syllabusId !== undefined && b.syllabusId !== undefined) {
        return a.syllabusId - b.syllabusId;
      }
      // If both have order, sort by order ascending
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // If one has syllabusId/order and other doesn't, prioritize the one with it
      if (a.syllabusId !== undefined || a.order !== undefined) return -1;
      if (b.syllabusId !== undefined || b.order !== undefined) return 1;
      // Fall back to date sorting (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
}

/**
 * Get all posts from all categories
 */
export function getAllPosts(): PostMeta[] {
  const categories = getCategories();
  const allPosts = categories.flatMap((category) => getPostsByCategory(category));
  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a specific post by category and slug
 */
export function getPost(category: string, slug: string): Post | null {
  const filePath = path.join(contentDirectory, "docs", category, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    meta: {
      title: data.title || slug,
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      author: data.author || "Anonymous",
      slug,
      tags: data.tags || [],
      category,
      readingTime: readingTime(content).text,
      draft: data.draft || false,
    },
    content,
  };
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): { category: string; slug: string }[] {
  const categories = getCategories();
  const slugs: { category: string; slug: string }[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(contentDirectory, "docs", category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".mdx"));
      files.forEach((file) => {
        slugs.push({
          category,
          slug: file.replace(/\.mdx$/, ""),
        });
      });
    }
  });

  return slugs;
}

/**
 * Get category order from central config file
 */
function getCategoryOrder(): string[] {
  const configPath = path.join(contentDirectory, "docs", "_config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return config.categoryOrder || [];
  }
  return [];
}

/**
 * Get navigation structure for sidebar
 */
export function getNavigationStructure(): Category[] {
  const categories = getCategories();
  const categoryOrder = getCategoryOrder();

  const categoryList = categories.map((categorySlug) => {
    const configPath = path.join(contentDirectory, "docs", categorySlug, "_category.json");
    let categoryConfig: { name?: string; description?: string; order?: number } = {
      name: categorySlug,
      description: ""
    };

    if (fs.existsSync(configPath)) {
      categoryConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }

    // Use position in categoryOrder array, or fallback to legacy order field
    const orderIndex = categoryOrder.indexOf(categorySlug);
    const order = orderIndex !== -1 ? orderIndex : categoryConfig.order;

    return {
      name: categoryConfig.name || categorySlug,
      slug: categorySlug,
      description: categoryConfig.description || "",
      order: order,
      posts: getPostsByCategory(categorySlug),
    };
  });

  // Sort categories by order (ascending), categories without order go last
  return categoryList.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): PostMeta[] {
  const allPosts = getAllPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.description.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) => post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tags = new Set<string>();
  allPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
