import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { formatINR, useStore } from '../../store/useStore';
import { Heart, Star, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const primaryImage = product.images[0] || '';

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white border border-[#0F1B2D]/10 hover:border-[#F59E0B]/50 transition-all hover:shadow-md group">
        <Link to={`/product/${product.id}`} className="w-full sm:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-[#F9F9F8] relative">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF6B4A] text-white">
              {discountPercent}% OFF
            </span>
          )}
        </Link>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>By {product.sellerName}</span>
            {product.isCodAvailable && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">COD Available</span>
              </>
            )}
          </div>

          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-display font-semibold text-lg text-[#0F1B2D] group-hover:text-[#FF6B4A] transition-colors truncate">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
            </div>
            <span aria-hidden="true">·</span>
            <span>{product.reviewCount} verified reviews</span>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-[#0F1B2D] tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.id);
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#FF6B4A] hover:bg-slate-50 transition-colors"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#FF6B4A] text-[#FF6B4A]' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-semibold transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-[#0F1B2D]/10 hover:border-[#F59E0B]/50 transition-all hover:shadow-lg overflow-hidden relative">
      {/* Product Image Stage */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-[#F9F9F8] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Sticker-style badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FF6B4A] text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F59E0B] text-[#0F1B2D] shadow-xs">
              Top Seller
            </span>
          )}
        </div>

        {/* Wishlist quick button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-[#FF6B4A] hover:bg-white shadow-xs transition-transform active:scale-90"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#FF6B4A] text-[#FF6B4A]' : ''}`} />
        </button>

        {/* Quick Add Overlay on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-full py-2.5 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add to Bag</span>
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Metadata unboxed text */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-700 uppercase tracking-wide truncate max-w-[140px]">
              {product.sellerName}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-amber-600 font-semibold shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating}</span>
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-display font-medium text-sm text-[#0F1B2D] group-hover:text-[#FF6B4A] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & COD info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold font-mono text-[#0F1B2D] tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            {product.isCodAvailable && (
              <p className="text-[10px] text-emerald-700 font-medium">COD Available</p>
            )}
          </div>

          {/* Mobile direct add button */}
          <button
            onClick={() => addToCart(product)}
            className="sm:hidden p-2 rounded-xl bg-[#0F1B2D] text-white hover:bg-[#1D3557]"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
