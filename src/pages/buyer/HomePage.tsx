import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { ProductCard } from '../../components/buyer/ProductCard';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  Truck,
  CheckCircle2,
  Star,
  ShieldCheck,
  TrendingUp,
  Percent,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, sellers } = useStore();
  const navigate = useNavigate();

  const trendingProducts = products.filter(p => p.isTrending || p.rating >= 4.85).slice(0, 8);
  const dealProducts = products.filter(p => p.originalPrice > p.price).slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section: Modern Indian Bazaar meets Clean Fintech */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF7F0] via-[#F5EFE6] to-[#FBF7F0] pt-12 pb-20 border-b border-[#0F1B2D]/5">
        {/* Delicate background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#FF6B4A]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F1B2D]/5 border border-[#0F1B2D]/10 text-xs font-semibold text-[#0F1B2D]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                <span>The Premier Indian Artisan Multi-Vendor Marketplace</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0F1B2D] leading-[1.1] tracking-tight font-display">
                List. Sell. Deliver.
                <span className="block text-[#FF6B4A] mt-2 font-normal italic font-serif">
                  Every thread tells an Indian story.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Connect directly with master weavers, lost-wax metal sculptors, and herbal apothecary creators across India. Verified authenticity, transparent 24h seller payouts, and insured pan-India delivery.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-7 py-3.5 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F59E0B]" />
                </Link>

                <Link
                  to="/become-a-seller"
                  className="px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0F1B2D] border border-slate-300 font-semibold text-sm shadow-xs hover:border-[#FF6B4A] transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-[#FF6B4A]" />
                  <span>Start Selling (Free Onboarding)</span>
                </Link>
              </div>

              {/* Quick stats proof bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#0F1B2D]/10 max-w-lg">
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] tabular-nums">600+</p>
                  <p className="text-xs text-slate-500 font-medium">Artisan Guilds</p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] tabular-nums">24h</p>
                  <p className="text-xs text-slate-500 font-medium">Fast Dispatch</p>
                </div>
                <div>
                  <p className="font-mono text-xl sm:text-2xl font-bold text-[#0F1B2D] tabular-nums">100%</p>
                  <p className="text-xs text-slate-500 font-medium">COD & GI Verified</p>
                </div>
              </div>
            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Featured Showcase Card */}
                <div className="rounded-3xl p-6 bg-white border border-[#0F1B2D]/10 shadow-xl space-y-4">
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src={products[0]?.images[0]}
                      alt="Artisan Craft Showcase"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#0F1B2D]/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                      GI Heritage Certified
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Chanderi Weaver Cluster, MP</p>
                      <h3 className="font-display font-bold text-lg text-[#0F1B2D]">Handcrafted Heritage Silks</h3>
                    </div>
                    <span className="font-mono font-bold text-lg text-[#0F1B2D] tabular-nums">
                      {formatINR(4899)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>In Stock · Free Express Delivery</span>
                    </span>
                    <Link to="/product/prod-1" className="text-[#FF6B4A] font-semibold hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>

                {/* Floating Artisan Quote Badge */}
                <div className="absolute -bottom-6 -left-6 bg-[#0F1B2D] text-white p-4 rounded-2xl shadow-xl max-w-xs hidden sm:block border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#0F1B2D] flex items-center justify-center font-bold text-sm">
                      KM
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Kavita Maheshwari</p>
                      <p className="text-[10px] text-slate-300">Master Weaver · 342 sales this month</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 italic mt-2">
                    "Ecomma lets us sell directly to customers in Bengaluru & Mumbai without middlemen."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive "List -> Sell -> Deliver" 3-Step Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#0F1B2D] text-white relative overflow-hidden">
          <div className="max-w-xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">The Marketplace Engine</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display mt-1 text-white">
              How Ecomma Works for India
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              A frictionless bridge between artisanal workshops and conscious urban households.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1: List */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-display font-semibold text-lg text-white">List with AI Speed</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sellers upload 2 photos and rough keywords. Gemini AI auto-generates SEO titles, bullet specs, tags, and suggested price ranges in 3 seconds.
              </p>
            </div>

            {/* Step 2: Sell */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/20 text-[#FF6B4A] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Sell with Trust</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Shoppers enjoy Cash on Delivery, instant UPI, natural-language search, and live AI product Q&A. Escrow holds payments securely.
              </p>
            </div>

            {/* Step 3: Deliver */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/20 text-[#14B8A6] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-display font-semibold text-lg text-white">Deliver & Settle</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatic courier allocation, generated AWB shipping labels, real-time tracking, and automated 24-hour seller payout remittance upon delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Tiles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-[#FF6B4A] uppercase tracking-wider">Curated Taxonomy</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F1B2D]">
              Explore by Craft Category
            </h2>
          </div>
          <Link to="/products" className="text-sm font-semibold text-[#0F1B2D] hover:text-[#FF6B4A] flex items-center gap-1">
            <span>View All ({products.length} Products)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-2xl bg-white border border-[#0F1B2D]/10 hover:border-[#F59E0B] hover:shadow-md transition-all group space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FBF7F0] group-hover:bg-[#F59E0B]/10 text-[#0F1B2D] group-hover:text-[#F59E0B] flex items-center justify-center transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-[#0F1B2D] group-hover:text-[#FF6B4A] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{cat.description}</p>
                <p className="text-[11px] font-semibold text-[#14B8A6] mt-2">{cat.productCount} authentic items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF6B4A]" />
              <span className="text-xs font-semibold text-[#FF6B4A] uppercase tracking-wider">Top Rated This Week</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F1B2D] mt-1">
              Trending Handcrafted Collections
            </h2>
          </div>

          <Link to="/products?sort=top-rated" className="text-sm font-semibold text-[#0F1B2D] hover:text-[#FF6B4A] flex items-center gap-1">
            <span>Explore All Trending</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Top Sellers Carousel / Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#F5EFE6] border border-[#0F1B2D]/10 space-y-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-[#0F1B2D] uppercase tracking-wider">Verified Master Guilds</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F1B2D] mt-1">
              Meet the Artisans Behind the Work
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              100% of purchase proceeds go directly to registered artisan cooperative accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sellers.slice(0, 3).map((seller) => (
              <div
                key={seller.id}
                className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                    <img src={seller.logo} alt={seller.storeName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-base text-[#0F1B2D]">{seller.storeName}</h3>
                    <p className="text-xs text-slate-500">{seller.pickupAddress.city}, {seller.pickupAddress.state}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{seller.rating}</span>
                      <span className="text-slate-400 font-normal">({seller.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {seller.description}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-[#14B8A6] font-semibold">Verified GI Seller</span>
                  <Link
                    to={`/products?seller=${encodeURIComponent(seller.storeName)}`}
                    className="text-xs font-semibold text-[#0F1B2D] hover:text-[#FF6B4A] flex items-center gap-1"
                  >
                    <span>View Store Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Festive Deals Section with Promo Code Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#FF6B4A]/10 to-amber-500/10 border border-[#F59E0B]/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B4A] text-white text-xs font-bold">
              <Percent className="w-3.5 h-3.5" />
              <span>Limited Festive Offer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F1B2D]">
              Get 10% Off on Heritage Handlooms
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Use code <strong className="font-mono text-[#0F1B2D] bg-white px-2 py-0.5 rounded border border-slate-300">NAMASTE10</strong> at checkout on orders above ₹999. Includes Cash on Delivery and doorstep returns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-semibold text-sm shadow-md transition-colors whitespace-nowrap"
            >
              Shop Festive Sale
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Seller CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0F1B2D] text-white grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#14B8A6]">Empowering Creators</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Are you an Indian artisan, weaver, or manufacturer?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Join Ecomma with zero onboarding fees, competitive 8% platform commission, AI listing assistance, automatic courier pickup, and guaranteed 24-hour payouts.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <Link
              to="/become-a-seller"
              className="px-8 py-4 rounded-2xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-bold text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>Apply to Sell</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
