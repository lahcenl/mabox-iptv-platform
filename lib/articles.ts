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
  
  // Localized fields
  title_en?: string;
  title_ar?: string;
  title_fr?: string;
  content_en?: string;
  content_ar?: string;
  content_fr?: string;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
}

export interface NewArticleInput {
  title: string;
  content: string;
  coverImage?: string;
  date?: string;
  author?: string;
  
  // Localized fields
  title_en?: string;
  title_ar?: string;
  title_fr?: string;
  content_en?: string;
  content_ar?: string;
  content_fr?: string;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
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
    title_en: article.title_en,
    title_ar: article.title_ar,
    title_fr: article.title_fr,
    content_en: article.content_en,
    content_ar: article.content_ar,
    content_fr: article.content_fr,
    metaTitle: article.meta_title,
    metaDescription: article.meta_description,
    seoKeywords: article.seo_keywords,
  };
}

export async function readArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toSerializable);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function addArticle(input: NewArticleInput): Promise<Article> {
  try {
    const baseSlug = slugify(input.title);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data } = await supabase.from('articles').select('id').eq('slug', slug).single();
      if (!data) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const dateValue = input.date || new Date().toISOString();

    const { data, error } = await supabase
      .from('articles')
      .insert([{
        id: crypto.randomUUID(),
        slug,
        title: input.title,
        content: input.content,
        cover_image: input.coverImage || '',
        excerpt: generateExcerpt(input.content_en || input.content || ''),
        created_at: dateValue,
        author: input.author ?? 'Admin',
        title_en: input.title_en,
        title_ar: input.title_ar,
        title_fr: input.title_fr,
        content_en: input.content_en,
        content_ar: input.content_ar,
        content_fr: input.content_fr,
        meta_title: input.metaTitle,
        meta_description: input.metaDescription,
        seo_keywords: input.seoKeywords,
      }])
      .select()
      .single();

    if (error) throw error;
    return toSerializable(data);
  } catch (error) {
    console.error('Supabase Insert Error:', error);
    throw error;
  }
}

export const createArticle = addArticle;


export async function updateArticle(
  id: string,
  updates: Partial<NewArticleInput>,
): Promise<Article | null> {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.content !== undefined) {
    updateData.content = updates.content;
    updateData.excerpt = generateExcerpt(updates.content_en || updates.content || '');
  }
  if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;
  if (updates.author !== undefined) updateData.author = updates.author;
  if (updates.date && updates.date.trim() !== '') {
    updateData.created_at = updates.date;
  }
  
  // Localized updates
  if (updates.title_en !== undefined) updateData.title_en = updates.title_en;
  if (updates.title_ar !== undefined) updateData.title_ar = updates.title_ar;
  if (updates.title_fr !== undefined) updateData.title_fr = updates.title_fr;
  if (updates.content_en !== undefined) {
    updateData.content_en = updates.content_en;
    updateData.excerpt = generateExcerpt(updates.content_en);
  }
  if (updates.content_ar !== undefined) updateData.content_ar = updates.content_ar;
  if (updates.content_fr !== undefined) updateData.content_fr = updates.content_fr;
  
  // SEO updates
  if (updates.metaTitle !== undefined) updateData.meta_title = updates.metaTitle;
  if (updates.metaDescription !== undefined) updateData.meta_description = updates.metaDescription;
  if (updates.seoKeywords !== undefined) updateData.seo_keywords = updates.seoKeywords;

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
