import React, { useState } from 'react';
import { useStore, formatINR } from '../../store/useStore';
import { SellerProfile } from '../../types';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Percent,
  Search,
  FileText
} from 'lucide-react';

export const AdminSellersPage: React.FC = () => {
  const { sellers, updateSeller, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKycSeller, setSelectedKycSeller] = useState<SellerProfile | null>(null);

  const filtered = sellers.filter(s =>
    s.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pickupAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSuspend = (seller: SellerProfile) => {
    const newStatus = seller.status === 'active' ? 'suspended' : 'active';
    updateSeller(seller.id, { status: newStatus });
    addToast(`Seller "${seller.storeName}" has been ${newStatus}.`, 'info');
  };

  const handleUpdateCommission = (seller: SellerProfile, newRate: number) => {
    updateSeller(seller.id, { commissionRate: newRate });
    addToast(`Commission rate for ${seller.storeName} updated to ${(newRate * 100).toFixed(0)}%`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Sellers, Artisans & KYC Verification ({sellers.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review government artisan credentials, approve onboarding applications, and adjust commission structures.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search seller or location..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Artisan Guild / Store</th>
                <th className="py-3 px-3">Location & Pincode</th>
                <th className="py-3 px-3">Lifetime GMV</th>
                <th className="py-3 px-3">Commission Rate</th>
                <th className="py-3 px-3">KYC Status</th>
                <th className="py-3 px-3">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={s.logo} alt={s.storeName} className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{s.storeName}</p>
                      <p className="text-[11px] text-slate-400">{s.bankDetails.bankName} · Rating: {s.rating}★</p>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {s.pickupAddress.city}, {s.pickupAddress.state} ({s.pickupAddress.pincode})
                  </td>

                  <td className="py-3 px-3 font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {formatINR(s.totalSales)}
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={s.commissionRate}
                      onChange={(e) => handleUpdateCommission(s, parseFloat(e.target.value))}
                      className="text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg px-2 py-1 font-mono font-bold"
                    >
                      <option value={0.06}>6% (Preferred Guild)</option>
                      <option value={0.08}>8% (Standard Rate)</option>
                      <option value={0.10}>10% (High Support)</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => setSelectedKycSeller(s)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#14B8A6] hover:underline"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Verified KYC</span>
                    </button>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleSuspend(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        s.status === 'active'
                          ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {s.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KYC Document Viewer Modal */}
      {selectedKycSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900">Artisan KYC Verification</h3>
            <div className="p-4 rounded-xl bg-slate-50 border space-y-2 text-xs">
              <p><strong>Artisan Guild:</strong> {selectedKycSeller.storeName}</p>
              <p><strong>GST Number:</strong> {selectedKycSeller.gstNumber || 'Exempted (< ₹40L)'}</p>
              <p><strong>Bank Account:</strong> {selectedKycSeller.bankDetails.accountHolder} ({selectedKycSeller.bankDetails.accountNumber})</p>
              <p><strong>IFSC:</strong> {selectedKycSeller.bankDetails.ifsc} - {selectedKycSeller.bankDetails.bankName}</p>
              <p><strong>UPI ID:</strong> {selectedKycSeller.bankDetails.upiId}</p>
              <p><strong>Registered Address:</strong> {selectedKycSeller.pickupAddress.street}, {selectedKycSeller.pickupAddress.city} - {selectedKycSeller.pickupAddress.pincode}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedKycSeller(null)}
                className="px-4 py-2 bg-[#0F1B2D] text-white rounded-xl text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
