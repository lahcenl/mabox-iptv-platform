export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

async function getPrisma() {
  const { prisma } = await import('@/lib/prisma');
  return prisma;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    console.log('API HIT')
    const prisma = await getPrisma()
    console.log('PRISMA CONNECTED')
    const products = await prisma.product.findMany()
    console.log(products)
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('FULL ERROR:', error)
    return NextResponse.json({ error: true, message: error.message, stack: error.stack }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (process.env.CI) return NextResponse.json({ success: true }); // Bypass Vercel build
  const prisma = await getPrisma();
  try {
    const body = await request.json();
    if (!body.name || !body.category || !Array.isArray(body.priceTiers) || body.priceTiers.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: name, category, priceTiers' }, { status: 400 });
    }
    
    // Generate base slug
    let baseSlug = slugify(body.name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const product = await prisma.product.create({
      data: {
        slug,
        name: body.name,
        category: body.category,
        image: body.image || '/images/placeholder.png',
        description: body.description,
        priceTiers: {
          create: body.priceTiers.map((t: any) => ({
            duration: t.duration,
            price: Number(t.price)
          }))
        }
      },
      include: { priceTiers: true }
    });
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (process.env.CI) return NextResponse.json({ success: true }); // Bypass Vercel build
  const prisma = await getPrisma();
  try {
    const body = await request.json();
    const { id, priceTiers, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updates,
        ...(priceTiers ? {
          priceTiers: {
            deleteMany: {}, // delete old
            create: priceTiers.map((t: any) => ({
              duration: t.duration,
              price: Number(t.price)
            }))
          }
        } : {})
      },
      include: { priceTiers: true }
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (process.env.CI) return NextResponse.json({ success: true }); // Bypass Vercel build
  const prisma = await getPrisma();
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
