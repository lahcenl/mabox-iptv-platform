import type { Metadata } from 'next';
import AdminShell from '@/components/alt7km/AdminShell';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Ondexy',
  description: 'Manage orders, products, and blog articles.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
