'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  TrendingUp,
  RefreshCw,
  Package,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface OrderItem {
  productName: string;
  duration: string;
  qty: number;
  price: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Completed';
  createdAt: string;
}

function StatusBadge({ status }: { status: Order['status'] }) {
  if (status === 'Completed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
      <Clock className="w-3.5 h-3.5" />
      Pending
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch('/api/alt7km/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load orders');
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleMarkCompleted = async (orderId: string) => {
    setCompleting(orderId);
    try {
      const res = await fetch('/api/alt7km/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: 'Completed' }),
      });
      if (!res.ok) throw new Error('Failed to update order');
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: 'Completed' } : o)),
      );
    } catch {
      setError('Failed to update order status. Please try again.');
    } finally {
      setCompleting(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    setDeleting(orderId);
    try {
      const res = await fetch(`/api/alt7km/orders?orderId=${orderId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete order');
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch {
      setError('Failed to delete order. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const totalRevenue = orders.filter((o) => o.status === 'Completed').reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage customer orders</p>
        </div>
        <button
          id="admin-refresh-orders"
          onClick={() => fetchOrders(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} color="bg-violet-600" />
          <StatCard icon={Clock} label="Pending" value={pendingOrders} color="bg-orange-500" />
          <StatCard icon={CheckCircle2} label="Completed" value={completedOrders} color="bg-emerald-500" />
          <StatCard icon={TrendingUp} label="Revenue (Completed)" value={`$${totalRevenue.toFixed(2)}`} color="bg-blue-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <Package className="w-5 h-5 text-violet-600" />
          <h2 className="text-base font-semibold text-gray-900">All Orders</h2>
          {!loading && (
            <span className="ml-auto text-xs text-gray-400 font-medium">
              {totalOrders} {totalOrders === 1 ? 'record' : 'records'}
            </span>
          )}
        </div>

        {loading && (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-700">No orders yet</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Once customers place orders, they&apos;ll appear here.
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Order ID', 'Date & Time', 'Items', 'Total', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const date = new Date(order.createdAt);
                  return (
                    <tr key={order.orderId} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                          #{order.orderId.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-800">
                          {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5 min-w-[200px]">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-800">{item.productName}</span>
                                <span className="text-gray-400 mx-1">·</span>
                                <span className="text-gray-500 text-xs">{item.duration}</span>
                                <span className="text-gray-400 mx-1">·</span>
                                <span className="text-xs font-semibold text-violet-600">Qty {item.qty}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {order.status === 'Pending' && (
                            <button
                              id={`complete-order-${order.orderId.slice(0, 8)}`}
                              onClick={() => handleMarkCompleted(order.orderId)}
                              disabled={completing === order.orderId || deleting === order.orderId}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all active:scale-95 disabled:opacity-60 shadow-sm"
                            >
                              {completing === order.orderId ? (
                                <><RefreshCw className="w-3 h-3 animate-spin" /> Saving…</>
                              ) : (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed</>
                              )}
                            </button>
                          )}
                          <button
                            id={`delete-order-${order.orderId.slice(0, 8)}`}
                            onClick={() => handleDeleteOrder(order.orderId)}
                            disabled={completing === order.orderId || deleting === order.orderId}
                            className="inline-flex items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all active:scale-95 disabled:opacity-60 border border-red-200/50"
                            title="Delete Order"
                          >
                            {deleting === order.orderId ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
