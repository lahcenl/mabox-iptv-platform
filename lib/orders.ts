import { supabase } from '@/lib/supabase';

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
  let parsedItems: OrderItem[] = [];
  if (order.items) {
    if (typeof order.items === 'string') {
      try {
        parsedItems = JSON.parse(order.items);
      } catch {
        parsedItems = [];
      }
    } else if (Array.isArray(order.items)) {
      parsedItems = order.items;
    }
  }

  return {
    orderId: order.id,
    items: parsedItems,
    total: order.total,
    status: order.status as 'Pending' | 'Completed',
    createdAt: order.created_at,
  };
}

export async function readOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toSerializable);
}

export async function createOrder(items: OrderItem[], total: number): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([{ items, total, status: 'Pending' }])
    .select()
    .single();
  if (error) throw error;
  return toSerializable(data);
}

export async function updateOrderStatus(
  orderId: string,
  status: 'Pending' | 'Completed',
): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  if (error) return null;
  return toSerializable(data);
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);
  if (error) throw error;
  return true;
}
