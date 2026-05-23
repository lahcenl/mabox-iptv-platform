export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total } = body;

    if (!items || !total) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const orderId = crypto.randomUUID();
    const newOrder = {
      orderId,
      items,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const filePath = path.join(process.cwd(), 'data', 'orders.json');
    let orders = [];

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      orders = JSON.parse(data);
    } catch (err) {
      // If file doesn't exist or is empty, we keep orders as []
    }

    orders.push(newOrder);
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2));

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
