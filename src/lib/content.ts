/**
 * Content utilities for reading MDX files from filesystem
 */

import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  content: string;
}

export interface PostListItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
}

/**
 * Parse frontmatter from MDX content
 */
function parseFrontmatter(content: string) {
  const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = frontmatterMatch[1];
  const body = content.replace(frontmatterMatch[0], '').trim();

  // Simple YAML parser for our needs
  const frontmatter: Record<string, any> = {};

  // Parse title
  const titleMatch = frontmatterStr.match(/title:\s*"(.+?)"/);
  if (titleMatch) frontmatter.title = titleMatch[1];

  // Parse slug
  const slugMatch = frontmatterStr.match(/slug:\s*"(.+?)"/);
  if (slugMatch) frontmatter.slug = slugMatch[1];

  // Parse date
  const dateMatch = frontmatterStr.match(/date:\s*"(.+?)"/);
  if (dateMatch) frontmatter.date = dateMatch[1];

  // Parse excerpt
  const excerptMatch = frontmatterStr.match(/excerpt:\s*"(.+?)"/);
  if (excerptMatch) frontmatter.excerpt = excerptMatch[1];

  // Parse category
  const categoryMatch = frontmatterStr.match(/category:\s*"(.+?)"/);
  if (categoryMatch) frontmatter.category = categoryMatch[1];

  // Parse tags
  const tagsMatch = frontmatterStr.match(/tags:\s*\[(.+?)\]/s);
  if (tagsMatch) {
    frontmatter.tags = tagsMatch[1]
      .split(',')
      .map((t: string) => t.replace(/['"\s]/g, '').trim())
      .filter(Boolean);
  }

  return { frontmatter, body };
}

/**
 * Get all post directories
 */
function getPostDirs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort()
    .reverse(); // Newest first
}

/**
 * Get all post slugs for static generation
 */
export function getAllPostSlugs(): string[] {
  const dirs = getPostDirs();
  const slugs: string[] = [];

  for (const dir of dirs) {
    const filePath = path.join(CONTENT_DIR, dir, 'index.mdx');
    if (!fs.existsSync(filePath)) continue;

    // Extract slug from directory name (date-slug format)
    const slug = dir.split('-').slice(3).join('-');
    slugs.push(slug);
  }

  return slugs;
}

/**
 * Get all posts for listing
 */
export function getAllPosts(): PostListItem[] {
  const dirs = getPostDirs();
  const posts: PostListItem[] = [];

  for (const dir of dirs) {
    const filePath = path.join(CONTENT_DIR, dir, 'index.mdx');

    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);

    // Extract slug from directory name (date-slug format)
    const slug = dir.split('-').slice(3).join('-');

    posts.push({
      slug: frontmatter.slug || slug,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      excerpt: frontmatter.excerpt || '',
      category: frontmatter.category || 'Cricket',
    });
  }

  return posts;
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  const dirs = getPostDirs();

  for (const dir of dirs) {
    const dirSlug = dir.split('-').slice(3).join('-');

    if (dirSlug === slug) {
      const filePath = path.join(CONTENT_DIR, dir, 'index.mdx');

      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);

      return {
        slug,
        title: frontmatter.title || 'Untitled',
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        excerpt: frontmatter.excerpt || '',
        category: frontmatter.category || 'Cricket',
        tags: frontmatter.tags || [],
        content: body,
      };
    }
  }

  return null;
}

/**
 * Convert Markdown to HTML (simple implementation)
 */
export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="nofollow noreferrer">$1</a>');

  // Unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');

  // Paragraphs
  html = html.replace(/^(?!<[h|u|o])(.+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');

  return html;
}
