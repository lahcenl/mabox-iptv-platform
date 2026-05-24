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
  return {
    orderId: order.id,
    items: order.items as OrderItem[],
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
