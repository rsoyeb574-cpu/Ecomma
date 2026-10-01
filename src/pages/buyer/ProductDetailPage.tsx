import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { ProductCard } from '../../components/buyer/ProductCard';
import { ProductQA } from '../../components/buyer/ProductQA';
import { Review } from '../../types';
import { addReview, getReviews } from '../../services/storageService';
import { summarizeReviews, ReviewSummaryResponse } from '../../services/geminiService';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Share2,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, addToast, currentUser } = useStore();

  const product = products.find(p => p.id === id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product?.variants?.[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState('560103'); // Default Bengaluru tech hub
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; deliveryDate?: string; codAvailable?: boolean }>({
    checked: true,
    valid: true,
    deliveryDate: 'Expected delivery in 2-4 business days',
    codAvailable: product?.isCodAvailable ?? true
  });

  // Reviews state & AI review summary
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aiSummary, setAiSummary] = useState<ReviewSummaryResponse | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Add review form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      const prodReviews = getReviews(product.id);
      setReviews(prodReviews);
      setSelectedImageIndex(0);
      if (product.variants?.length) {
        setSelectedVariantId(product.variants[0].id);
      }

      // Fetch AI review summary
      if (prodReviews.length > 0) {
        setLoadingSummary(true);
        summarizeReviews(prodReviews)
          .then(summary => setAiSummary(summary))
          .catch(() => setAiSummary(null))
          .finally(() => setLoadingSummary(false));
      }
    }
  }, [id, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">Product not found</h2>
        <p className="text-slate-500 text-sm">The listing you requested is not available or has been moved.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold">
          Browse All Crafts
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants?.find(v => v.id === selectedVariantId);
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant ? selectedVariant.originalPrice : product.originalPrice;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const discountPercent = Math.round(
    ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
  );

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeStatus({ checked: true, valid: false });
      return;
    }
    const days = pincode.startsWith('560') || pincode.startsWith('110') || pincode.startsWith('400') ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + days);

    setPincodeStatus({
      checked: true,
      valid: true,
      deliveryDate: `Estimated delivery by ${estDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}`,
      codAvailable: product.isCodAvailable
    });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    const rev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      rating: newRating,
      title: newTitle || 'Exceptional craftsmanship',
      comment: newComment,
      date: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
      helpfulCount: 0
    };

    addReview(rev);
    setReviews(prev => [rev, ...prev]);
    setNewTitle('');
    setNewComment('');
    setSubmittingReview(false);
    addToast('Thank you! Your verified review has been published.', 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariantId);
    navigate('/checkout');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb unboxed */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-[#0F1B2D]">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#0F1B2D] truncate">
          {product.category}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#0F1B2D] font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Primary PDP 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Sticky Image Gallery */}
        <div className="lg:col-span-6 space-y-4 lg:sticky lg:top-28">
          {/* Main Selected Image Stage */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F9F9F8] border border-[#0F1B2D]/10 shadow-md">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-lg bg-[#FF6B4A] text-white shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#0F1B2D] shadow-md scale-95'
                      : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#0F1B2D]/10 text-center">
            <div className="space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#14B8A6] mx-auto" />
              <p className="text-xs font-semibold text-[#0F1B2D]">100% Genuine</p>
              <p className="text-[10px] text-slate-500">Silk Mark / GI Assured</p>
            </div>
            <div className="space-y-1 border-x border-slate-100">
              <RotateCcw className="w-5 h-5 text-[#FF6B4A] mx-auto" />
              <p className="text-xs font-semibold text-[#0F1B2D]">7-Day Returns</p>
              <p className="text-[10px] text-slate-500">Free doorstep pickup</p>
            </div>
            <div className="space-y-1">
              <Truck className="w-5 h-5 text-[#F59E0B] mx-auto" />
              <p className="text-xs font-semibold text-[#0F1B2D]">Fast Shipping</p>
              <p className="text-[10px] text-slate-500">Pan-India express</p>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title & Seller Kicker */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-800 uppercase tracking-wider">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>SKU: {selectedVariant?.sku || `ECM-${product.id}`}</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D] leading-tight">
              {product.title}
            </h1>

            {/* Seller & Rating Bar */}
            <div className="flex items-center gap-3 pt-1 text-xs">
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-slate-900">{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">
                Sold by <strong className="text-slate-900">{product.sellerName}</strong>
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#F5EFE6] border border-[#0F1B2D]/10 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold font-mono text-[#0F1B2D] tabular-nums">
                {formatINR(currentPrice)}
              </span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                  {formatINR(currentOriginalPrice)}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
              Inclusive of all taxes
            </span>
          </div>

          {/* Variants Selector (if applicable) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Select Option / Size:</span>
                <span className="text-[#FF6B4A]">{selectedVariant?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      selectedVariantId === v.id
                        ? 'bg-[#0F1B2D] text-white border-[#0F1B2D] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock availability & Quantity */}
          <div className="flex items-center gap-6 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 font-mono text-xs font-bold tabular-nums min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-3 py-1.5 hover:bg-slate-100 text-slate-600 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500">Availability:</span>
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Stock ({currentStock} available)</span>
              </p>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => addToCart(product, quantity, selectedVariantId)}
              className="py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0F1B2D] border-2 border-[#0F1B2D] font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="py-3.5 px-4 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 rounded-2xl bg-white border border-[#0F1B2D]/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1B2D]">
              <MapPin className="w-4 h-4 text-[#FF6B4A]" />
              <span>Delivery Pincode & COD Availability Check</span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#F59E0B]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors"
              >
                Check
              </button>
            </form>

            {pincodeStatus.checked && pincodeStatus.valid && (
              <div className="text-xs space-y-1 text-slate-600 pt-1">
                <p className="text-slate-800 font-semibold">{pincodeStatus.deliveryDate}</p>
                <p className="text-emerald-700 font-medium">
                  {pincodeStatus.codAvailable ? '✓ Cash on Delivery (COD) is available' : 'Prepaid only for this address'}
                </p>
              </div>
            )}
            {pincodeStatus.checked && !pincodeStatus.valid && (
              <p className="text-xs text-[#FF6B4A]">Please enter a valid 6-digit Indian postal pincode.</p>
            )}
          </div>

          {/* Bullet Features */}
          <div className="space-y-3 pt-2">
            <h3 className="font-display font-bold text-base text-[#0F1B2D]">Artisan Specifications</h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {product.bulletFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description Prose */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="font-display font-bold text-base text-[#0F1B2D]">Story & Craftsmanship</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Ask AI About This Product Widget */}
          <div className="pt-4">
            <ProductQA product={product} />
          </div>
        </div>
      </div>

      {/* Customer Reviews & AI Review Summary Section */}
      <section className="pt-10 border-t border-[#0F1B2D]/10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">Customer Reviews & Ratings</h2>
            <p className="text-xs text-slate-500 mt-1">Verified buyer feedback from actual marketplace transactions</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-mono text-2xl font-bold text-[#0F1B2D]">{product.rating} / 5</p>
              <p className="text-xs text-slate-400">Based on {reviews.length} reviews</p>
            </div>
          </div>
        </div>

        {/* AI Review Summary Card (Hero Gemini Feature) */}
        {aiSummary && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-white border border-[#F59E0B]/30 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
              <h3 className="font-display font-bold text-base text-[#0F1B2D]">AI Review Summary</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#0F1B2D] font-bold">
                Synthesized by Gemini
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{aiSummary.summary}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Pros */}
              <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1.5">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Top Commendations</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {aiSummary.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons / Considerations */}
              {aiSummary.cons.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Considerations</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {aiSummary.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0F1B2D] text-white flex items-center justify-center font-bold text-xs">
                    {rev.buyerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F1B2D]">{rev.buyerName}</p>
                    <p className="text-[10px] text-emerald-700 font-medium">Verified Purchase · {rev.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h3 className="font-display font-bold text-lg text-[#0F1B2D]">Write a Verified Review</h3>
          <form onSubmit={handleAddReview} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewRating(num)}
                    className="p-1 text-amber-500 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${num <= newRating ? 'fill-current' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Review Headline</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Stunning weave and super comfortable!"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#F59E0B]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Feedback</label>
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Describe material feel, fit, packaging, or artisan craftsmanship..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-[#F59E0B]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-semibold"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-[#0F1B2D]/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">More from {product.category}</h2>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-[#FF6B4A] hover:underline flex items-center gap-1">
              <span>View Category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
