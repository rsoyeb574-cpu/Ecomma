import React, { useState } from 'react';
import { useStore, formatINR } from '../../store/useStore';
import { Coupon, Category } from '../../types';
import { Tag, Plus, CheckCircle2, Percent, Layers, Trash2 } from 'lucide-react';

export const AdminMarketingPage: React.FC = () => {
  const { coupons, categories, addToast } = useStore();

  const [couponList, setCouponList] = useState<Coupon[]>(coupons);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState<number>(15);
  const [newMinOrder, setNewMinOrder] = useState<number>(1499);
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coup: Coupon = {
      id: `coup-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountType: 'percentage',
      discountValue: newPercent,
      minOrderValue: newMinOrder,
      maxDiscount: 1000,
      validUntil: '2026-12-31',
      description: newDesc || `Flat ${newPercent}% off on orders above ${formatINR(newMinOrder)}`,
      isActive: true
    };

    setCouponList([coup, ...couponList]);
    setIsAddingCoupon(false);
    setNewCode('');
    setNewDesc('');
    addToast(`Coupon "${coup.code}" created and active across marketplace!`, 'success');
  };

  const handleToggleCoupon = (id: string) => {
    setCouponList(prev =>
      prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c)
    );
    addToast('Coupon status updated', 'info');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Promotions, Coupons & Categories
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage promotional campaigns, festive discount codes, and craft category navigation.
          </p>
        </div>

        <button
          onClick={() => setIsAddingCoupon(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#F59E0B]" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Add Coupon Modal/Drawer */}
      {isAddingCoupon && (
        <form onSubmit={handleCreateCoupon} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#F59E0B] shadow-sm space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Create Promotional Campaign Coupon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Coupon Code (Uppercase)</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. DIWALI30"
                className="w-full text-xs font-mono uppercase p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Discount %</label>
              <input
                type="number"
                min="5"
                max="50"
                value={newPercent}
                onChange={(e) => setNewPercent(parseInt(e.target.value, 10) || 10)}
                className="w-full text-xs font-mono p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Min. Order Value (INR)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={newMinOrder}
                onChange={(e) => setNewMinOrder(parseInt(e.target.value, 10) || 500)}
                className="w-full text-xs font-mono p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Campaign Description</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Special festive 15% discount for first 1,000 artisan orders."
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCoupon(false)}
              className="px-4 py-2 border rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold"
            >
              Activate Campaign
            </button>
          </div>
        </form>
      )}

      {/* Coupons Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#FF6B4A]" />
            <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Active Coupons</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">{couponList.length} Active Codes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-3">Discount</th>
                <th className="py-3 px-3">Min Order</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Validity</th>
                <th className="py-3 px-4 text-right">Status Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {couponList.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {c.code}
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : formatINR(c.discountValue)}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {formatINR(c.minOrderValue)}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{c.description}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{c.validUntil}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleCoupon(c.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories Catalog Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white">Taxonomy Structure ({categories.length} Categories)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white">{cat.name}</p>
              <p className="text-[11px] text-slate-500">{cat.description}</p>
              <p className="text-xs font-semibold text-[#14B8A6] pt-1">{cat.productCount} products live</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
