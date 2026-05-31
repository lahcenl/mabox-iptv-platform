export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Normalize Supabase snake_case join to the camelCase shape the frontend expects. */
function mapProduct(product: any) {
  if (!product) return product;
  const { price_tiers, ...rest } = product;
  return {
    ...rest,
    priceTiers: price_tiers ?? [],
  };
}

export async function GET(request: Request) {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: products.map(mapProduct) });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category || !Array.isArray(body.priceTiers) || body.priceTiers.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(body.name);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const { data } = await supabase.from('products').select('id').eq('slug', slug).single();
      if (!data) break;
      slug = `${baseSlug}-${counter++}`;
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        slug,
        name: body.name,
        category: body.category,
        image: body.image || '/images/placeholder.png',
        description: body.description || '',
        name_en: body.name_en,
        name_ar: body.name_ar,
        name_fr: body.name_fr,
        description_en: body.description_en,
        description_ar: body.description_ar,
        description_fr: body.description_fr,
        meta_title: body.metaTitle,
        meta_description: body.metaDescription,
        seo_keywords: body.seoKeywords,
      }])
      .select()
      .single();

    if (error) throw error;

    // Insert price tiers
    if (body.priceTiers?.length) {
      const { error: tiersError } = await supabase.from('price_tiers').insert(
        body.priceTiers.map((t: any) => ({
          product_id: product.id,
          name: t.duration,
          duration: t.duration,
          price: Number(t.price),
        }))
      );
      if (tiersError) throw tiersError;
    }

    const { data: fullProduct } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .eq('id', product.id)
      .single();

    return NextResponse.json({ success: true, product: mapProduct(fullProduct) }, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, priceTiers, name, category, image, description, name_en, name_ar, name_fr, description_en, description_ar, description_fr, metaTitle, metaDescription, seoKeywords } = body;
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

    const updates = {
      name,
      category,
      image,
      description,
      name_en,
      name_ar,
      name_fr,
      description_en,
      description_ar,
      description_fr,
      meta_title: metaTitle,
      meta_description: metaDescription,
      seo_keywords: seoKeywords,
    };

    const { error } = await supabase.from('products').update(updates).eq('id', id);
    if (error) throw error;

    // Replace price tiers if provided
    if (priceTiers) {
      await supabase.from('price_tiers').delete().eq('product_id', id);
      if (priceTiers.length > 0) {
        const { error: tiersError } = await supabase.from('price_tiers').insert(
          priceTiers.map((t: any) => ({
            product_id: id,
            name: t.duration,
            duration: t.duration,
            price: Number(t.price),
          }))
        );
        if (tiersError) throw tiersError;
      }
    }

    const { data: product } = await supabase
      .from('products')
      .select('*, price_tiers(*)')
      .eq('id', id)
      .single();

    return NextResponse.json({ success: true, product: mapProduct(product) });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing product id' }, { status: 400 });

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
