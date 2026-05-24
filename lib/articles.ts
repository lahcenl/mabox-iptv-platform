import { supabase } from '@/lib/supabase';

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
    coverImage: article.cover_image ?? '',
    excerpt: article.excerpt ?? '',
    date: article.created_at,
    author: article.author ?? 'Admin',
  };
}

export async function readArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toSerializable);
}

export async function addArticle(input: NewArticleInput): Promise<Article> {
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const { data } = await supabase.from('articles').select('id').eq('slug', slug).single();
    if (!data) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const { data, error } = await supabase
    .from('articles')
    .insert([{
      slug,
      title: input.title,
      content: input.content,
      cover_image: input.coverImage ?? '',
      excerpt: generateExcerpt(input.content),
      created_at: input.date ?? new Date().toISOString(),
      author: input.author ?? 'Admin',
    }])
    .select()
    .single();

  if (error) throw error;
  return toSerializable(data);
}

export async function updateArticle(
  id: string,
  updates: Partial<NewArticleInput>,
): Promise<Article | null> {
  const updateData: any = {};
  if (updates.title) updateData.title = updates.title;
  if (updates.content) {
    updateData.content = updates.content;
    updateData.excerpt = generateExcerpt(updates.content);
  }
  if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
  if (updates.author) updateData.author = updates.author;
  if (updates.date) updateData.created_at = updates.date;

  const { data, error } = await supabase
    .from('articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return toSerializable(data);
}

export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  return !error;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  return toSerializable(data);
}
