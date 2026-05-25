import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Understand how Ondexy collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: May 25, 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when purchasing subscriptions, setting up an account, or contacting customer support. This may include your name, email address, phone number, WhatsApp contact info, and billing details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>
              Ondexy uses the collected data to process orders, deliver subscription links, configure access codes, send server status updates, and provide 24/7 technical customer support via live chat or WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Data Protection and Security</h2>
            <p>
              We implement state-of-the-art security measures to protect your credentials, personal data, and transaction histories. Our databases are strictly isolated, and payment details are processed through encrypted, industry-standard gateways.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Cookies and Tracking</h2>
            <p>
              We use functional cookies to enhance browsing stability, maintain shopping cart states, and analyze user flows to continuously polish UI layouts and catalog presentations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Third-Party Disclosures</h2>
            <p>
              We do not sell, trade, or transfer your personal data to external parties, except as required to fulfill purchases (such as sharing activation details with specialized delivery servers) or comply with legal guidelines.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
