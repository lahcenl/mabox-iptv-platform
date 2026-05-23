import { prisma } from '@/lib/prisma';

export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage: string;
  excerpt: string;
  date: string;
  author: string;
}

export interface NewArticleInput {
  title: string;
  content: string;
  coverImage?: string;
  date?: string;
  author?: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateExcerpt(content: string): string {
  const plain = content.replace(/[#*_`~\[\]]/g, '').trim();
  return plain.length > 160 ? plain.slice(0, 157) + '…' : plain;
}

function toSerializable(article: any): Article {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    content: article.content,
    coverImage: article.coverImage,
    excerpt: article.excerpt,
    date: article.date instanceof Date ? article.date.toISOString() : article.date,
    author: article.author,
  };
}

export async function readArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({ orderBy: { date: 'desc' } });
  return articles.map(toSerializable);
}

export async function addArticle(input: NewArticleInput): Promise<Article> {
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const article = await prisma.article.create({
    data: {
      slug,
      title: input.title,
      content: input.content,
      coverImage: input.coverImage ?? '',
      excerpt: generateExcerpt(input.content),
      date: input.date ? new Date(input.date) : new Date(),
      author: input.author ?? 'Admin',
    },
  });
  return toSerializable(article);
}

export async function updateArticle(
  id: string,
  updates: Partial<NewArticleInput>,
): Promise<Article | null> {
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return null;

  const article = await prisma.article.update({
    where: { id },
    data: {
      ...(updates.title ? { title: updates.title } : {}),
      ...(updates.content ? { content: updates.content, excerpt: generateExcerpt(updates.content) } : {}),
      ...(updates.coverImage !== undefined ? { coverImage: updates.coverImage } : {}),
      ...(updates.author ? { author: updates.author } : {}),
      ...(updates.date ? { date: new Date(updates.date) } : {}),
    },
  });
  return toSerializable(article);
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await prisma.article.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({ where: { slug } });
  return article ? toSerializable(article) : null;
}
