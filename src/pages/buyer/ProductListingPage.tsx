import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { ProductCard } from '../../components/buyer/ProductCard';
import {
  Filter,
  Grid3X3,
  List as ListIcon,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const { products, categories, sellers } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Read URL params
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialSeller = searchParams.get('seller') || 'All';
  const initialMaxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : 10000;
  const initialCodOnly = searchParams.get('codOnly') === 'true';
  const initialSort = searchParams.get('sort') || 'featured';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSeller, setSelectedSeller] = useState<string>(initialSeller);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [minRating, setMinRating] = useState<number>(0);
  const [codOnly, setCodOnly] = useState<boolean>(initialCodOnly);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Keep state synced with URL changes (e.g. from navbar search)
  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category')!);
    if (searchParams.get('maxPrice')) setMaxPrice(parseInt(searchParams.get('maxPrice')!, 10));
    if (searchParams.get('codOnly') === 'true') setCodOnly(true);
    if (searchParams.get('seller')) setSelectedSeller(searchParams.get('seller')!);
  }, [searchParams]);

  const searchQuery = searchParams.get('q') || '';

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchSeller = p.sellerName.toLowerCase().includes(q);
        const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchSeller && !matchTag) return false;
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Seller
      if (selectedSeller !== 'All' && p.sellerName !== selectedSeller) {
        return false;
      }

      // Price
      if (p.price > maxPrice) {
        return false;
      }

      // Rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // COD Only
      if (codOnly && !p.isCodAvailable) {
        return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low-to-high') return a.price - b.price;
      if (sortBy === 'price-high-to-low') return b.price - a.price;
      if (sortBy === 'top-rated') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.rating * b.reviewCount) - (a.rating * a.reviewCount); // Default: Popularity
    });
  }, [products, searchQuery, selectedCategory, selectedSeller, maxPrice, minRating, codOnly, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSeller('All');
    setMaxPrice(10000);
    setMinRating(0);
    setCodOnly(false);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSeller !== 'All' ||
    maxPrice < 10000 ||
    minRating > 0 ||
    codOnly ||
    inStockOnly ||
    Boolean(searchQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Sorting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'All Marketplace Products'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> authentic items
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-[#0F1B2D]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-[#0F1B2D] focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="featured">Popularity & Rating</option>
              <option value="price-low-to-high">Price: Low to High</option>
              <option value="price-high-to-low">Price: High to Low</option>
              <option value="top-rated">Highest Customer Rating</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white border border-slate-300 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-[#0F1B2D] text-white' : 'text-slate-500 hover:text-slate-900'}`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-[#0F1B2D] text-white' : 'text-slate-500 hover:text-slate-900'}`}
              aria-label="List view"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 font-medium">Applied:</span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              <span>{selectedCategory}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {selectedSeller !== 'All' && (
            <button
              onClick={() => setSelectedSeller('All')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              <span>Seller: {selectedSeller}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {maxPrice < 10000 && (
            <button
              onClick={() => setMaxPrice(10000)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              <span>Under {formatINR(maxPrice)}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {codOnly && (
            <button
              onClick={() => setCodOnly(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
            >
              <span>COD Only</span>
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#FF6B4A] hover:underline font-semibold ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6 p-6 rounded-2xl bg-white border border-[#0F1B2D]/10">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-display font-bold text-base text-[#0F1B2D] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F59E0B]" />
              <span>Filter Catalog</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#FF6B4A] font-semibold hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#0F1B2D] focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="All">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 uppercase tracking-wider">Max Price</span>
              <span className="font-mono font-bold text-[#0F1B2D]">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-[#F59E0B] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹500</span>
              <span>₹10,000+</span>
            </div>
          </div>

          {/* Sellers Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Artisan / Seller</label>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[#0F1B2D] focus:outline-none focus:border-[#F59E0B]"
            >
              <option value="All">All Verified Sellers</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.storeName}>
                  {s.storeName}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Minimum Rating</label>
            <div className="space-y-1.5 text-xs text-slate-700">
              {[4.8, 4.5, 4.0, 0].map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === rating}
                    onChange={() => setMinRating(rating)}
                    className="accent-[#F59E0B]"
                  />
                  <span>{rating === 0 ? 'All Ratings' : `${rating}★ & above`}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggles (COD & Stock) */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 font-medium">Cash on Delivery Available</span>
              <input
                type="checkbox"
                checked={codOnly}
                onChange={(e) => setCodOnly(e.target.checked)}
                className="w-4 h-4 accent-[#14B8A6] rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-700 font-medium">In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#0F1B2D] rounded"
              />
            </label>
          </div>
        </aside>

        {/* Product Cards Grid / List */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto text-2xl">
                🔍
              </div>
              <h3 className="font-display font-bold text-xl text-[#0F1B2D]">No matching craft items found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Try widening your price range, clearing specific filters, or searching for broader craft terms like "kurti", "brass", or "pepper".
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs md:hidden">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-display font-bold text-lg text-slate-900">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xs border rounded-lg p-2 mt-1"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Max Price */}
            <div>
              <div className="flex justify-between text-xs font-bold">
                <span>Max Price:</span>
                <span className="font-mono">{formatINR(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                className="w-full accent-[#F59E0B] mt-2"
              />
            </div>

            {/* Mobile COD Toggle */}
            <label className="flex items-center justify-between text-xs font-semibold">
              <span>Cash on Delivery Only</span>
              <input
                type="checkbox"
                checked={codOnly}
                onChange={(e) => setCodOnly(e.target.checked)}
                className="w-4 h-4 accent-[#14B8A6]"
              />
            </label>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2 text-xs font-semibold border rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-semibold bg-[#0F1B2D] text-white rounded-xl"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
