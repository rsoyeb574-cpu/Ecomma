import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { Product, AIGeneratedListing } from '../../types';
import { generateListingWithAI } from '../../services/geminiService';
import { createCraftSvg } from '../../data/mockData';
import {
  Sparkles,
  Upload,
  RefreshCw,
  Check,
  Search,
  Eye,
  Sliders,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  DollarSign
} from 'lucide-react';

export const SellerListingEditorPage: React.FC = () => {
  const { categories, addProduct, currentUser, sellers } = useStore();
  const navigate = useNavigate();

  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];

  // Inputs
  const [roughKeywords, setRoughKeywords] = useState('red cotton chanderi kurti women');
  const [categoryHint, setCategoryHint] = useState('Ethnic Wear & Handlooms');
  const [craftTone, setCraftTone] = useState('Warm, confident, editorial');
  const [selectedImage, setSelectedImage] = useState<string>(
    createCraftSvg('#9E2A2B', '#E09F3E', 'Chanderi Kurti', 'Ethnic Wear')
  );

  // AI Output & Editor State
  const [isGenerating, setIsGenerating] = useState(false);
  const [listing, setListing] = useState<AIGeneratedListing>({
    title: 'Handcrafted Chanderi Cotton Kurti - Crimson & Zari Placket',
    description: 'Woven by traditional artisans in Chanderi, this lightweight cotton kurti features rich natural crimson madder dye and fine gold tested zari bugdi borders along the neckline. Designed for all-day festive comfort and refined workplace elegance.',
    features: [
      'Pure mercerized Chanderi cotton with breathable featherlight drape',
      'Hand-woven gold zari geometric motifs on front placket',
      'Side pockets with reinforced bar-tack artisan stitching',
      'Hypoallergenic plant-based natural dye with colorfast finish',
      'Includes certified Handloom Mark tag from Madhya Pradesh'
    ],
    category: 'Ethnic Wear & Handlooms',
    tags: ['chanderi', 'cotton kurti', 'handloom', 'crimson', 'festive wear', 'zari'],
    metaTitle: 'Buy Handcrafted Chanderi Cotton Kurti Online | Ecomma India',
    metaDescription: 'Shop pure Chanderi handloom kurti with zari placket. Direct artisan price, Cash on Delivery available with 7-day returns.',
    suggestedPriceRange: { min: 1499, max: 2899, optimal: 1999 },
    seoScore: 94,
    improvementTips: [
      'Add 2 close-up photos of the neckline zari embroidery to boost buyer confidence.',
      'Specify exact chest and sleeve measurements for all standard Indian sizes (S to XXL).'
    ]
  });

  const [activePrice, setActivePrice] = useState<number>(1999);
  const [stockQuantity, setStockQuantity] = useState<number>(20);
  const [previewTab, setPreviewTab] = useState<'buyer' | 'google'>('buyer');

  // Trigger Gemini AI generation
  const handleGenerateAI = async () => {
    if (!roughKeywords.trim()) return;

    setIsGenerating(true);
    try {
      const generated = await generateListingWithAI({
        keywords: roughKeywords,
        categoryHint,
        tone: craftTone,
        imageBase64List: [selectedImage]
      });

      setListing(generated);
      setActivePrice(generated.suggestedPriceRange?.optimal || 1999);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      sellerId: seller.id,
      sellerName: seller.storeName,
      sellerRating: seller.rating,
      title: listing.title,
      slug: listing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: listing.description,
      bulletFeatures: listing.features,
      category: listing.category || categoryHint,
      tags: listing.tags,
      images: [selectedImage],
      price: activePrice,
      originalPrice: Math.round(activePrice * 1.3),
      stock: stockQuantity,
      isCodAvailable: true,
      status: 'active',
      rating: 5.0,
      reviewCount: 0,
      variants: [
        { id: `v-${Date.now()}-s`, name: 'Size S (36")', sku: `SKU-${Date.now()}-S`, price: activePrice, originalPrice: Math.round(activePrice * 1.3), stock: Math.floor(stockQuantity / 2), attributes: { Size: 'S' } },
        { id: `v-${Date.now()}-m`, name: 'Size M (38")', sku: `SKU-${Date.now()}-M`, price: activePrice, originalPrice: Math.round(activePrice * 1.3), stock: Math.ceil(stockQuantity / 2), attributes: { Size: 'M' } }
      ],
      seoTitle: listing.metaTitle,
      seoDescription: listing.metaDescription,
      aiScore: listing.seoScore,
      returnPolicyDays: 7,
      weightGrams: 350,
      createdAt: new Date().toISOString().split('T')[0]
    };

    addProduct(newProduct);
    navigate('/seller/products');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">
              AI Listing Studio (Multimodal)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Type rough craft keywords or upload photos. Gemini creates SEO-optimized titles, descriptions, tags, and pricing.
          </p>
        </div>

        {/* SEO Score Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Marketplace SEO Score:</span>
          <span className="font-mono text-base font-bold text-[#14B8A6]">
            {listing.seoScore}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input & Editor Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. AI Prompt Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#F5EFE6] to-white border border-[#F59E0B]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Describe in a few words</span>
              </span>
              <span className="text-[11px] text-slate-500">Gemini 3.8 Flash Multimodal</span>
            </div>

            <div className="space-y-3">
              <textarea
                rows={2}
                value={roughKeywords}
                onChange={(e) => setRoughKeywords(e.target.value)}
                placeholder='e.g. "red cotton chanderi kurti women with zari placket"'
                className="w-full text-xs sm:text-sm bg-white border border-amber-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Target Category</label>
                  <select
                    value={categoryHint}
                    onChange={(e) => setCategoryHint(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Copywriting Tone</label>
                  <select
                    value={craftTone}
                    onChange={(e) => setCraftTone(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2"
                  >
                    <option value="Warm, confident, editorial">Warm & Editorial (Recommended)</option>
                    <option value="Authentic heritage & traditional">Heritage Tradition</option>
                    <option value="Luxury minimalist boutique">Luxury Minimalist</option>
                  </select>
                </div>
              </div>

              {/* Photo selector / presets */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">Listing Photo (Artisan Preset)</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    createCraftSvg('#9E2A2B', '#E09F3E', 'Chanderi Kurti', 'Ethnic Wear'),
                    createCraftSvg('#1D3557', '#457B9D', 'Indigo Tunic', 'Handloom'),
                    createCraftSvg('#3D261D', '#8C5A3C', 'Dhokra Brassware', 'Sculpture'),
                    createCraftSvg('#4F1D2B', '#E29578', 'Ayurvedic Fluid', 'Wellness')
                  ].map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-transform ${
                        selectedImage === imgUrl ? 'border-[#0F1B2D] scale-95 ring-2 ring-[#0F1B2D]/20' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={isGenerating || !roughKeywords.trim()}
                onClick={handleGenerateAI}
                className="w-full py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#F59E0B]" />
                    <span>Gemini is generating copy & tags...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>Generate Listing with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Editable Generated Fields */}
          <div className="p-6 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-base text-[#0F1B2D]">Listing Content Review & Edit</h2>

            {/* Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">SEO Product Title</label>
                <span className="text-[10px] text-slate-400 font-mono">{listing.title.length}/80 chars</span>
              </div>
              <input
                type="text"
                value={listing.title}
                onChange={(e) => setListing({ ...listing, title: e.target.value })}
                className="w-full text-xs sm:text-sm font-semibold text-[#0F1B2D] bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Editorial Description</label>
              <textarea
                rows={4}
                value={listing.description}
                onChange={(e) => setListing({ ...listing, description: e.target.value })}
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 leading-relaxed"
              />
            </div>

            {/* Bullet Features */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Artisan Bullet Features</label>
              <div className="space-y-1.5">
                {listing.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0"></span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...listing.features];
                        updated[i] = e.target.value;
                        setListing({ ...listing, features: updated });
                      }}
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg p-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Keywords & Search Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {listing.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing Selection */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">AI Suggested Price Range</span>
                <span className="text-xs text-slate-500 font-mono">
                  {formatINR(listing.suggestedPriceRange?.min || 1499)} – {formatINR(listing.suggestedPriceRange?.max || 2899)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Selling Price (INR)</label>
                  <input
                    type="number"
                    value={activePrice}
                    onChange={(e) => setActivePrice(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Improvement Tips */}
            {listing.improvementTips.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5">
                <p className="font-bold text-amber-900 uppercase text-[11px]">Gemini Optimization Advice</p>
                {listing.improvementTips.map((tip, i) => (
                  <p key={i} className="text-slate-700 leading-snug">• {tip}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-md space-y-4">
            {/* Preview Toggle Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-display font-bold text-sm text-[#0F1B2D] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#FF6B4A]" />
                <span>Live Previews</span>
              </span>

              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setPreviewTab('buyer')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${previewTab === 'buyer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  Buyer View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('google')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${previewTab === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                >
                  Google Snippet
                </button>
              </div>
            </div>

            {/* Buyer Product Card Preview */}
            {previewTab === 'buyer' ? (
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                <div className="aspect-square bg-slate-100 relative">
                  <img src={selectedImage} alt={listing.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF6B4A] text-white">
                    New Listing
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {listing.category} · Sold by {seller.storeName}
                  </p>
                  <h3 className="font-display font-semibold text-sm text-[#0F1B2D] line-clamp-2">
                    {listing.title}
                  </h3>

                  <div className="flex items-baseline justify-between pt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-base font-bold text-[#0F1B2D] tabular-nums">
                        {formatINR(activePrice)}
                      </span>
                      <span className="font-mono text-xs text-slate-400 line-through tabular-nums">
                        {formatINR(Math.round(activePrice * 1.3))}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">COD Available</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Google Search Result Preview */
              <div className="p-4 rounded-2xl bg-white border border-slate-200 font-sans text-xs space-y-1">
                <p className="text-[11px] text-slate-500 font-mono">https://ecomma.in/product/{listing.title.slice(0, 20).toLowerCase().replace(/\s+/g, '-')}</p>
                <h4 className="text-sm font-medium text-blue-700 hover:underline cursor-pointer leading-tight">
                  {listing.metaTitle}
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed pt-0.5">
                  {listing.metaDescription}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="text-amber-500 font-bold">★★★★★ 4.9</span>
                  <span>· Price: {formatINR(activePrice)}</span>
                  <span>· In stock</span>
                </div>
              </div>
            )}

            {/* Publish Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePublish}
                className="w-full py-3.5 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Publish to Marketplace Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
