import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Understand the terms and conditions governing returns and refunds at Ondexy.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Refund Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: May 25, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Refund Eligibility</h2>
            <p>
              Due to the digital nature of premium activations, trial lines, and license keys, refunds are typically processed only under circumstances where a technical server failure prevents activation, and our 24/7 support team is unable to resolve it within 48 hours of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. 24-48 Hours Trial Priority</h2>
            <p>
              We highly recommend that all clients take advantage of our <strong>24 to 48 Hours Trial</strong> prior to purchasing long-term annual packages. This ensures compatibility with your internet bandwidth, smart TV player apps, and decode hardware.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How to Request a Refund</h2>
            <p>
              To submit a claim, please connect directly with our support team via WhatsApp or email (support@ondexy.com) providing your Order ID, device details (MAC address / App type), and connection diagnostics. Eligible refunds will be returned to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Exclusions</h2>
            <p>
              Refunds will not be issued for channel updates, local ISP connection fluctuations, device configuration mistakes, or standard buyer change-of-mind after successful activation lines have been issued.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
