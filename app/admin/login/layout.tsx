import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Ondexy',
  robots: { index: false, follow: false },
};

/** Login page gets its own layout — bypasses AdminShell from parent admin/layout.tsx */
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
