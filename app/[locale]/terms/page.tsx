import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the official terms and conditions for using Ondexy plans and player licenses.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: May 25, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing Ondexy.com and acquiring our streaming plans, media player licenses, or reseller packages, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Service Delivery</h2>
            <p>
              Digital subscriptions, activation lines, and player licenses are delivered instantly via WhatsApp or email upon transaction validation. Users must ensure accurate contact coordinates are supplied.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Acceptable Use Policy</h2>
            <p>
              Subscriptions are personal and limited to the number of simultaneous active screens purchased. Shared lines or commercial redistributions outside of authorized reseller configurations are strictly forbidden and subject to instant suspension.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Disclaimer of Warranties</h2>
            <p>
              While we run premium anti-buffer servers, internet routing speeds, ISP line blocks, and specific hardware decode capacities are out of our direct control. Services are provided on an &quot;as-is&quot; basis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p>
              All software, logos, brand guides, UI elements, and custom catalog content display systems remain the exclusive property of Ondexy.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
