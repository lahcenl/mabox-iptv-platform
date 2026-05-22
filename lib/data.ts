import fs from 'fs';
import path from 'path';

export interface PriceTier {
  duration: string;
  months?: number;
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
  priceTiers: PriceTier[];
  whatsappNumber: string;
  featured: boolean;
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
    image: '/images/iptv-category.png',
    color: 'purple',
    productCount: 12,
  },
  {
    id: '2',
    name: 'Media Players',
    slug: 'media-players',
    image: '/images/players-category.png',
    color: 'yellow',
    productCount: 8,
  },
  {
    id: '3',
    name: 'Smart TV Apps',
    slug: 'smart-tv-apps',
    image: '/images/tv-category.png',
    color: 'blue',
    productCount: 5,
  },
  {
    id: '4',
    name: 'Reseller Panels',
    slug: 'reseller-panels',
    image: '/images/reseller-category.png',
    color: 'green',
    productCount: 4,
  },
];

/** Read products synchronously from data/products.json at module load time.
 *  This is safe for server components and build-time rendering.
 *  For admin mutations, use lib/products.ts which uses async fs/promises. */
function loadProducts(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch {
    return [];
  }
}

export const products: Product[] = loadProducts();

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}
