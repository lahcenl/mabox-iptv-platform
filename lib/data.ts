import { prisma } from './prisma';

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
  createdAt?: Date;
  updatedAt?: Date;
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

export async function getProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      include: { priceTiers: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: { priceTiers: true }
    });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      include: { priceTiers: true }
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: { category },
      include: { priceTiers: true }
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}
