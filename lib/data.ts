import { supabase } from './supabase';

export interface PriceTier {
  id?: string;
  duration: string;
  months?: number | null;
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  whatsappNumber: string;
  featured: boolean;
  priceTiers: PriceTier[];
  createdAt?: string;
  updatedAt?: string;
  
  // Localized fields
  name_en?: string;
  name_ar?: string;
  name_fr?: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  color: 'purple' | 'yellow' | 'blue' | 'green';
  productCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'IPTV Subscriptions',
    slug: 'iptv-subscriptions',
    image: 'https://i.postimg.cc/3xWZsHfd/Untitled-design-(6).jpg',
    color: 'purple',
    productCount: 12,
  },
  {
    id: '2',
    name: 'Players IPTV',
    slug: 'media-players',
    image: 'https://i.postimg.cc/x1qPwSpX/Untitled-design-(4).jpg',
    color: 'yellow',
    productCount: 8,
  },
  {
    id: '4',
    name: 'beIN SPORTS',
    slug: 'bein-sports',
    image: 'https://i.postimg.cc/mghSvGpk/Untitled-design-(5).jpg',
    color: 'green',
    productCount: 4,
  },
];

function toProduct(row: any): Product {
  let category = row.category;
  if (category === 'Media Players' || category === 'Smart TV Apps') {
    category = 'Players IPTV';
  } else if (category === 'Bein Sports') {
    category = 'beIN SPORTS';
  }
  return {
    id: row.id,
    slug: row.slug,
    name: row.name ?? '',
    category: category ?? '',
    image: row.image ?? '',
    description: row.description ?? '',
    rating: row.rating ?? 5.0,
    reviewCount: row.review_count ?? 0,
    whatsappNumber: row.whatsapp_number ?? '1234567890',
    featured: row.featured ?? false,
    priceTiers: (row.price_tiers || []).map((t: any) => ({
      id: t.id,
      duration: t.duration,
      months: t.months ?? null,
      price: t.price,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    
    // Localized fields
    name_en: row.name_en ?? '',
    name_ar: row.name_ar ?? '',
    name_fr: row.name_fr ?? '',
    description_en: row.description_en ?? '',
    description_ar: row.description_ar ?? '',
    description_fr: row.description_fr ?? '',
    
    // SEO fields
    metaTitle: row.meta_title ?? '',
    metaDescription: row.meta_description ?? '',
    seoKeywords: row.seo_keywords ?? '',
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(toProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .eq('slug', slug)
      .single();
    if (error || !data) return null;
    return toProduct(data);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .eq('featured', true);
    if (error) throw error;
    return (data || []).map(toProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    let query;
    if (category === 'Players IPTV') {
      query = supabase
        .from('products')
        .select('*, price_tiers(*)')
        .or('category.eq."Players IPTV",category.eq."Media Players",category.eq."Smart TV Apps"');
    } else if (category === 'beIN SPORTS') {
      query = supabase
        .from('products')
        .select('*, price_tiers(*)')
        .or('category.eq."beIN SPORTS",category.eq."Bein Sports"');
    } else {
      query = supabase
        .from('products')
        .select('*, price_tiers(*)')
        .eq('category', category);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(toProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}
