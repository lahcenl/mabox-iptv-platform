import type { Metadata } from 'next';
import Link from 'next/link';
import { readArticles } from '@/lib/articles';
import { BookOpen, Calendar, ArrowRight, Rss } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog – IPTV Guides, Tips & News',
  description:
    'Expert articles on IPTV setup, streaming tips, device guides, and the latest news from Ondexy.',
  openGraph: {
    title: 'Blog – IPTV Guides, Tips & News',
    description: 'Expert articles on IPTV setup, streaming tips, and more.',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPage() {
  const articles = await readArticles();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-violet-100">
            <Rss className="w-3.5 h-3.5" />
            Latest Articles
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">IPTV Blog & Guides</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Expert tips, setup guides, and the latest news to get the most out of your IPTV
            subscription.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Empty state */}
        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">No articles yet</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Check back soon — we&apos;re writing guides to help you get set up.
            </p>
          </div>
        )}

        {/* Articles grid */}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Cover Image */}
                {article.coverImage ? (
                  <div className="aspect-video overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-violet-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(article.date)}
                    <span className="text-gray-300">·</span>
                    <span>{article.author}</span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-700 transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-sm text-gray-500 line-clamp-3 flex-1">{article.excerpt}</p>

                  <div className="flex items-center gap-1.5 text-violet-600 text-sm font-semibold mt-4">
                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
