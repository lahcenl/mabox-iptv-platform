import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { Product, PriceTier } from '@/lib/data';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

export async function readProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

export interface NewProductInput {
  name: string;
  description: string;
  image: string;
  category: string;
  priceTiers: PriceTier[];
  whatsappNumber?: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function addProduct(input: NewProductInput): Promise<Product> {
  const products = await readProducts();

  const newProduct: Product = {
    id: crypto.randomUUID(),
    slug: slugify(input.name),
    name: input.name,
    category: input.category,
    image: input.image || '/images/placeholder.png',
    description: input.description,
    rating: 5.0,
    reviewCount: 0,
    priceTiers: input.priceTiers,
    whatsappNumber: input.whatsappNumber ?? '212665096579',
    featured: false,
  };

  products.push(newProduct);
  await writeProducts(products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  products[idx] = { ...products[idx], ...updates };
  await writeProducts(products);
  return products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await writeProducts(filtered);
  return true;
}
