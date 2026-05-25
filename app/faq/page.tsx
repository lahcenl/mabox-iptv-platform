import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Find answers to common questions about Ondexy setup, trials, compatibility, and speed.',
};

export default function FAQPage() {
  const faqs = [
    {
      q: 'How does the 24 to 48 Hours Trial work?',
      a: 'We provide trial activation lines for you to test stream quality, device decoding, and app performance before subscribing to long-term plans. Triage setup instructions will be sent via WhatsApp.',
    },
    {
      q: 'Which devices are compatible with Ondexy subscriptions?',
      a: 'Our streams are compatible with Samsung & LG Smart TVs (via Smarters Pro, ibo Player, etc.), Android TV / Boxes, Amazon Firestick, Apple TV, MAG boxes, smartphones (iOS/Android), and PCs.',
    },
    {
      q: 'How long does activation take after ordering?',
      a: 'Delivery is typically completed in 5 to 15 minutes. Details and setup support guides will be dispatched directly to your provided WhatsApp number or email address.',
    },
    {
      q: 'What internet speed is recommended for stable streaming?',
      a: 'For HD streaming, we recommend at least 15 Mbps. For 4K streams, a stable speed of 30 Mbps or higher is recommended to ensure anti-buffer performance.',
    },
    {
      q: 'Do you offer custom reseller panel options?',
      a: 'Yes, we provide reseller dashboard packages with credit credits. This allows you to manage clients, activate lines, generate trial links, and customize DNS panels.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-center mb-10 text-sm">
          Everything you need to know about Ondexy plans, delivery, and setup.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <h3 className="font-bold text-gray-900 text-base mb-2">
                {faq.q}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
