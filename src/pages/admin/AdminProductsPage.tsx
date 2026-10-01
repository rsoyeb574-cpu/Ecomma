import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import {
  Package,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Eye,
  ShieldCheck
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, updateProduct, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleFeature = (prodId: string, isTrending?: boolean) => {
    updateProduct(prodId, { isTrending: !isTrending });
    addToast('Product feature status updated', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Product Listing Moderation ({products.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit craft authenticity, inspect AI quality scores, and moderate catalog listings.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, seller, or craft..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item & Guild</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">AI Quality Score</th>
                <th className="py-3 px-3">Stock Units</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{prod.title}</p>
                      <p className="text-[11px] text-slate-500">By {prod.sellerName} · Rating: {prod.rating}★</p>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{prod.category}</td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(prod.price)}
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-xs text-[#14B8A6] bg-teal-500/10 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                      <span>{prod.aiScore || 94}/100</span>
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {prod.stock}
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleFeature(prod.id, prod.isTrending)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        prod.isTrending ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prod.isTrending ? 'Featured ★' : 'Feature'}
                    </button>

                    <Link
                      to={`/product/${prod.id}`}
                      className="inline-flex p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      title="Inspect Listing"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
