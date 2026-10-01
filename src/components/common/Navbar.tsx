import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Logo } from './Logo';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  Store,
  Shield,
  LogOut,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { parseNaturalLanguageSearch } from '../../services/geminiService';

export const Navbar: React.FC = () => {
  const { currentUser, switchRole, cart, wishlist, categories, addToast } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if query is natural language with price or attributes (e.g. "under 2000" or "brass")
    if (searchQuery.toLowerCase().includes('under') || searchQuery.toLowerCase().includes('cod') || searchQuery.split(' ').length > 2) {
      setIsAiSearching(true);
      try {
        const parsed = await parseNaturalLanguageSearch(searchQuery);
        setIsAiSearching(false);
        const params = new URLSearchParams();
        if (parsed.queryText) params.set('q', parsed.queryText);
        if (parsed.category) params.set('category', parsed.category);
        if (parsed.maxPrice) params.set('maxPrice', parsed.maxPrice.toString());
        if (parsed.codOnly) params.set('codOnly', 'true');
        addToast(`AI Filter Applied: ${parsed.cleanSearchTerm || searchQuery}${parsed.maxPrice ? ` (Under ₹${parsed.maxPrice})` : ''}`, 'info');
        navigate(`/products?${params.toString()}`);
      } catch {
        setIsAiSearching(false);
        navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    } else {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAiSuggestedSearch = (sample: string) => {
    setSearchQuery(sample);
    navigate(`/products?q=${encodeURIComponent(sample)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBF7F0]/95 backdrop-blur-md border-b border-[#0F1B2D]/10">
        {/* Top Announcement Bar */}
        <div className="bg-[#0F1B2D] text-[#FBF7F0] text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#F59E0B] font-semibold">Festive Craft Fair</span>
              <span className="hidden sm:inline text-slate-300">· 100% Verified Indian Artisans · Use code NAMASTE10 for 10% off</span>
            </div>

            {/* Quick Demo Role Persona Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 hidden md:inline">Current Persona:</span>
              <button
                onClick={() => setIsRoleModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-[#FBF7F0] px-2.5 py-0.5 rounded-full transition-colors font-medium border border-white/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
                <span className="capitalize">{currentUser.role}: {currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Category Trigger */}
          <div className="flex items-center gap-6">
            <Logo size="md" showTagline />

            {/* Category Dropdown */}
            <div className="relative hidden lg:block" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-[#0F1B2D] hover:text-[#FF6B4A] transition-colors py-2"
                aria-expanded={isCategoryMenuOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Handcrafted Collections
                  </div>
                  <div className="max-h-96 overflow-y-auto py-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-[#FBF7F0] text-sm text-[#0F1B2D] transition-colors group"
                      >
                        <span className="font-medium group-hover:text-[#FF6B4A] transition-colors">{cat.name}</span>
                        <span className="text-xs text-slate-400">{cat.productCount} items</span>
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100 bg-[#FBF7F0]/60">
                    <Link
                      to="/products"
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="text-xs font-semibold text-[#FF6B4A] hover:underline flex items-center justify-between"
                    >
                      <span>Explore all marketplace categories</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar with AI Assist */}
          <div className="flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search handlooms, brassware or try "kurti under 2000"...'
                  className="w-full bg-white text-[#0F1B2D] placeholder:text-slate-400 text-sm pl-11 pr-24 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />

                <button
                  type="submit"
                  disabled={isAiSearching}
                  className="absolute right-1.5 px-3 py-1.5 bg-[#0F1B2D] hover:bg-[#1D3557] text-[#FBF7F0] text-xs font-medium rounded-full transition-colors flex items-center gap-1.5"
                >
                  {isAiSearching ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  )}
                  <span>Search</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Actions (Seller Portal, Wishlist, Cart, User) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Seller CTA or Seller Dashboard button */}
            {currentUser.role === 'seller' ? (
              <Link
                to="/seller"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Dashboard</span>
              </Link>
            ) : currentUser.role === 'admin' ? (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-[#0F1B2D] hover:bg-[#1D3557] text-white px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Admin Governance</span>
              </Link>
            ) : (
              <Link
                to="/become-a-seller"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F1B2D] hover:text-[#FF6B4A] px-3 py-2 rounded-xl border border-slate-300 hover:border-[#FF6B4A] transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-[#FF6B4A]" />
                <span>Sell on Ecomma</span>
              </Link>
            )}

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#0F1B2D] hover:text-[#FF6B4A] transition-colors relative"
              aria-label={`Wishlist with ${wishlist.length} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF6B4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 text-[#0F1B2D] hover:text-[#F59E0B] transition-colors relative"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#F59E0B] text-[#0F1B2D] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-200/60 transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-label="User Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#0F1B2D] text-[#FBF7F0] flex items-center justify-center font-display font-bold text-sm">
                  {currentUser.name.charAt(0)}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-[#0F1B2D] truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 capitalize">
                      Role: {currentUser.role}
                    </div>
                  </div>

                  <div className="py-1 text-sm text-[#0F1B2D]">
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#FBF7F0] transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-slate-500" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#FBF7F0] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-500" />
                      <span>My Wishlist</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#FBF7F0] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>Profile & Addresses</span>
                    </Link>

                    {currentUser.role === 'seller' && (
                      <Link
                        to="/seller"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 bg-amber-50 text-amber-900 font-medium hover:bg-amber-100 transition-colors"
                      >
                        <Store className="w-4 h-4 text-amber-600" />
                        <span>Seller Portal</span>
                      </Link>
                    )}

                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 bg-slate-100 font-medium hover:bg-slate-200 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-[#0F1B2D]" />
                        <span>Admin Governance</span>
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsRoleModalOpen(true);
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-2 text-xs font-medium text-[#FF6B4A] hover:bg-[#FBF7F0]"
                    >
                      <span>Switch Demo Persona</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sarees, spices, pottery..."
              className="w-full bg-white text-sm pl-10 pr-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:border-[#F59E0B]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>
        </div>
      </header>

      {/* Role Switcher Demo Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display text-lg font-bold text-[#0F1B2D]">Select Demo Persona</h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4">
              Ecomma provides full dedicated experiences for Buyers, Sellers, and Platform Admins. Switch instantly to test workflows:
            </p>

            <div className="space-y-3">
              {/* Buyer Option */}
              <button
                onClick={() => {
                  switchRole('buyer');
                  setIsRoleModalOpen(false);
                  navigate('/');
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  currentUser.role === 'buyer'
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5 ring-2 ring-[#14B8A6]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-[#0F1B2D]">Shopper Persona (Aarav Sharma)</p>
                  <p className="text-xs text-slate-500">Browse catalogue, AI Q&A, buy with COD/UPI, live tracking</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-700">Buyer</span>
              </button>

              {/* Seller Option */}
              <button
                onClick={() => {
                  switchRole('seller');
                  setIsRoleModalOpen(false);
                  navigate('/seller');
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  currentUser.role === 'seller'
                    ? 'border-[#F59E0B] bg-[#F59E0B]/5 ring-2 ring-[#F59E0B]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-[#0F1B2D]">Artisan Seller (Kavita Silks)</p>
                  <p className="text-xs text-slate-500">AI listing creator, order dispatch workflow, payouts wallet</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded">Seller</span>
              </button>

              {/* Admin Option */}
              <button
                onClick={() => {
                  switchRole('admin');
                  setIsRoleModalOpen(false);
                  navigate('/admin');
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  currentUser.role === 'admin'
                    ? 'border-[#0F1B2D] bg-[#0F1B2D]/5 ring-2 ring-[#0F1B2D]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-[#0F1B2D]">Marketplace Admin (Vikram Sengupta)</p>
                  <p className="text-xs text-slate-500">GMV metrics, seller verification, order moderation, AI insights</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-900 text-white rounded">Admin</span>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
