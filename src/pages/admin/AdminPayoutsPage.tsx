import React from 'react';
import { useStore, formatINR } from '../../store/useStore';
import { Wallet, CheckCircle2, XCircle, Clock, Building, CreditCard } from 'lucide-react';

export const AdminPayoutsPage: React.FC = () => {
  const { payouts, updatePayoutStatus, addToast } = useStore();

  const handleApprove = (payoutId: string, sellerName: string) => {
    updatePayoutStatus(payoutId, 'completed');
    addToast(`Payout for ${sellerName} approved. Automated IMPS transaction initiated.`, 'success');
  };

  const handleReject = (payoutId: string, sellerName: string) => {
    updatePayoutStatus(payoutId, 'rejected');
    addToast(`Payout request for ${sellerName} rejected. Funds returned to seller wallet.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Seller Payout Approvals & Settlements ({payouts.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorize seller wallet withdrawals and disburse payments directly via integrated banking gateways.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Artisan Seller</th>
                <th className="py-3 px-3">Amount Requested</th>
                <th className="py-3 px-3">Beneficiary Account / UPI</th>
                <th className="py-3 px-3">Requested Timestamp</th>
                <th className="py-3 px-3">Bank UTR Reference</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payouts.map((p) => {
                const isPending = p.status === 'requested';

                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{p.sellerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                      {formatINR(p.amount)}
                    </td>

                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {p.upiOrBank}
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500">
                      {new Date(p.requestedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {p.referenceNumber || (isPending ? 'Pending Approval' : 'N/A')}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        p.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleApprove(p.id, p.sellerName)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs"
                          >
                            Approve Payout
                          </button>
                          <button
                            onClick={() => handleReject(p.id, p.sellerName)}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Settled</span>
                      )}
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
