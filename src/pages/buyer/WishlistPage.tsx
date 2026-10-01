import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ProductCard } from '../../components/buyer/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#0F1B2D]/10 pb-4">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D] flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#FF6B4A] fill-current" />
          <span>My Saved Items ({wishlistedProducts.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">Keep track of your favorite handlooms, jewelry, and pottery pieces</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-[#FF6B4A] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-[#0F1B2D]">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our artisanal marketplace and tap the heart icon on any product to save it for later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
