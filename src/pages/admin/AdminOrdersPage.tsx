import React, { useState } from 'react';
import { useStore, formatINR } from '../../store/useStore';
import { Order, SubOrder, OrderStatus } from '../../types';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  Truck,
  Package,
  Printer,
  RotateCcw,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ShieldCheck
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { orders, cancelOrder, fastForwardOrder, addToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.shippingAddress.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulateRefund = (orderNumber: string) => {
    addToast(`Automated payment refund processed for Order #${orderNumber} via Razorpay escrow reversal.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Marketplace Orders & Dispute Resolution ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global oversight of multi-vendor sub-orders, carrier shipments, and buyer refunds.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order # or Buyer..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            {/* Order Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 dark:text-slate-300">Buyer: <strong className="text-slate-900 dark:text-white">{order.buyerName}</strong></span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 dark:text-slate-300">City: {order.shippingAddress.city}</span>
                <span className="text-slate-400">·</span>
                <span className="font-mono font-bold text-[#0F1B2D] dark:text-white">{formatINR(order.grandTotal)}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                  order.overallStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {order.overallStatus.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 hover:bg-slate-50"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Sub-Orders Grid */}
            <div className="space-y-3">
              {order.subOrders.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">Seller: {sub.sellerName}</p>
                    <p className="text-slate-500">
                      Items: {sub.items.map(i => `${i.productTitle} (×${i.quantity})`).join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Carrier: {sub.shipment?.courierName || 'Unassigned'} · AWB: {sub.shipment?.awbNumber || 'Pending'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => fastForwardOrder(order.id, sub.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-[11px] font-semibold"
                    >
                      Advance Status
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Override Controls */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Payment: <strong className="text-slate-900 dark:text-white">{order.paymentMethod} ({order.paymentStatus})</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulateRefund(order.orderNumber)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-semibold"
                >
                  Process Escrow Refund
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
};
