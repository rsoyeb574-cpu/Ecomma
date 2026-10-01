import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore, formatINR } from '../../store/useStore';
import { Address, Order, SubOrder } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Truck,
  MapPin,
  Lock,
  Smartphone,
  Building
} from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const CheckoutPage: React.FC = () => {
  const { cart, currentUser, appliedCoupon, discountAmount, placeOrder } = useStore();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Address State
  const defaultAddr = currentUser.addresses?.[0] || {
    id: `addr-${Date.now()}`,
    name: currentUser.name,
    street: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    phone: currentUser.phone || '+91 98112 34567',
    type: 'home'
  };

  const [address, setAddress] = useState<Address>(defaultAddr);

  // Delivery Method
  const [shippingOption, setShippingOption] = useState<'standard' | 'express'>('standard');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [onlineType, setOnlineType] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const sellerIds = Array.from(new Set(cart.map(i => i.sellerId)));
  const shippingCost = shippingOption === 'express' ? 99 : (subtotal >= 999 ? 0 : 50);
  const codFee = paymentMethod === 'COD' ? 29 : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + codFee);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Split items into sub-orders per seller
      const subOrders: SubOrder[] = sellerIds.map((sellerId, idx) => {
        const sellerItems = cart.filter(i => i.sellerId === sellerId);
        const sellerSubtotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const commission = sellerSubtotal * 0.08; // 8% commission
        const tax = sellerSubtotal * 0.05; // 5% GST
        const netPayout = sellerSubtotal - commission;

        return {
          id: `sub-${Date.now()}-${idx + 1}`,
          orderId: `ord-${Date.now()}`,
          sellerId,
          sellerName: sellerItems[0]?.sellerName || 'Artisan Seller',
          items: sellerItems,
          subtotal: sellerSubtotal,
          shippingFee: shippingCost / sellerIds.length,
          commission,
          tax,
          netPayout,
          status: 'placed',
          payoutStatus: 'pending'
        };
      });

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `ECM-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        buyerId: currentUser.id,
        buyerName: address.name,
        buyerEmail: currentUser.email,
        buyerPhone: address.phone,
        shippingAddress: address,
        subOrders,
        totalAmount: subtotal,
        discountAmount,
        shippingTotal: shippingCost + codFee,
        grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
        overallStatus: 'placed',
        couponCode: appliedCoupon?.code,
        createdAt: new Date().toISOString()
      };

      placeOrder(newOrder);
      setIsProcessing(false);
      navigate(`/order-success/${newOrder.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Step Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <Link to="/cart" className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F1B2D]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bag</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#14B8A6]">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="grid grid-cols-3 gap-2 pt-6 text-center text-xs">
          <div className={`p-2.5 rounded-xl border font-bold transition-all ${
            currentStep === 1 ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white shadow-xs' : 'border-slate-200 bg-white text-slate-700'
          }`}>
            1. Shipping Address
          </div>
          <div className={`p-2.5 rounded-xl border font-bold transition-all ${
            currentStep === 2 ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white shadow-xs' : 'border-slate-200 bg-white text-slate-700'
          }`}>
            2. Delivery & Mode
          </div>
          <div className={`p-2.5 rounded-xl border font-bold transition-all ${
            currentStep === 3 ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white shadow-xs' : 'border-slate-200 bg-white text-slate-700'
          }`}>
            3. Payment & Place
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main Step Form */}
        <div className="md:col-span-8 space-y-6">
          {/* STEP 1: Address */}
          {currentStep === 1 && (
            <div className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
              <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF6B4A]" />
                <span>Delivery Address (India)</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Street Address / House / Colony</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">State</label>
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Pincode (6 Digits)</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Speed */}
          {currentStep === 2 && (
            <div className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
              <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#14B8A6]" />
                <span>Select Shipping Partner & Speed</span>
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingOption('standard')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingOption === 'standard'
                      ? 'border-[#0F1B2D] bg-[#0F1B2D]/5 ring-2 ring-[#0F1B2D]/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingOption"
                      checked={shippingOption === 'standard'}
                      onChange={() => setShippingOption('standard')}
                      className="accent-[#0F1B2D]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F1B2D]">Standard Surface Express</p>
                      <p className="text-[11px] text-slate-500">Delivery in 3–5 business days via Delhivery / BlueDart</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {subtotal >= 999 ? 'FREE' : formatINR(50)}
                  </span>
                </label>

                <label
                  onClick={() => setShippingOption('express')}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingOption === 'express'
                      ? 'border-[#0F1B2D] bg-[#0F1B2D]/5 ring-2 ring-[#0F1B2D]/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingOption"
                      checked={shippingOption === 'express'}
                      onChange={() => setShippingOption('express')}
                      className="accent-[#0F1B2D]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#0F1B2D]">Priority Air Delivery (Faster)</p>
                      <p className="text-[11px] text-slate-500">Guaranteed 48h dispatch with insured courier handler</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">{formatINR(99)}</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method */}
          {currentStep === 3 && (
            <div className="p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-4">
              <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#F59E0B]" />
                <span>Select Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Online Payment Option */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-[#0F1B2D] bg-[#0F1B2D]/5 ring-2 ring-[#0F1B2D]/10'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('ONLINE')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'ONLINE'}
                        onChange={() => setPaymentMethod('ONLINE')}
                        className="accent-[#0F1B2D]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#0F1B2D]">Online Payment (Instant Escrow)</p>
                        <p className="text-[11px] text-slate-500">UPI, RuPay, Credit/Debit Cards, Net Banking</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      Zero Fees
                    </span>
                  </label>

                  {paymentMethod === 'ONLINE' && (
                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOnlineType('upi')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                            onlineType === 'upi' ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]' : 'bg-white text-slate-700'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>UPI QR / ID</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType('card')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                            onlineType === 'card' ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]' : 'bg-white text-slate-700'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType('netbanking')}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                            onlineType === 'netbanking' ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]' : 'bg-white text-slate-700'
                          }`}
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>NetBanking</span>
                        </button>
                      </div>

                      {onlineType === 'upi' && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Enter UPI Virtual Payment Address (VPA)</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@bank"
                            className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2"
                          />
                        </div>
                      )}

                      {onlineType === 'card' && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-600">Simulated Card Details</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#0F1B2D] bg-[#0F1B2D]/5 ring-2 ring-[#0F1B2D]/10'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="accent-[#0F1B2D]"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#0F1B2D]">Cash on Delivery (COD)</p>
                        <p className="text-[11px] text-slate-500">Pay cash or UPI directly to courier upon doorstep inspection</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-700 font-semibold">+₹29 Handling</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="px-8 py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order · {formatINR(grandTotal)}</span>
                      <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sticky Summary Box */}
        <div className="md:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-3">
            <h3 className="font-display font-bold text-sm text-[#0F1B2D]">Order Items ({cart.length})</h3>

            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <p className="font-medium text-slate-900 truncate">{item.productTitle}</p>
                    <p className="text-[11px] text-slate-500">Qty: {item.quantity} · {item.sellerName}</p>
                  </div>
                  <span className="font-mono font-semibold tabular-nums shrink-0">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono tabular-nums">{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span className="font-mono tabular-nums">- {formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'FREE' : formatINR(shippingCost)}
                </span>
              </div>
              {paymentMethod === 'COD' && (
                <div className="flex justify-between">
                  <span>COD Collection Fee:</span>
                  <span className="font-mono tabular-nums">{formatINR(29)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#0F1B2D]">
                <span>Grand Total:</span>
                <span className="font-mono tabular-nums text-base">{formatINR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
