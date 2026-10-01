import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { Order, OrderStatus } from '../../types';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  Package,
  Truck,
  Printer,
  XCircle,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  Clock,
  Store
} from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { orders, cancelOrder, addToast, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Filter orders for buyer
  const buyerOrders = orders.filter(o => o.buyerId === currentUser.id || currentUser.role === 'admin');

  const filteredOrders = buyerOrders.filter(o => {
    if (activeTab === 'active') return ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery'].includes(o.overallStatus);
    if (activeTab === 'delivered') return o.overallStatus === 'delivered';
    if (activeTab === 'cancelled') return o.overallStatus === 'cancelled';
    return true;
  });

  const handleReturnRequest = (orderNumber: string) => {
    addToast(`Return request initiated for Order #${orderNumber}. A courier pickup will be scheduled within 24 hours.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-[#0F1B2D]/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">My Orders</h1>
          <p className="text-xs text-slate-500 mt-1">Track live shipments, download tax invoices, and manage returns</p>
        </div>

        {/* Tab filters (clean segmented controls) */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({buyerOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'active' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'delivered' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'cancelled' ? 'bg-[#0F1B2D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-[#0F1B2D]">No orders in this category</h3>
          <p className="text-xs text-slate-500">Discover handcrafted Indian pieces and place your first order.</p>
          <Link to="/products" className="inline-block px-5 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold">
            Browse Storefront
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const isDelivered = order.overallStatus === 'delivered';
            const isCancelled = order.overallStatus === 'cancelled';
            const canCancel = ['placed', 'confirmed'].includes(order.overallStatus);

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs overflow-hidden"
              >
                {/* Order Header Strip */}
                <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <p className="text-slate-500 text-[11px]">ORDER PLACED</p>
                      <p className="font-semibold text-slate-800">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px]">TOTAL AMOUNT</p>
                      <p className="font-mono font-bold text-[#0F1B2D]">{formatINR(order.grandTotal)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px]">SHIP TO</p>
                      <p className="font-medium text-slate-800">{order.shippingAddress.name} ({order.shippingAddress.city})</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px]">PAYMENT</p>
                      <p className="font-medium text-slate-800">{order.paymentMethod} ({order.paymentStatus})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">#{order.orderNumber}</span>
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="p-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Orders Content */}
                <div className="p-5 sm:p-6 space-y-6">
                  {order.subOrders.map((sub) => (
                    <div key={sub.id} className="space-y-4">
                      {/* Sub-Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-[#FF6B4A]" />
                          <span className="font-bold text-xs text-[#0F1B2D]">Artisan: {sub.sellerName}</span>
                          {sub.shipment && (
                            <span className="text-[11px] text-slate-500 font-mono">
                              (AWB: {sub.shipment.awbNumber})
                            </span>
                          )}
                        </div>

                        {/* Status Chip */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                            sub.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}>
                            {sub.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {sub.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Link to={`/product/${item.productId}`} className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img src={item.image} alt={item.productTitle} className="w-full h-full object-cover" />
                              </Link>
                              <div>
                                <Link to={`/product/${item.productId}`}>
                                  <h4 className="text-xs sm:text-sm font-semibold text-[#0F1B2D] hover:text-[#FF6B4A] transition-colors">
                                    {item.productTitle}
                                  </h4>
                                </Link>
                                {item.variantName && (
                                  <p className="text-[11px] text-slate-500">Variant: {item.variantName}</p>
                                )}
                                <p className="text-xs font-mono font-medium text-slate-700 mt-0.5">
                                  {formatINR(item.price)} × {item.quantity}
                                </p>
                              </div>
                            </div>

                            <span className="font-mono font-bold text-xs sm:text-sm text-[#0F1B2D] tabular-nums">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Actions Footer Strip */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/orders/track/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-semibold shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>Live Tracking</span>
                      </Link>

                      {isDelivered && (
                        <button
                          onClick={() => handleReturnRequest(order.orderNumber)}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Request Return (7-Day SLA)</span>
                        </button>
                      )}
                    </div>

                    {canCancel && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
};
