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
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80',
    color: 'purple',
    productCount: 12,
  },
  {
    id: '2',
    name: 'Media Players',
    slug: 'media-players',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80',
    color: 'yellow',
    productCount: 8,
  },
  {
    id: '3',
    name: 'Smart TV Apps',
    slug: 'smart-tv-apps',
    image: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&auto=format&fit=crop&q=80',
    color: 'blue',
    productCount: 5,
  },
  {
    id: '4',
    name: 'Bein Sports',
    slug: 'bein-sports',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    color: 'green',
    productCount: 4,
  },
];

function toProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    image: row.image,
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
    const { data, error } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .eq('category', category);
    if (error) throw error;
    return (data || []).map(toProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}
