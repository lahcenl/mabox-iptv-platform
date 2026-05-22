import fs from 'fs/promises';
import path from 'path';

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

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

export async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

export async function updateOrderStatus(
  orderId: string,
  status: 'Pending' | 'Completed',
): Promise<Order | null> {
  const orders = await readOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx === -1) return null;
  orders[idx].status = status;
  await writeOrders(orders);
  return orders[idx];
}
