export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readArticles, addArticle, updateArticle, deleteArticle } from '@/lib/articles';
import type { NewArticleInput } from '@/lib/articles';

export async function GET() {
  try {
    const articles = await readArticles();
    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: NewArticleInput = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Missing required fields: title, content' }, { status: 400 });
    }
    const article = await addArticle(body);
    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
    const article = await updateArticle(id, updates);
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing article id' }, { status: 400 });
    const deleted = await deleteArticle(id);
    if (!deleted) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
