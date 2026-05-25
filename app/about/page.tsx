import type { Metadata } from 'next';
import { Tv, Shield, Zap, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about Ondexy, our premium anti-buffer servers, and our streaming mission.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">About Ondexy</h1>
        <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
          Providing high-stability, zero-buffering digital activations and media players for worldwide subscribers.
        </p>

        <div className="space-y-12">
          {/* Mission */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                At Ondexy, we believe streaming should be immediate, crystal-clear, and hassle-free. We partner with the most robust content delivery networks globally to bring stable, lag-free TV directly to your Smart TV, smartphone, box, or computer.
              </p>
            </div>
            <div className="bg-gradient-to-br from-violet-550/10 to-fuchsia-550/10 p-8 rounded-2xl border border-violet-100 flex items-center justify-center">
              <Tv className="w-24 h-24 text-violet-600" />
            </div>
          </section>

          {/* Pillars */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Why Ondexy Stands Out</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
                <Shield className="w-8 h-8 text-violet-650 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Anti-Buffer Servers</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  We route content streams through load-balanced servers with advanced cache networks to achieve buffering mitigation.
                </p>
              </div>

              <div className="border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
                <Zap className="w-8 h-8 text-violet-650 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Instant Delivery</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Purchased activation details, instructions, and licenses are delivered via WhatsApp within minutes.
                </p>
              </div>

              <div className="border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow">
                <HelpCircle className="w-8 h-8 text-violet-650 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Expert Support</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Our tech support team is available day and night to walk you through hardware setup and application settings.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center pt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Browse Our Plans
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
