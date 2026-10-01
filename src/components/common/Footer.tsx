import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RotateCcw, CreditCard, Award, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F1B2D] text-[#FBF7F0] pt-16 pb-12 border-t border-slate-800">
      {/* Trust Markers Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">100% Genuine Crafts</p>
              <p className="text-xs text-slate-400">Direct from verified master artisans</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 text-[#14B8A6] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Cash on Delivery & UPI</p>
              <p className="text-xs text-slate-400">Safe, escrow-backed checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B4A]/10 text-[#FF6B4A] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">7-Day Easy Returns</p>
              <p className="text-xs text-slate-400">Doorstep return pickup support</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Live Tracking & AWB</p>
              <p className="text-xs text-slate-400">Pan-India express logistics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
        {/* Col 1 & 2: Brand Story */}
        <div className="md:col-span-2 space-y-4">
          <div className="brightness-150 contrast-125">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
            Ecomma connects discerning patrons with authentic Indian weavers, sculptors, and producers. Every listing is verified, every shipment is insured, and every artisan gets direct fair compensation.
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <Award className="w-4 h-4 text-[#F59E0B]" />
            <span>Empowering 600+ craft clusters across 18 Indian states.</span>
          </div>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">Handmade Collections</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/products?category=Ethnic%20Wear%20%26%20Handlooms" className="hover:text-white transition-colors">Chanderi & Handloom Sarees</Link></li>
            <li><Link to="/products?category=Brass%20%26%20Bell%20Metal%20Handicrafts" className="hover:text-white transition-colors">Bastar Dhokra Sculptures</Link></li>
            <li><Link to="/products?category=Ayurvedic%20%26%20Herbal%20Wellness" className="hover:text-white transition-colors">Ayurvedic Wellness & Oils</Link></li>
            <li><Link to="/products?category=Handcrafted%20Footwear%20%26%20Juttis" className="hover:text-white transition-colors">Jodhpur Leather Mojaris</Link></li>
            <li><Link to="/products?category=Contemporary%20Studio%20Pottery" className="hover:text-white transition-colors">Khurja Stoneware Pottery</Link></li>
          </ul>
        </div>

        {/* Col 4: For Sellers */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">Artisans & Sellers</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link to="/become-a-seller" className="hover:text-white font-medium text-white inline-flex items-center gap-1 group">
                <span>Start Selling on Ecomma</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </li>
            <li><Link to="/seller" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            <li><Link to="/seller/add-product" className="hover:text-white transition-colors">AI Listing Assistant</Link></li>
            <li><Link to="/seller/earnings" className="hover:text-white transition-colors">Commission & 24h Payouts</Link></li>
          </ul>
        </div>

        {/* Col 5: Support & Governance */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F59E0B]">Trust & Account</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders & Tracking</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Saved Items</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Saved Addresses (Pincode)</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Governance</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Payment Options & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Ecomma Marketplace India Ltd. All rights reserved. GST Registered.</p>

        {/* Payment badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 rounded bg-white/10 text-slate-300 font-mono text-[11px]">UPI</span>
          <span className="px-2 py-1 rounded bg-white/10 text-slate-300 font-mono text-[11px]">RuPay</span>
          <span className="px-2 py-1 rounded bg-white/10 text-slate-300 font-mono text-[11px]">Visa / Mastercard</span>
          <span className="px-2 py-1 rounded bg-white/10 text-slate-300 font-mono text-[11px]">Net Banking</span>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-medium text-[11px]">COD Available</span>
        </div>
      </div>
    </footer>
  );
};
