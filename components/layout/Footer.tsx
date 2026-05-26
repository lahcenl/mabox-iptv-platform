'use client';

import Link from 'next/link';
import { Tv, Mail, Phone, MessageCircle, ArrowRight, Clock } from 'lucide-react';
import { useTranslations } from '@/components/providers/I18nProvider';

// Inline SVG brand icons as React components
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4l16 16M4 20 20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  );
}

type SocialLink = {
  label: string;
  href: string;
  Icon: React.FC<{ className?: string }>;
  color: string;
};

const socialLinks: SocialLink[] = [
  { label: 'Facebook', href: '/#', Icon: FacebookIcon, color: 'hover:bg-blue-600' },
  { label: 'Twitter / X', href: '/#', Icon: TwitterIcon, color: 'hover:bg-sky-500' },
  { label: 'Instagram', href: '/#', Icon: InstagramIcon, color: 'hover:bg-pink-600' },
  { label: 'WhatsApp', href: '/#', Icon: MessageCircle, color: 'hover:bg-green-500' },
  { label: 'YouTube', href: '/#', Icon: YoutubeIcon, color: 'hover:bg-red-600' },
];

export default function Footer({ locale }: { locale: string }) {
  const { t, localize } = useTranslations();

  const quickLinks = [
    { label: t('footer.links.refund'), href: '/refund-policy' },
    { label: t('footer.links.privacy'), href: '/privacy-policy' },
    { label: t('footer.links.terms'), href: '/terms' },
    { label: t('footer.links.about'), href: '/about' },
    { label: t('footer.links.faq'), href: '/faq' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-900 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-2xl font-bold">{t('footer.ctaTitle')}</h3>
            <p className="text-violet-200 text-sm mt-1">
              {t('footer.ctaSubtitle')}
            </p>
          </div>
          <Link
            href={localize('/products')}
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition-all duration-200 shadow-lg text-sm flex-shrink-0"
          >
            {t('footer.ctaButton')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href={localize('/')} className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center">
                <Tv className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white">Ondexy</span>
                <span className="text-xl font-extrabold text-violet-400">.com</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={localize(social.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-9 h-9 bg-gray-800 ${social.color} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110`}
                >
                  <social.Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative pb-3 after:absolute after:bottom-0 after:left-0 rtl:after:left-auto rtl:after:right-0 after:w-8 after:h-0.5 after:bg-violet-500">
              {t('footer.contactUs')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@ondexy.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 bg-gray-800 group-hover:bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{t('footer.emailSupport')}</div>
                    <span className="text-sm text-gray-300 group-hover:text-violet-400 transition-colors">
                      support@ondexy.com
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${t('common.whatsappNumber')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 bg-gray-800 group-hover:bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">{t('footer.whatsappPhone')}</div>
                    <span className="text-sm text-gray-300 group-hover:text-green-400 transition-colors">
                      +1 (234) 567-890
                    </span>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{t('footer.supportHours')}</div>
                  <span className="text-sm text-gray-300">{t('footer.supportHoursVal')}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{t('footer.openingHours')}</div>
                  <span className="text-sm text-gray-300 font-medium">{t('footer.openingHoursVal')}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative pb-3 after:absolute after:bottom-0 after:left-0 rtl:after:left-auto rtl:after:right-0 after:w-8 after:h-0.5 after:bg-violet-500">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={localize(link.href)}
                    className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 rtl:rotate-180 rtl:ml-0 rtl:-mr-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-base mb-5 relative pb-3 after:absolute after:bottom-0 after:left-0 rtl:after:left-auto rtl:after:right-0 after:w-8 after:h-0.5 after:bg-violet-500">
              {t('footer.stayUpdated')}
            </h4>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t('footer.stayUpdatedDesc')}
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-violet-900/40"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Ondexy.com. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-4">
            <Link href={localize('/terms')} className="text-xs text-gray-500 hover:text-violet-400 transition-colors">
              {t('footer.links.terms')}
            </Link>
            <Link href={localize('/privacy-policy')} className="text-xs text-gray-500 hover:text-violet-400 transition-colors">
              {t('footer.links.privacy')}
            </Link>
            <Link href={localize('/refund-policy')} className="text-xs text-gray-500 hover:text-violet-400 transition-colors">
              {t('footer.links.refund')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
