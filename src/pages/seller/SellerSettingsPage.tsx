import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Building, CreditCard, MapPin, Store, CheckCircle2 } from 'lucide-react';

export const SellerSettingsPage: React.FC = () => {
  const { sellers, currentUser, updateSeller, addToast } = useStore();
  const seller = sellers.find(s => s.id === currentUser.sellerId) || sellers[0];

  const [storeName, setStoreName] = useState(seller.storeName);
  const [description, setDescription] = useState(seller.description);
  const [accountHolder, setAccountHolder] = useState(seller.bankDetails.accountHolder);
  const [accountNumber, setAccountNumber] = useState(seller.bankDetails.accountNumber);
  const [ifsc, setIfsc] = useState(seller.bankDetails.ifsc);
  const [bankName, setBankName] = useState(seller.bankDetails.bankName);
  const [upiId, setUpiId] = useState(seller.bankDetails.upiId || '');

  const [street, setStreet] = useState(seller.pickupAddress.street);
  const [city, setCity] = useState(seller.pickupAddress.city);
  const [state, setState] = useState(seller.pickupAddress.state);
  const [pincode, setPincode] = useState(seller.pickupAddress.pincode);
  const [phone, setPhone] = useState(seller.pickupAddress.phone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeller(seller.id, {
      storeName,
      description,
      bankDetails: {
        accountHolder,
        accountNumber,
        ifsc,
        bankName,
        upiId
      },
      pickupAddress: {
        ...seller.pickupAddress,
        street,
        city,
        state,
        pincode,
        phone
      }
    });
    addToast('Store settings updated successfully', 'success');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-[#0F1B2D]/10 pb-4">
        <h1 className="font-display font-bold text-2xl text-[#0F1B2D] dark:text-white">Store Settings & Bank Config</h1>
        <p className="text-xs text-slate-500 mt-1">Configure your artisan storefront, payout coordinates, and courier pickup location.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand identity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#FF6B4A]" />
            <span>Storefront Profile</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Store / Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Store Bio & Heritage Story</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Bank & UPI settlement details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#14B8A6]" />
            <span>Settlement Bank Coordinates</span>
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Account Holder Name</label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">UPI ID for instant settlement</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Courier Pickup Address */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-[#0F1B2D] dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#F59E0B]" />
            <span>Courier Dispatch Hub</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Street Address</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Pickup Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3 rounded-2xl bg-[#0F1B2D] hover:bg-[#1D3557] text-white text-xs font-bold shadow-md transition-colors"
        >
          Save Store Settings
        </button>
      </form>
    </div>
  );
};
