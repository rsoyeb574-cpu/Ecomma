import React from 'react';
import { Order } from '../../types';
import { formatINR } from '../../store/useStore';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 my-8 text-[#0F1B2D] animate-in zoom-in-95">
        {/* Modal Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-[#0F1B2D]">Tax Invoice</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              GST Compliant
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="pt-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">Ecomma Marketplace</h2>
              <p className="text-xs text-slate-500">Tax Invoice / Bill of Supply / Cash Memorandum</p>
              <p className="text-xs text-slate-500 mt-1">CIN: U72900KA2024PTC189201</p>
              <p className="text-xs text-slate-500">GSTIN: 29AABCE9921M1ZN</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-[#0F1B2D]">Invoice: {order.orderNumber}</p>
              <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-slate-500">Payment: <span className="font-semibold text-slate-800">{order.paymentMethod} ({order.paymentStatus})</span></p>
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <p className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Billed & Shipped To:</p>
              <p className="font-bold text-slate-900">{order.shippingAddress.name}</p>
              <p className="text-slate-600">{order.shippingAddress.street}</p>
              <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-slate-600 mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Fulfillment Sellers:</p>
              {order.subOrders.map(sub => (
                <div key={sub.id} className="mb-2">
                  <p className="font-bold text-slate-900">{sub.sellerName}</p>
                  <p className="text-slate-600">AWB: {sub.shipment?.awbNumber || 'Assigned on Dispatch'}</p>
                  <p className="text-slate-600">Courier: {sub.shipment?.courierName || 'Standard Express'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Item & Variant</th>
                  <th className="py-2.5 px-3">Seller</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.subOrders.flatMap(sub =>
                  sub.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900">{item.productTitle}</p>
                        {item.variantName && (
                          <p className="text-[11px] text-slate-500">Variant: {item.variantName}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.sellerName}</td>
                      <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">{formatINR(item.price)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums">
                        {formatINR(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-mono tabular-nums">{formatINR(order.totalAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span className="font-mono tabular-nums">- {formatINR(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Packaging:</span>
                <span className="font-mono tabular-nums">
                  {order.shippingTotal === 0 ? 'FREE' : formatINR(order.shippingTotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated IGST / CGST (incl.):</span>
                <span className="font-mono tabular-nums">{formatINR(Math.round(order.totalAmount * 0.05))}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-[#0F1B2D]">{formatINR(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#14B8A6]" />
              <span>Certified authentic Indian craftsmanship. Includes 7-day doorstep return guarantee.</span>
            </div>
            <p>Computer generated invoice, no physical signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
