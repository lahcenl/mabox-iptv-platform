'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  X,
  Check,
  Calendar,
  Info,
  ImageIcon,
} from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage: string;
  excerpt: string;
  date: string;
  author: string;
  
  // Localized fields
  title_en?: string;
  title_ar?: string;
  title_fr?: string;
  content_en?: string;
  content_ar?: string;
  content_fr?: string;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
}

interface ArticleForm {
  title: string;
  content: string;
  coverImage: string;
  author: string;
  
  // Localized fields
  title_en: string;
  title_ar: string;
  title_fr: string;
  content_en: string;
  content_ar: string;
  content_fr: string;
  
  // SEO fields
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
}

const EMPTY_FORM: ArticleForm = {
  title: '',
  content: '',
  coverImage: '',
  author: 'Admin',
  title_en: '',
  title_ar: '',
  title_fr: '',
  content_en: '',
  content_ar: '',
  content_fr: '',
  metaTitle: '',
  metaDescription: '',
  seoKeywords: '',
};

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ArticleFormFields({
  form,
  onChange,
  saving,
  onSubmit,
  submitLabel,
}: {
  form: ArticleForm;
  onChange: (f: ArticleForm) => void;
  saving: boolean;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const [activeTab, setActiveTab] = useState<'en' | 'ar' | 'fr'>('en');
  const [seoOpen, setSeoOpen] = useState(false);

  const canSubmit = !!(form.title_en || form.title) && !!(form.content_en || form.content);

  const handleTitleChange = (val: string) => {
    if (activeTab === 'en') {
      onChange({ ...form, title_en: val, title: val });
    } else if (activeTab === 'ar') {
      onChange({ ...form, title_ar: val });
    } else {
      onChange({ ...form, title_fr: val });
    }
  };

  const handleContentChange = (val: string) => {
    if (activeTab === 'en') {
      onChange({ ...form, content_en: val, content: val });
    } else if (activeTab === 'ar') {
      onChange({ ...form, content_ar: val });
    } else {
      onChange({ ...form, content_fr: val });
    }
  };

  const currentTitle = activeTab === 'en' ? form.title_en : activeTab === 'ar' ? form.title_ar : form.title_fr;
  const currentContent = activeTab === 'en' ? form.content_en : activeTab === 'ar' ? form.content_ar : form.content_fr;

  const field = (
    id: string,
    label: string,
    value: string,
    setter: (v: string) => void,
    opts?: { type?: string; placeholder?: string; textarea?: boolean; required?: boolean },
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {opts?.required !== false && <span className="text-red-400">*</span>}
      </label>
      {opts?.textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => setter(e.target.value)}
          rows={5}
          placeholder={opts.placeholder}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-y"
        />
      ) : (
        <input
          id={id}
          type={opts?.type ?? 'text'}
          value={value}
          onChange={(e) => setter(e.target.value)}
          placeholder={opts?.placeholder}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-100 mb-4 bg-gray-50/50 p-1.5 rounded-xl gap-1">
        {(['en', 'ar', 'fr'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveTab(lang)}
            className={`flex-1 py-2 text-center text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
              activeTab === lang
                ? 'bg-white text-violet-700 shadow-sm border border-gray-100'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
            }`}
          >
            {lang === 'en' ? '🇬🇧 EN' : lang === 'ar' ? '🇲🇦 AR' : '🇫🇷 FR'}
          </button>
        ))}
      </div>

      {field('af-title', `Title (${activeTab.toUpperCase()})`, currentTitle, handleTitleChange, {
        placeholder: activeTab === 'en'
          ? 'e.g. How to set up IPTV on your Smart TV'
          : activeTab === 'ar'
          ? 'مثال: كيفية إعداد IPTV على تلفزيونك الذكي'
          : 'ex: Comment configurer l\'IPTV sur votre Smart TV',
        required: activeTab === 'en',
      })}

      {/* Cover Image */}
      <div>
        <label htmlFor="af-image" className="block text-sm font-medium text-gray-700 mb-1.5">
          Cover Image URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="af-image"
            type="url"
            value={form.coverImage}
            onChange={(e) => onChange({ ...form, coverImage: e.target.value })}
            placeholder="https://i.postimg.cc/..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Author */}
      <div>
        <label htmlFor="af-author" className="block text-sm font-medium text-gray-700 mb-1.5">
          Author
        </label>
        <input
          id="af-author"
          type="text"
          value={form.author}
          onChange={(e) => onChange({ ...form, author: e.target.value })}
          placeholder="Admin"
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
        />
      </div>

      {/* Content Markdown Textarea */}
      <div>
        <label htmlFor="af-content" className="block text-sm font-medium text-gray-700 mb-1.5">
          Content ({activeTab.toUpperCase()}) <span className="text-red-400">*</span>
          <span className="text-gray-400 font-normal ml-1">(Markdown supported)</span>
        </label>
        <textarea
          id="af-content"
          value={currentContent}
          onChange={(e) => handleContentChange(e.target.value)}
          rows={8}
          placeholder={`## Section heading\n\nWrite your ${activeTab} content here...`}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-y"
        />
      </div>

      {/* Collapsible SEO Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setSeoOpen(!seoOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100/80 transition-colors text-sm font-bold text-gray-700 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">🔍 SEO & Metadata Settings (Hidden from Product Page)</span>
          <span className="text-gray-400">{seoOpen ? '▲ Hide' : '▼ Expand'}</span>
        </button>
        {seoOpen && (
          <div className="p-4 space-y-4 bg-white border-t border-gray-100">
            {field('af-meta-title', 'Meta Title', form.metaTitle, (v) => onChange({ ...form, metaTitle: v }), {
              required: false,
              placeholder: 'e.g. Setting Up IPTV Guide | Ondexy',
            })}
            {field('af-meta-desc', 'Meta Description', form.metaDescription, (v) => onChange({ ...form, metaDescription: v }), {
              required: false,
              textarea: true,
              placeholder: 'Learn how to configure premium IPTV servers on any device with this detailed guide...',
            })}
            {field('af-seo-keywords', 'SEO Keywords (comma-separated)', form.seoKeywords, (v) => onChange({ ...form, seoKeywords: v }), {
              required: false,
              placeholder: 'iptv guides, setup iptv, how to config smart tv',
            })}
          </div>
        )}
      </div>

      <button
        id="article-form-submit"
        onClick={onSubmit}
        disabled={saving || !canSubmit}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
      >
        {saving ? (
          <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
        ) : (
          <><Check className="w-4 h-4" /> {submitLabel}</>
        )}
      </button>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      setArticles(data.articles ?? []);
    } catch {
      setError('Failed to load articles.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setShowAddModal(true);
  }

  function openEdit(a: Article) {
    setForm({
      title: a.title,
      content: a.content,
      coverImage: a.coverImage,
      author: a.author,
      title_en: a.title_en || '',
      title_ar: a.title_ar || '',
      title_fr: a.title_fr || '',
      content_en: a.content_en || '',
      content_ar: a.content_ar || '',
      content_fr: a.content_fr || '',
      metaTitle: a.metaTitle || '',
      metaDescription: a.metaDescription || '',
      seoKeywords: a.seoKeywords || '',
    });
    setEditArticle(a);
  }

  async function handleAdd() {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await fetchArticles();
      setShowAddModal(false);
    } catch {
      setError('Failed to create article.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editArticle) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editArticle.id, ...form }),
      });
      if (!res.ok) throw new Error();
      await fetchArticles();
      setEditArticle(null);
    } catch {
      setError('Failed to update article.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await fetch('/api/admin/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError('Failed to delete article.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Manager</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Create, edit, and publish articles for{' '}
            <a href="/blog" target="_blank" className="text-violet-600 hover:underline">
              /blog
            </a>
          </p>
        </div>
        <button
          id="add-article-btn"
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Articles table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600" />
          <h2 className="text-base font-semibold text-gray-900">Articles</h2>
          {!loading && (
            <span className="ml-auto text-xs text-gray-400 font-medium">
              {articles.length} published
            </span>
          )}
        </div>

        {loading && (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-600">No articles yet</h3>
            <p className="text-sm text-gray-400 mt-1">
              Write your first article to grow your audience and boost SEO.
            </p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Title', 'Date', 'Author', 'Excerpt', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {a.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.coverImage} alt={a.title} className="w-12 h-8 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-violet-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight line-clamp-1 max-w-[200px]">
                            {a.title}
                          </p>
                          <a
                            href={`/blog/${a.slug}`}
                            target="_blank"
                            className="text-xs text-violet-500 hover:underline"
                          >
                            /blog/{a.slug}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(a.date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {a.author}
                    </td>
                    <td className="px-6 py-4 max-w-[240px]">
                      <p className="text-xs text-gray-400 line-clamp-2">{a.excerpt}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          id={`edit-article-${a.id.slice(0, 8)}`}
                          onClick={() => openEdit(a)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-article-${a.id.slice(0, 8)}`}
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          title="Delete"
                        >
                          {deletingId === a.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="New Article" onClose={() => setShowAddModal(false)}>
          <ArticleFormFields
            form={form}
            onChange={setForm}
            saving={saving}
            onSubmit={handleAdd}
            submitLabel="Publish Article"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editArticle && (
        <Modal title={`Edit: ${editArticle.title}`} onClose={() => setEditArticle(null)}>
          <ArticleFormFields
            form={form}
            onChange={setForm}
            saving={saving}
            onSubmit={handleEdit}
            submitLabel="Save Changes"
          />
        </Modal>
      )}
    </div>
  );
}
