import { NextResponse } from 'next/server';
import { readProducts, addProduct, updateProduct, deleteProduct } from '@/lib/products';
import type { NewProductInput } from '@/lib/products';

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: NewProductInput = await request.json();
    if (!body.name || !body.category || !Array.isArray(body.priceTiers) || body.priceTiers.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: name, category, priceTiers' }, { status: 400 });
    }
    const product = await addProduct(body);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    const product = await updateProduct(id, updates);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    const deleted = await deleteProduct(id);
    if (!deleted) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
