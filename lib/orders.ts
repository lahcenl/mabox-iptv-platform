import { prisma } from '@/lib/prisma';

export interface OrderItem {
  productName: string;
  duration: string;
  qty: number;
  price: number;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Completed';
  createdAt: string;
}

function toSerializable(order: any): Order {
  return {
    orderId: order.id,
    items: order.items as OrderItem[],
    total: order.total,
    status: order.status as 'Pending' | 'Completed',
    createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
  };
}

export async function readOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  return orders.map(toSerializable);
}

export async function createOrder(items: OrderItem[], total: number): Promise<Order> {
  const order = await prisma.order.create({
    data: { items, total, status: 'Pending' },
  });
  return toSerializable(order);
}

export async function updateOrderStatus(
  orderId: string,
  status: 'Pending' | 'Completed',
): Promise<Order | null> {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return toSerializable(order);
  } catch {
    return null;
  }
}
