import React, { useState } from 'react';
import { useStore, formatINR } from '../../store/useStore';
import {
  Wallet,
  ArrowUpRight,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  CreditCard,
  Percent,
  Plus
} from 'lucide-react';

export const SellerEarningsPage: React.FC = () => {
  const { sellers, currentUser, payouts, requestPayout, orders } = useStore();
  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(Math.min(25000, seller.walletBalance));

  const sellerPayouts = payouts.filter(p => p.sellerId === seller.id);

  // Sub-orders for commission calculation display
  const sellerSubOrders = orders.flatMap(o =>
    o.subOrders.filter(sub => sub.sellerId === seller.id)
  );

  const totalCommissionDeducted = sellerSubOrders.reduce((sum, s) => sum + s.commission, 0);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > seller.walletBalance) return;
    requestPayout(payoutAmount);
    setIsPayoutModalOpen(false);
  };

  const handleDownloadStatement = () => {
    // Generates simple CSV download
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Type,Reference,Amount,Status\n"
      + sellerPayouts.map(p => `${p.requestedAt.split('T')[0]},Payout Request,${p.referenceNumber || p.id},₹${p.amount},${p.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ecomma_Statement_${seller.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Earnings, Wallet & Payouts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transparent commission breakdown, COD remittance tracking, and instant NEFT/UPI bank transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadStatement}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Statement</span>
          </button>

          <button
            onClick={() => setIsPayoutModalOpen(true)}
            disabled={seller.walletBalance <= 0}
            className="px-5 py-2.5 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] disabled:opacity-40 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4 text-[#F59E0B]" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* Wallet Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Wallet Balance */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F1B2D] to-slate-900 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">Ready for Payout</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold tabular-nums">
            {formatINR(seller.walletBalance)}
          </p>
          <p className="text-[11px] text-slate-300">
            Linked to: <span className="font-semibold text-white">{seller.bankDetails.bankName} (...{seller.bankDetails.accountNumber.slice(-4)})</span>
          </p>
        </div>

        {/* Pending Escrow Balance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Transit & COD Escrow</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {formatINR(seller.pendingBalance)}
          </p>
          <p className="text-[11px] text-slate-500">
            Auto-released to wallet within 24h of courier delivery confirmation.
          </p>
        </div>

        {/* Total Lifetime Sales */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Lifetime GMV</span>
            <div className="w-8 h-8 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center">
              <Percent className="w-4 h-4 text-[#14B8A6]" />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-[#0F1B2D] dark:text-white tabular-nums">
            {formatINR(seller.totalSales)}
          </p>
          <p className="text-[11px] text-slate-500">
            Platform Commission Rate: <strong className="text-slate-800 dark:text-slate-200 font-mono">8%</strong> (Zero fixed fees)
          </p>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h2 className="font-display font-bold text-lg text-[#0F1B2D] dark:text-white">Payout History & Remittances</h2>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Destination Account</th>
                <th className="py-3 px-3">Bank Reference (UTR)</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sellerPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono">
                    {new Date(payout.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatINR(payout.amount)}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{payout.upiOrBank}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                    {payout.referenceNumber || 'Processing via IMPS...'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      payout.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : payout.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="font-display font-bold text-lg text-slate-900">Request Wallet Withdrawal</h3>
            <p className="text-xs text-slate-500">
              Funds will be disbursed instantly into your registered bank account via NEFT/IMPS.
            </p>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Withdrawal Amount (INR)</span>
                  <span className="text-slate-400 font-mono">Max: {formatINR(seller.walletBalance)}</span>
                </div>
                <input
                  type="number"
                  min="500"
                  max={seller.walletBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-sm font-mono font-bold p-3 border rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-800">Beneficiary Details:</p>
                <p className="text-slate-600">A/C Holder: {seller.bankDetails.accountHolder}</p>
                <p className="text-slate-600">Bank: {seller.bankDetails.bankName} ({seller.bankDetails.ifsc})</p>
                <p className="text-slate-600 font-mono">UPI: {seller.bankDetails.upiId}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold hover:bg-slate-800"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
