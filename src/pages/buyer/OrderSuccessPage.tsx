import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useStore, formatINR } from '../../store/useStore';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Store
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();
  const [showInvoice, setShowInvoice] = useState(false);

  const order = orders.find(o => o.id === id || o.orderNumber === id);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F1B2D', '#F59E0B', '#FF6B4A', '#14B8A6']
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">Order not found</h2>
        <Link to="/orders" className="text-xs font-semibold text-[#FF6B4A] underline">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Celebration Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#0F1B2D]/10 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#14B8A6] flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">
          Order Confirmed! Namaste, {order.buyerName}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your order <strong className="font-mono text-[#0F1B2D]">#{order.orderNumber}</strong> has been transmitted to our verified artisan partners for packaging and dispatch.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={`/orders/track/${order.id}`}
            className="px-6 py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#F59E0B]" />
            <span>Track Live Shipment</span>
          </Link>

          <button
            onClick={() => setShowInvoice(true)}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-[#0F1B2D] border border-slate-300 font-semibold text-xs transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>View Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Sub-Orders Breakdown */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-lg text-[#0F1B2D]">Fulfillment Breakdown ({order.subOrders.length} Shipments)</h2>

        <div className="space-y-4">
          {order.subOrders.map((sub, idx) => (
            <div key={sub.id} className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#FF6B4A]" />
                  <span className="font-bold text-sm text-[#0F1B2D]">Shipment #{idx + 1}: {sub.sellerName}</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 font-semibold capitalize">
                  Status: {sub.status}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sub.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.productTitle} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <p className="font-medium text-slate-900">{item.productTitle}</p>
                        <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold tabular-nums">{formatINR(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Destination & Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#0F1B2D]/10 space-y-2 text-xs">
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Shipping Destination</p>
          <p className="font-semibold text-slate-800">{order.shippingAddress.name}</p>
          <p className="text-slate-600">{order.shippingAddress.street}</p>
          <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p className="text-slate-600">Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#0F1B2D]/10 space-y-2 text-xs">
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Payment Summary</p>
          <div className="flex justify-between text-slate-600">
            <span>Payment Method:</span>
            <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Payment Status:</span>
            <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between text-slate-900 font-bold pt-2 border-t">
            <span>Grand Total:</span>
            <span className="font-mono tabular-nums text-sm">{formatINR(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Continue Shopping button */}
      <div className="text-center pt-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F1B2D] hover:text-[#FF6B4A]"
        >
          <span>Continue Shopping at Ecomma</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Printable Invoice Modal */}
      {showInvoice && <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />}
    </div>
  );
};
