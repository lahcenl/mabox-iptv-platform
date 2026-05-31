'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  AlertCircle,
  X,
  Check,
  ImageIcon,
  Info,
  DollarSign,
} from 'lucide-react';

// Dynamic import disables SSR for the Markdown editor (it's a browser-only component)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface PriceTier {
  duration: string;
  months?: number;
  price: number;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  priceTiers: PriceTier[];
  whatsappNumber: string;
  featured: boolean;
  
  // Localized fields
  name_en?: string;
  name_ar?: string;
  name_fr?: string;
  description_en?: string;
  description_ar?: string;
  description_fr?: string;
  
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  seoKeywords?: string;
}

interface ProductForm {
  name: string;
  description: string;
  image: string;
  category: string;
  pricingMode: 'subscription' | 'flat';
  priceTiers: { duration: string; price: string }[];
  
  // Localized fields
  name_en: string;
  name_ar: string;
  name_fr: string;
  description_en: string;
  description_ar: string;
  description_fr: string;
  
  // SEO fields
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string;
}

const EMPTY_TIER = { duration: '', price: '' };

const EMPTY_FORM: ProductForm = {
  name: '',
  description: '',
  image: '',
  category: 'IPTV Subscriptions',
  pricingMode: 'subscription',
  priceTiers: [{ ...EMPTY_TIER }],
  name_en: '',
  name_ar: '',
  name_fr: '',
  description_en: '',
  description_ar: '',
  description_fr: '',
  metaTitle: '',
  metaDescription: '',
  seoKeywords: '',
};

const CATEGORIES = ['IPTV Subscriptions', 'Players IPTV', 'beIN SPORTS'];

const DURATION_SUGGESTIONS = [
  'One-time', '1 Month', '3 Months', '6 Months', '12 Months',
  '1 Year', '2 Years', 'Lifetime',
];

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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

function PricingTierBuilder({
  tiers,
  onChange,
}: {
  tiers: { duration: string; price: string }[];
  onChange: (tiers: { duration: string; price: string }[]) => void;
}) {
  function updateTier(index: number, field: 'duration' | 'price', value: string) {
    const updated = tiers.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    onChange(updated);
  }

  function addTier() {
    onChange([...tiers, { ...EMPTY_TIER }]);
  }

  function removeTier(index: number) {
    if (tiers.length <= 1) return; // keep at least one
    onChange(tiers.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Pricing Tiers <span className="text-red-400">*</span>
        </label>
        <span className="text-xs text-gray-400">{tiers.length} tier{tiers.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-2.5">
        {tiers.map((tier, i) => (
          <div key={i} className="flex gap-2 items-start">
            {/* Duration input with datalist suggestions */}
            <div className="flex-1 min-w-0">
              <input
                id={`pf-tier-duration-${i}`}
                list="duration-suggestions"
                type="text"
                value={tier.duration}
                onChange={(e) => updateTier(i, 'duration', e.target.value)}
                placeholder="e.g. 1 Month, Lifetime"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
              <datalist id="duration-suggestions">
                {DURATION_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            {/* Price input */}
            <div className="relative w-28 flex-shrink-0">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id={`pf-tier-price-${i}`}
                type="number"
                min="0"
                step="0.01"
                value={tier.price}
                onChange={(e) => updateTier(i, 'price', e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl pl-7 pr-2.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeTier(i)}
              disabled={tiers.length <= 1}
              className="mt-0.5 p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              title="Remove tier"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addTier}
        className="mt-3 flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add another duration
      </button>
    </div>
  );
}

function ProductFormFields({
  form,
  onChange,
  saving,
  onSubmit,
  submitLabel,
}: {
  form: ProductForm;
  onChange: (f: ProductForm) => void;
  saving: boolean;
  onSubmit: () => void;
  submitLabel: string;
}) {
  const [activeTab, setActiveTab] = useState<'en' | 'ar' | 'fr'>('en');
  const [seoOpen, setSeoOpen] = useState(false);

  const tiersValid =
    form.priceTiers.length > 0 &&
    form.priceTiers.every((t) => t.duration.trim() !== '' && Number(t.price) > 0);
  const canSubmit = !!(form.name_en || form.name) && !!form.category && tiersValid;

  const handleNameChange = (val: string) => {
    if (activeTab === 'en') {
      onChange({ ...form, name_en: val, name: val });
    } else if (activeTab === 'ar') {
      onChange({ ...form, name_ar: val });
    } else {
      onChange({ ...form, name_fr: val });
    }
  };

  const handleDescChange = (val: string) => {
    if (activeTab === 'en') {
      onChange({ ...form, description_en: val, description: val });
    } else if (activeTab === 'ar') {
      onChange({ ...form, description_ar: val });
    } else {
      onChange({ ...form, description_fr: val });
    }
  };

  const currentName = activeTab === 'en' ? form.name_en : activeTab === 'ar' ? form.name_ar : form.name_fr;
  const currentDesc = activeTab === 'en' ? form.description_en : activeTab === 'ar' ? form.description_ar : form.description_fr;

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
          rows={3}
          placeholder={opts.placeholder}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none"
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

      {field('pf-name', `Product Name (${activeTab.toUpperCase()})`, currentName, handleNameChange, {
        placeholder: activeTab === 'en'
          ? 'e.g. Premium IPTV – 4K Package'
          : activeTab === 'ar'
          ? 'مثال: اشتراك IPTV ممتاز - باقة 4K'
          : 'ex: IPTV Premium - Pack 4K',
        required: activeTab === 'en',
      })}

      {/* Rich Text / Markdown Editor for Description */}
      <div>
        <label htmlFor="pf-desc" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description ({activeTab.toUpperCase()}) <span className="text-gray-400 font-normal">(supports Markdown)</span>
        </label>
        <div data-color-mode="light" id="pf-desc">
          <MDEditor
            value={currentDesc}
            onChange={(v) => handleDescChange(v ?? '')}
            height={200}
            preview="edit"
            visibleDragbar={false}
            textareaProps={{ placeholder: 'Describe what the customer gets… Use ## for headings, **bold**, - for bullets' }}
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
          Use <code className="bg-gray-100 px-1 rounded">##</code> for H2, <code className="bg-gray-100 px-1 rounded">**bold**</code>.
        </p>
      </div>

      {/* Image URL with hint */}
      <div>
        <label htmlFor="pf-image" className="block text-sm font-medium text-gray-700 mb-1.5">
          Image URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="pf-image"
            type="url"
            value={form.image}
            onChange={(e) => onChange({ ...form, image: e.target.value })}
            placeholder="https://i.postimg.cc/..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="pf-category" className="block text-sm font-medium text-gray-700 mb-1.5">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          id="pf-category"
          value={form.category}
          onChange={(e) => onChange({ ...form, category: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Pricing Mode Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pricing Mode <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-3">
          <label
            className={`flex-1 flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
              form.pricingMode === 'subscription'
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="pf-pricing-mode"
              value="subscription"
              checked={form.pricingMode === 'subscription'}
              onChange={() =>
                onChange({
                  ...form,
                  pricingMode: 'subscription',
                  priceTiers: form.priceTiers.length > 0 ? form.priceTiers : [{ ...EMPTY_TIER }],
                })
              }
              className="accent-violet-600"
            />
            <span className="text-sm font-semibold">Subscription</span>
          </label>
          <label
            className={`flex-1 flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
              form.pricingMode === 'flat'
                ? 'border-violet-500 bg-violet-50 text-violet-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="pf-pricing-mode"
              value="flat"
              checked={form.pricingMode === 'flat'}
              onChange={() =>
                onChange({
                  ...form,
                  pricingMode: 'flat',
                  priceTiers: [{ duration: 'One-time', price: form.priceTiers[0]?.price ?? '' }],
                })
              }
              className="accent-violet-600"
            />
            <span className="text-sm font-semibold">One-time / Flat</span>
          </label>
        </div>
      </div>

      {/* Dynamic Pricing Tiers */}
      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
        {form.pricingMode === 'flat' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Flat Price <span className="text-red-400">*</span>
            </label>
            <div className="relative w-40">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                id="pf-flat-price"
                type="number"
                min="0"
                step="0.01"
                value={form.priceTiers[0]?.price ?? ''}
                onChange={(e) =>
                  onChange({
                    ...form,
                    priceTiers: [{ duration: 'One-time', price: e.target.value }],
                  })
                }
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-xl pl-7 pr-2.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
          </div>
        ) : (
          <>
            <PricingTierBuilder
              tiers={form.priceTiers}
              onChange={(tiers) => onChange({ ...form, priceTiers: tiers })}
            />
          </>
        )}
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
            {field('pf-meta-title', 'Meta Title', form.metaTitle, (v) => onChange({ ...form, metaTitle: v }), {
              required: false,
              placeholder: 'e.g. Premium IPTV 4K Subscription | Ondexy',
            })}
            {field('pf-meta-desc', 'Meta Description', form.metaDescription, (v) => onChange({ ...form, metaDescription: v }), {
              required: false,
              textarea: true,
              placeholder: 'Get instant activation on premium IPTV servers with 10k+ live channels in Full HD & 4K...',
            })}
            {field('pf-seo-keywords', 'SEO Keywords (comma-separated)', form.seoKeywords, (v) => onChange({ ...form, seoKeywords: v }), {
              required: false,
              placeholder: 'iptv, buy iptv, 4k iptv, premium channels',
            })}
          </div>
        )}
      </div>

      <button
        id="product-form-submit"
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/alt7km/products');
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function openAdd() {
    setForm({ ...EMPTY_FORM, priceTiers: [{ ...EMPTY_TIER }] });
    setShowAddModal(true);
  }

  function openEdit(p: Product) {
    const isFlat =
      p.priceTiers.length === 1 &&
      (p.priceTiers[0].duration === 'One-time' || p.priceTiers[0].duration === 'Lifetime');
    setForm({
      name: p.name,
      description: p.description,
      image: p.image,
      category: p.category,
      pricingMode: isFlat ? 'flat' : 'subscription',
      // Convert stored PriceTier[] to the form's string-based format
      priceTiers: p.priceTiers.map((t) => ({
        duration: t.duration,
        price: String(t.price),
      })),
      name_en: p.name_en || '',
      name_ar: p.name_ar || '',
      name_fr: p.name_fr || '',
      description_en: p.description_en || '',
      description_ar: p.description_ar || '',
      description_fr: p.description_fr || '',
      metaTitle: p.metaTitle || '',
      metaDescription: p.metaDescription || '',
      seoKeywords: p.seoKeywords || '',
    });
    setEditProduct(p);
  }

  /** Convert form's string-based priceTiers to proper PriceTier objects */
  function parseTiers(tiers: { duration: string; price: string }[]): PriceTier[] {
    return tiers.map((t) => ({
      duration: t.duration.trim(),
      price: Number(t.price),
    }));
  }

  async function handleAdd() {
    setSaving(true);
    try {
      const res = await fetch('/api/alt7km/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          image: form.image,
          category: form.category,
          priceTiers: parseTiers(form.priceTiers),
          name_en: form.name_en,
          name_ar: form.name_ar,
          name_fr: form.name_fr,
          description_en: form.description_en,
          description_ar: form.description_ar,
          description_fr: form.description_fr,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          seoKeywords: form.seoKeywords,
        }),
      });
      if (!res.ok) throw new Error('Failed to add product');
      await fetchProducts();
      setShowAddModal(false);
    } catch {
      setError('Failed to add product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit() {
    if (!editProduct) return;
    setSaving(true);
    try {
      const res = await fetch('/api/alt7km/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editProduct.id,
          name: form.name,
          description: form.description,
          image: form.image,
          category: form.category,
          priceTiers: parseTiers(form.priceTiers),
          name_en: form.name_en,
          name_ar: form.name_ar,
          name_fr: form.name_fr,
          description_en: form.description_en,
          description_ar: form.description_ar,
          description_fr: form.description_fr,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          seoKeywords: form.seoKeywords,
        }),
      });
      if (!res.ok) throw new Error('Failed to update product');
      await fetchProducts();
      setEditProduct(null);
    } catch {
      setError('Failed to update product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await fetch('/api/alt7km/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError('Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add, edit, or remove your store products</p>
        </div>
        <button
          id="add-product-btn"
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-2">
          <Package className="w-5 h-5 text-violet-600" />
          <h2 className="text-base font-semibold text-gray-900">Products</h2>
          {!loading && (
            <span className="ml-auto text-xs text-gray-400 font-medium">
              {products.length} items
            </span>
          )}
        </div>

        {loading && (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-600">No products yet</h3>
            <p className="text-sm text-gray-400 mt-1">Click &quot;Add Product&quot; to get started.</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Product', 'Category', 'Pricing', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const minPrice = Math.min(...p.priceTiers.map((t) => t.price));
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-violet-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{p.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[220px]">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-gray-900 text-sm">
                            from ${minPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.priceTiers.length} tier{p.priceTiers.length !== 1 ? 's' : ''}
                            {' · '}
                            {p.priceTiers.map((t) => t.duration).join(', ')}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.featured ? (
                          <span className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-semibold">Featured</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            id={`edit-product-${p.id.slice(0, 8)}`}
                            onClick={() => openEdit(p)}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-product-${p.id.slice(0, 8)}`}
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            {deletingId === p.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <Modal title="Add New Product" onClose={() => setShowAddModal(false)}>
          <ProductFormFields
            form={form}
            onChange={setForm}
            saving={saving}
            onSubmit={handleAdd}
            submitLabel="Add Product"
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <Modal title={`Edit: ${editProduct.name}`} onClose={() => setEditProduct(null)}>
          <ProductFormFields
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
