import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

export const SellerProductsPage: React.FC = () => {
  const { products, currentUser, sellers, updateProduct, deleteProduct, addToast } = useStore();
  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);

  const sellerProducts = products.filter(p => p.sellerId === seller.id);

  const filtered = sellerProducts.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleStatus = (prodId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateProduct(prodId, { status: newStatus as any });
  };

  const handleSaveStock = (prodId: string) => {
    updateProduct(prodId, { stock: Math.max(0, stockInput) });
    setEditingStockId(null);
    addToast('Inventory count updated', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            My Product Listings ({sellerProducts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage active listings, adjust inventory stock levels, and review performance</p>
        </div>

        <Link
          to="/seller/add-product"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-semibold shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Add with AI</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-[#0F1B2D] text-white' : 'text-slate-600'}`}
          >
            All ({sellerProducts.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'active' ? 'bg-[#0F1B2D] text-white' : 'text-slate-600'}`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'inactive' ? 'bg-[#0F1B2D] text-white' : 'text-slate-600'}`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Item & Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock Units</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((prod) => {
                const isEditing = editingStockId === prod.id;

                return (
                  <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{prod.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono">ID: {prod.id} · Rating: {prod.rating}★</p>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{prod.category}</td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatINR(prod.price)}
                    </td>

                    <td className="py-3 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={stockInput}
                            onChange={(e) => setStockInput(parseInt(e.target.value, 10) || 0)}
                            className="w-16 text-xs p-1 border rounded bg-white font-mono"
                          />
                          <button
                            onClick={() => handleSaveStock(prod.id)}
                            className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingStockId(prod.id);
                            setStockInput(prod.stock);
                          }}
                          className="hover:underline flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200"
                          title="Click to edit stock"
                        >
                          <span>{prod.stock} units</span>
                          <Edit2 className="w-3 h-3 text-slate-400" />
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleStatus(prod.id, prod.status)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize transition-colors ${
                          prod.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {prod.status}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/product/${prod.id}`}
                        className="inline-flex p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        title="View live product"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
