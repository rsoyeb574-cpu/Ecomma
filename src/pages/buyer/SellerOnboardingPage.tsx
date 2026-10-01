import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { createCraftSvg } from '../../data/mockData';
import {
  Store,
  Building,
  CreditCard,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Upload
} from 'lucide-react';

export const SellerOnboardingPage: React.FC = () => {
  const { registerSeller, categories, currentUser } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Ethnic Wear & Handlooms');
  const [description, setDescription] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Bank & UPI
  const [accountHolder, setAccountHolder] = useState(currentUser.name);
  const [accountNumber, setAccountNumber] = useState('918237461928');
  const [ifsc, setIfsc] = useState('HDFC0001824');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [upiId, setUpiId] = useState('artisan@okhdfcbank');

  // Pickup Address
  const [street, setStreet] = useState('12 Shilpgram Crafts Enclave');
  const [city, setCity] = useState('Varanasi');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('221002');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98261 44521');

  // KYC Mock
  const [kycDocName, setKycDocName] = useState<string>('Aadhaar_PAN_Certificate_Verified.pdf');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !agreedToTerms) return;

    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const logo = createCraftSvg('#3A1C28', '#F59E0B', storeName.slice(0, 14), 'Seller');

    registerSeller({
      userId: currentUser.id,
      storeName,
      slug,
      logo,
      description: description || `Authentic ${category} handcrafted directly by registered Indian artisans with certified origin standards.`,
      gstNumber: gstNumber || undefined,
      bankDetails: {
        accountHolder,
        accountNumber,
        ifsc,
        bankName,
        upiId
      },
      pickupAddress: {
        id: `addr-${Date.now()}`,
        name: storeName,
        street,
        city,
        state,
        pincode,
        phone,
        type: 'work'
      },
      commissionRate: 0.08
    });

    navigate('/seller');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Intro */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Ecomma Verified Artisan Portal</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0F1B2D]">
          List. Sell. Deliver.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Open your storefront with zero setup fees, automated courier pickups, and guaranteed 24-hour payouts on delivery.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <div className={`p-2.5 rounded-xl border ${step === 1 ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
          1. Store & Category
        </div>
        <div className={`p-2.5 rounded-xl border ${step === 2 ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
          2. Bank & Pickup Hub
        </div>
        <div className={`p-2.5 rounded-xl border ${step === 3 ? 'border-[#0F1B2D] bg-[#0F1B2D] text-white' : 'bg-white border-slate-200 text-slate-700'}`}>
          3. KYC & Launch
        </div>
      </div>

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#0F1B2D]/10 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#FF6B4A]" />
              <span>Business Profile & Craft Domain</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Store / Brand Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Varanasi Zari Handlooms"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-[#F59E0B]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Craft Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Craftsmanship Story (Optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers about your weaving village, heritage techniques, or raw materials..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">GSTIN Number (Optional for &lt; ₹40 Lakhs turnover)</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. 09AAACK1924L1Z7"
                  className="w-full text-xs font-mono uppercase bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="button"
                disabled={!storeName.trim()}
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Continue to Banking & Pickup</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#14B8A6]" />
              <span>Direct Bank Settlement & Courier Pickup Address</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-900 uppercase">Bank / UPI for Payouts</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Account Holder Name</label>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full text-xs p-2 bg-white border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full text-xs font-mono p-2 bg-white border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">IFSC Code</label>
                    <input
                      type="text"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                      className="w-full text-xs font-mono uppercase p-2 bg-white border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">UPI ID (Instant Settlement)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full text-xs font-mono p-2 bg-white border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-900 uppercase">Courier Pickup Hub Address</p>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Workshop / Studio Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full text-xs p-2 bg-white border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2 bg-white border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full text-xs p-2 bg-white border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Pickup Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs font-mono p-2 bg-white border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-semibold hover:bg-slate-800"
              >
                Continue to KYC & Agreement
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
              <span>KYC Verification & Commercial Terms</span>
            </h2>

            {/* Mock KYC upload */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-800">Upload Government KYC Document</p>
              <p className="text-[11px] text-slate-500">Aadhaar Card, PAN Card, or Handloom Weaver Artisan Card</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-lg text-xs font-mono text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{kycDocName} (Pre-verified)</span>
              </div>
            </div>

            {/* Commercial Terms Summary */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2 text-slate-700">
              <p className="font-bold text-amber-950 uppercase">Seller Agreement Highlights</p>
              <ul className="space-y-1 text-slate-700">
                <li>• Flat 8% marketplace commission on completed orders (zero listing fees).</li>
                <li>• Automatic daily payout settlement into your registered bank/UPI within 24h of confirmed delivery.</li>
                <li>• Pre-negotiated courier rates with Delhivery & BlueDart with insured pickup from your workshop.</li>
                <li>• Free access to Gemini AI listing generator and SEO optimizer.</li>
              </ul>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 accent-[#0F1B2D] rounded mt-0.5"
                required
              />
              <span className="text-xs text-slate-700 leading-snug">
                I certify that our products are authentic, compliant with Indian handloom and artisan standards, and I agree to Ecomma's Seller Terms.
              </span>
            </label>

            <div className="pt-4 border-t flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Launch My Store</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
