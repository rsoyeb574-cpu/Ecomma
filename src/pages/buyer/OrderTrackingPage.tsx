import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { OrderStatus } from '../../types';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  FastForward,
  ArrowLeft,
  ShieldCheck,
  Building,
  Store
} from 'lucide-react';

const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'placed', label: 'Order Placed', desc: 'Order verified & payment escrow reserved' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Artisan workshop accepted order' },
  { key: 'packed', label: 'Packed & AWB', desc: 'Packed with security seal & courier booked' },
  { key: 'shipped', label: 'In Transit', desc: 'Dispatched from origin fulfillment hub' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent on route to doorstep' },
  { key: 'delivered', label: 'Delivered', desc: 'Verified delivery & payment settlement' }
];

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, fastForwardOrder } = useStore();

  const order = orders.find(o => o.id === id || o.orderNumber === id);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-[#0F1B2D]">Shipment not found</h2>
        <Link to="/orders" className="text-xs font-semibold text-[#FF6B4A] underline">
          Return to My Orders
        </Link>
      </div>
    );
  }

  // Focus on the first active sub-order or primary sub-order
  const primarySub = order.subOrders[0];
  const currentStatus = primarySub?.status || order.overallStatus;
  const currentStepIndex = STEPS.findIndex(s => s.key === currentStatus);

  const courierName = primarySub?.shipment?.courierName || 'Delhivery Express Surface';
  const awbNumber = primarySub?.shipment?.awbNumber || `ECM-882194-IN`;
  const estimatedDelivery = primarySub?.shipment?.estimatedDelivery || 'Tomorrow by 7:00 PM';
  const events = primarySub?.shipment?.events || [
    {
      timestamp: new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'ORDER PLACED',
      location: 'Online Platform',
      description: 'Customer completed order checkout.'
    }
  ];

  const handleFastForward = () => {
    if (primarySub) {
      fastForwardOrder(order.id, primarySub.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#0F1B2D]/10">
        <div>
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F1B2D] mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">
            Live Shipment Tracking: #{order.orderNumber}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Carrier: <strong className="text-slate-800">{courierName}</strong> · AWB: <span className="font-mono font-bold text-slate-800">{awbNumber}</span></p>
        </div>

        {/* Demo Fast-Forward Button */}
        {currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
          <button
            onClick={handleFastForward}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#0F1B2D] font-bold text-xs shadow-md transition-transform active:scale-95"
            title="Advance shipment status to demonstrate live workflow"
          >
            <FastForward className="w-4 h-4 fill-current" />
            <span>Fast-Forward Status (Demo)</span>
          </button>
        )}
      </div>

      {/* Hero Delivery Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B4A]">Estimated Arrival</span>
            <p className="text-2xl font-bold font-display text-[#0F1B2D]">{estimatedDelivery}</p>
            <p className="text-xs text-slate-500">
              Delivering to <strong className="text-slate-800">{order.shippingAddress.name}</strong>, {order.shippingAddress.city} - {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
              currentStatus === 'delivered'
                ? 'bg-emerald-100 text-emerald-800'
                : currentStatus === 'cancelled'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-900'
            }`}>
              Current: {currentStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Visual Progress Stepper Bar */}
        <div className="pt-4">
          <div className="relative">
            {/* Background Track Line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 -z-0"></div>
            {/* Active Filled Line */}
            <div
              className="absolute top-4 left-0 h-1 bg-[#0F1B2D] -z-0 transition-all duration-500"
              style={{ width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%` }}
            ></div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-6 relative z-10 text-center">
              {STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-[#0F1B2D] text-white ring-4 ring-white shadow-xs'
                          : 'bg-slate-200 text-slate-500 ring-4 ring-white'
                      } ${isCurrent ? 'ring-[#F59E0B] scale-110' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" /> : idx + 1}
                    </div>
                    <p className={`text-[11px] font-semibold mt-2 ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Map-Style Simulated Logistics Route & Live Events */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left: Simulated Visual Transit Map */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-[#0F1B2D] text-white relative overflow-hidden space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-display font-bold text-sm text-white">Express Corridor Transit Route</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-mono">
                GPS LIVE LINKED
              </span>
            </div>

            {/* Map Graphics SVG */}
            <div className="relative h-48 bg-slate-900/60 rounded-2xl border border-white/10 flex items-center justify-between px-6 overflow-hidden">
              {/* Subtle road dots */}
              <div className="absolute inset-x-8 top-1/2 h-0.5 border-t border-dashed border-white/20"></div>

              {/* Origin Hub */}
              <div className="relative z-10 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#F59E0B]">
                  <Store className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-300">Origin Hub</p>
                <p className="text-[9px] text-slate-400">{primarySub?.sellerName.split(' ')[0]}</p>
              </div>

              {/* Moving Courier Van Icon */}
              <div
                className="relative z-10 flex flex-col items-center transition-all duration-700"
                style={{
                  transform: `translateX(${currentStepIndex <= 2 ? '-40px' : currentStepIndex === 3 ? '0px' : '40px'})`
                }}
              >
                <div className="w-10 h-10 rounded-full bg-[#F59E0B] text-[#0F1B2D] flex items-center justify-center shadow-lg animate-pulse">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-bold text-[#F59E0B] mt-1">{courierName.split(' ')[0]}</p>
              </div>

              {/* Destination Hub */}
              <div className="relative z-10 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-[#14B8A6]">
                  <Building className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-300">Destination</p>
                <p className="text-[9px] text-slate-400">{order.shippingAddress.city}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 flex items-center justify-between pt-1">
              <span>Security Bagged & Barcoded</span>
              <span className="font-mono text-[11px] text-amber-300">OTP Handover on Delivery</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Status Events History */}
        <div className="md:col-span-6 p-6 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
          <h3 className="font-display font-bold text-base text-[#0F1B2D] flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>Tracking History & Checkpoints</span>
          </h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {events.slice().reverse().map((ev, i) => (
              <div key={i} className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#0F1B2D] ring-4 ring-white"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{ev.status}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{ev.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{ev.description}</p>
                <p className="text-[11px] text-slate-400 font-medium">{ev.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
