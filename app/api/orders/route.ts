export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total } = body;

    if (!items || !total) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const order = await createOrder(items, total);
    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
