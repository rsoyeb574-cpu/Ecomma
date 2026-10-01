import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Store,
  Check,
  X
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');

  // Group items by seller
  const sellerGroups = cart.reduce((groups, item) => {
    if (!groups[item.sellerId]) {
      groups[item.sellerId] = {
        sellerName: item.sellerName,
        items: []
      };
    }
    groups[item.sellerId].items.push(item);
    return groups;
  }, {} as Record<string, { sellerName: string; items: typeof cart }>);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalSubtotal = cart.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const sellerCount = Object.keys(sellerGroups).length;
  // Free shipping above ₹999, else ₹50 per seller
  const shippingTotal = subtotal >= 999 || subtotal === 0 ? 0 : sellerCount * 50;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingTotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">Your shopping bag is empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Explore authentic handlooms, lost-wax metal artifacts, and gourmet organic spices.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-md"
        >
          <span>Discover Artisanal Crafts</span>
          <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#0F1B2D]/10 pb-4">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">
          Shopping Bag ({cart.reduce((t, i) => t + i.quantity, 0)} items)
        </h1>
        <p className="text-xs text-slate-500 mt-1">Multi-vendor marketplace fulfillment grouped by verified artisan workshops</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items Grouped by Seller */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(sellerGroups).map(([sellerId, group]) => {
            const sellerSubtotal = group.items.reduce((s, i) => s + i.price * i.quantity, 0);

            return (
              <div
                key={sellerId}
                className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4"
              >
                {/* Seller Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#FF6B4A]" />
                    <span className="font-display font-bold text-sm text-[#0F1B2D]">{group.sellerName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                      Direct Fulfillment
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    Subtotal: {formatINR(sellerSubtotal)}
                  </span>
                </div>

                {/* Line Items */}
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Link to={`/product/${item.productId}`} className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover" />
                        </Link>

                        <div className="space-y-1">
                          <Link to={`/product/${item.productId}`}>
                            <h3 className="font-display font-medium text-sm text-[#0F1B2D] hover:text-[#FF6B4A] transition-colors line-clamp-1">
                              {item.productTitle}
                            </h3>
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-slate-500">Variant: {item.variantName}</p>
                          )}
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="font-mono font-bold text-sm text-[#0F1B2D] tabular-nums">
                              {formatINR(item.price)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="font-mono text-xs text-slate-400 line-through tabular-nums">
                                {formatINR(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-mono text-xs font-bold tabular-nums min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-400 hover:text-[#FF6B4A] rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Module */}
          <div className="p-5 rounded-2xl bg-white border border-[#0F1B2D]/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F1B2D]">
              <Tag className="w-4 h-4 text-[#F59E0B]" />
              <span>Apply Coupon</span>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div>
                  <p className="font-bold text-emerald-800">Coupon applied: {appliedCoupon.code}</p>
                  <p className="text-emerald-700">You saved {formatINR(discountAmount)}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. NAMASTE10"
                  className="flex-1 text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#F59E0B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            <div className="text-[11px] text-slate-500 pt-1">
              Popular code: <button onClick={() => applyCoupon('NAMASTE10')} className="font-mono font-bold text-[#FF6B4A] underline">NAMASTE10</button> (10% off)
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-[#0F1B2D]">Order Summary</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900 tabular-nums">{formatINR(subtotal)}</span>
              </div>

              {originalSubtotal > subtotal && (
                <div className="flex justify-between text-emerald-700">
                  <span>Product Discounts:</span>
                  <span className="font-mono font-semibold tabular-nums">- {formatINR(originalSubtotal - subtotal)}</span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Savings:</span>
                  <span className="font-mono tabular-nums">- {formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono tabular-nums">
                  {shippingTotal === 0 ? <strong className="text-emerald-700">FREE</strong> : formatINR(shippingTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated GST (included):</span>
                <span className="font-mono tabular-nums">{formatINR(Math.round(subtotal * 0.05))}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-base text-[#0F1B2D]">
                <span>Total Amount:</span>
                <span className="font-mono tabular-nums text-xl">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Safe 256-bit encrypted checkout with COD support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
