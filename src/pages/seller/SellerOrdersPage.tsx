import React, { useState } from 'react';
import { useStore, formatINR } from '../../store/useStore';
import { Order, SubOrder } from '../../types';
import { ShippingLabelModal } from '../../components/common/ShippingLabelModal';
import {
  Truck,
  Package,
  Printer,
  CheckCircle2,
  Clock,
  FastForward,
  AlertCircle,
  Banknote,
  Search,
  Filter
} from 'lucide-react';

export const SellerOrdersPage: React.FC = () => {
  const { orders, currentUser, sellers, fastForwardOrder, addToast } = useStore();
  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [selectedLabel, setSelectedLabel] = useState<{ order: Order; subOrder: SubOrder } | null>(null);

  // Extract all sub-orders belonging to this seller
  const sellerOrders = orders.flatMap(order => {
    const sub = order.subOrders.find(s => s.sellerId === seller.id);
    if (!sub) return [];
    return [{ order, subOrder: sub }];
  });

  const filtered = sellerOrders.filter(({ subOrder }) => {
    if (activeTab === 'pending') return ['placed', 'confirmed', 'packed'].includes(subOrder.status);
    if (activeTab === 'shipped') return ['shipped', 'out_for_delivery'].includes(subOrder.status);
    if (activeTab === 'delivered') return subOrder.status === 'delivered';
    return true;
  });

  const handleAdvanceStatus = (orderId: string, subOrderId: string) => {
    fastForwardOrder(orderId, subOrderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">
            Orders & Courier Dispatch ({sellerOrders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept orders, generate barcoded shipping labels, and track courier pickups & COD collection.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'all' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            All Orders ({sellerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'pending' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            Pending Dispatch
          </button>
          <button
            onClick={() => setActiveTab('shipped')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'shipped' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            In Transit
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-lg ${activeTab === 'delivered' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600'}`}
          >
            Delivered
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 space-y-3">
          <Package className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-200">No orders found in this status</h3>
          <p className="text-xs text-slate-500">New customer orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ order, subOrder }) => {
            const isDelivered = subOrder.status === 'delivered';
            const awb = subOrder.shipment?.awbNumber || 'Generating upon pack...';
            const courier = subOrder.shipment?.courierName || 'Delhivery Express Surface';

            return (
              <div
                key={subOrder.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">#{order.orderNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 dark:text-slate-300">Customer: <strong className="text-slate-900 dark:text-white">{order.shippingAddress.name}</strong></span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 dark:text-slate-300">Destination: {order.shippingAddress.city} ({order.shippingAddress.pincode})</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full font-bold capitalize text-[11px] ${
                      isDelivered
                        ? 'bg-emerald-100 text-emerald-800'
                        : subOrder.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {subOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Line Items & Logistics Info */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7 space-y-3">
                    {subOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.productTitle} className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                        <div>
                          <p className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">{item.productTitle}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity} · {item.variantName || 'Standard'}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Commercials & Courier Info */}
                  <div className="md:col-span-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(subOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Platform Commission (8%):</span>
                      <span className="font-mono text-rose-600">- {formatINR(subOrder.commission)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>Net Seller Payout:</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-400">{formatINR(subOrder.netPayout)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] flex justify-between">
                      <span className="text-slate-500">Courier / AWB:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{awb}</span>
                    </div>
                    <div className="text-[11px] flex justify-between">
                      <span className="text-slate-500">Payment Mode:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {order.paymentMethod} ({order.paymentMethod === 'COD' ? 'Remittance upon delivery' : 'Escrow Secured'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller Actions Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Print Label Button */}
                    <button
                      onClick={() => setSelectedLabel({ order, subOrder })}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-white font-semibold flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print Shipping Label (AWB)</span>
                    </button>
                  </div>

                  {/* Advance Status Demo Button */}
                  {!isDelivered && subOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, subOrder.id)}
                      className="px-4 py-2 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <FastForward className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>
                        {subOrder.status === 'placed' && 'Accept & Pack Order'}
                        {subOrder.status === 'confirmed' && 'Mark as Packed (Generate AWB)'}
                        {subOrder.status === 'packed' && 'Dispatch with Courier'}
                        {subOrder.status === 'shipped' && 'Mark Out for Delivery'}
                        {subOrder.status === 'out_for_delivery' && 'Confirm Doorstep Delivery'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shipping Label Modal */}
      {selectedLabel && (
        <ShippingLabelModal
          order={selectedLabel.order}
          subOrder={selectedLabel.subOrder}
          onClose={() => setSelectedLabel(null)}
        />
      )}
    </div>
  );
};
