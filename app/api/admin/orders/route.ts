export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readOrders, updateOrderStatus } from '@/lib/orders';

export async function GET(request: Request) {
  try {
    const orders = await readOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    if (status !== 'Pending' && status !== 'Completed') {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
