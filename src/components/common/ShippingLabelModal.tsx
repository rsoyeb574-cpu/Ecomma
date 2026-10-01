import React from 'react';
import { SubOrder, Order } from '../../types';
import { formatINR } from '../../store/useStore';
import { X, Printer, Package, Truck } from 'lucide-react';

interface ShippingLabelModalProps {
  order: Order;
  subOrder: SubOrder;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({ order, subOrder, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const awb = subOrder.shipment?.awbNumber || `ECM-${Math.floor(100000 + Math.random() * 900000)}-IN`;
  const courier = subOrder.shipment?.courierName || 'Delhivery Express Surface';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 text-black animate-in zoom-in-95">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-800" />
            <h3 className="font-display font-bold text-lg text-slate-900">Courier Shipping Label</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label (4x6)</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4x6 Style Logistics Label */}
        <div className="mt-4 p-4 border-2 border-black rounded-lg space-y-4 font-mono text-xs">
          {/* Courier Banner & AWB */}
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-black" />
                <span className="font-bold text-sm uppercase tracking-wider">{courier}</span>
              </div>
              <p className="text-[10px] text-slate-600">Standard Surface Delivery · Pan-India Hub</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-2 py-0.5 font-bold text-xs uppercase border border-black ${
                order.paymentMethod === 'COD' ? 'bg-amber-300 text-black' : 'bg-black text-white'
              }`}>
                {order.paymentMethod === 'COD' ? `COD: ${formatINR(order.grandTotal)}` : 'PREPAID'}
              </span>
            </div>
          </div>

          {/* Barcode Mock Rendering */}
          <div className="text-center py-2 border-b border-black">
            <div className="inline-block px-4 py-2 bg-slate-50 border border-slate-200 rounded">
              {/* Scalable Barcode SVG */}
              <svg width="240" height="48" viewBox="0 0 240 48" className="mx-auto">
                <rect x="0" y="0" width="4" height="48" fill="#000" />
                <rect x="6" y="0" width="2" height="48" fill="#000" />
                <rect x="12" y="0" width="6" height="48" fill="#000" />
                <rect x="22" y="0" width="2" height="48" fill="#000" />
                <rect x="28" y="0" width="4" height="48" fill="#000" />
                <rect x="36" y="0" width="8" height="48" fill="#000" />
                <rect x="48" y="0" width="2" height="48" fill="#000" />
                <rect x="54" y="0" width="6" height="48" fill="#000" />
                <rect x="64" y="0" width="4" height="48" fill="#000" />
                <rect x="72" y="0" width="2" height="48" fill="#000" />
                <rect x="78" y="0" width="6" height="48" fill="#000" />
                <rect x="88" y="0" width="8" height="48" fill="#000" />
                <rect x="100" y="0" width="4" height="48" fill="#000" />
                <rect x="108" y="0" width="2" height="48" fill="#000" />
                <rect x="114" y="0" width="6" height="48" fill="#000" />
                <rect x="124" y="0" width="4" height="48" fill="#000" />
                <rect x="132" y="0" width="8" height="48" fill="#000" />
                <rect x="144" y="0" width="2" height="48" fill="#000" />
                <rect x="150" y="0" width="6" height="48" fill="#000" />
                <rect x="160" y="0" width="4" height="48" fill="#000" />
                <rect x="168" y="0" width="8" height="48" fill="#000" />
                <rect x="180" y="0" width="4" height="48" fill="#000" />
                <rect x="188" y="0" width="2" height="48" fill="#000" />
                <rect x="194" y="0" width="6" height="48" fill="#000" />
                <rect x="204" y="0" width="4" height="48" fill="#000" />
                <rect x="212" y="0" width="8" height="48" fill="#000" />
                <rect x="224" y="0" width="4" height="48" fill="#000" />
                <rect x="232" y="0" width="4" height="48" fill="#000" />
              </svg>
              <p className="font-bold text-xs tracking-widest mt-1">{awb}</p>
            </div>
          </div>

          {/* Delivery & Routing Info */}
          <div className="grid grid-cols-2 gap-3 border-b-2 border-black pb-3 text-[11px]">
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Deliver To:</p>
              <p className="font-bold text-slate-900 text-xs">{order.shippingAddress.name}</p>
              <p className="text-slate-700">{order.shippingAddress.street}</p>
              <p className="text-slate-700 font-bold">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p className="text-sm font-bold text-black mt-1">PIN: {order.shippingAddress.pincode}</p>
              <p className="text-slate-700">Ph: {order.shippingAddress.phone}</p>
            </div>

            <div className="border-l border-slate-300 pl-3">
              <p className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Shipped By (Return):</p>
              <p className="font-bold text-slate-900 text-xs">{subOrder.sellerName}</p>
              <p className="text-slate-700">Fulfillment Hub</p>
              <p className="text-slate-700">Order: #{order.orderNumber}</p>
              <p className="text-[10px] text-slate-500 mt-2">Routing: HUB-BLR-04 / DEL-EX</p>
            </div>
          </div>

          {/* Contents summary */}
          <div className="text-[10px] text-slate-600">
            <p className="font-bold uppercase text-slate-800">Package Contents ({subOrder.items.length} item):</p>
            {subOrder.items.map(item => (
              <p key={item.id} className="truncate">• {item.productTitle} (Qty: {item.quantity})</p>
            ))}
          </div>

          <div className="pt-2 text-center text-[9px] text-slate-500 border-t border-slate-300">
            Handcrafted with pride in India · Dispatched via Ecomma Marketplace Network
          </div>
        </div>
      </div>
    </div>
  );
};
