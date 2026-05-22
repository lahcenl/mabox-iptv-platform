import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string; // Markdown / plain text content
  coverImage: string;
  excerpt: string; // Auto-generated from first 160 chars of content
  date: string; // ISO date string
  author: string;
}

export interface NewArticleInput {
  title: string;
  content: string;
  coverImage: string;
  date?: string;
  author?: string;
}

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'articles.json');

export async function readArticles(): Promise<Article[]> {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeArticles(articles: Article[]): Promise<void> {
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateExcerpt(content: string): string {
  // Strip simple markdown symbols and take first 160 chars
  const plain = content.replace(/[#*_`~\[\]]/g, '').trim();
  return plain.length > 160 ? plain.slice(0, 157) + '…' : plain;
}

export async function addArticle(input: NewArticleInput): Promise<Article> {
  const articles = await readArticles();

  const baseSlug = slugify(input.title);
  // Ensure slug uniqueness
  let slug = baseSlug;
  let counter = 1;
  while (articles.some((a) => a.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }

  const newArticle: Article = {
    id: crypto.randomUUID(),
    slug,
    title: input.title,
    content: input.content,
    coverImage: input.coverImage || '',
    excerpt: generateExcerpt(input.content),
    date: input.date ?? new Date().toISOString(),
    author: input.author ?? 'Admin',
  };

  articles.unshift(newArticle); // newest first
  await writeArticles(articles);
  return newArticle;
}

export async function updateArticle(
  id: string,
  updates: Partial<NewArticleInput>,
): Promise<Article | null> {
  const articles = await readArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  if (updates.content) {
    articles[idx].excerpt = generateExcerpt(updates.content);
  }
  if (updates.title) {
    // Don't re-slug existing articles to preserve public URLs
    articles[idx].title = updates.title;
  }

  articles[idx] = { ...articles[idx], ...updates } as Article;
  await writeArticles(articles);
  return articles[idx];
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await readArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  await writeArticles(filtered);
  return true;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await readArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
