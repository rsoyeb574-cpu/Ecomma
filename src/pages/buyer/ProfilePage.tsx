import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Address } from '../../types';
import {
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  Shield,
  Store
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser, addToast, switchRole } = useStore();

  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email] = useState(currentUser.email);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    name: currentUser.name,
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    phone: currentUser.phone,
    type: 'home'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, phone });
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.pincode) return;

    const fullAddr: Address = {
      id: `addr-${Date.now()}`,
      name: newAddr.name || currentUser.name,
      street: newAddr.street,
      city: newAddr.city || 'Bengaluru',
      state: newAddr.state || 'Karnataka',
      pincode: newAddr.pincode,
      phone: newAddr.phone || currentUser.phone,
      type: newAddr.type || 'home',
      isDefault: currentUser.addresses.length === 0
    };

    updateCurrentUser({
      addresses: [...currentUser.addresses, fullAddr]
    });

    setIsAddingAddress(false);
    setNewAddr({
      name: currentUser.name,
      street: '',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      phone: currentUser.phone,
      type: 'home'
    });
  };

  const handleDeleteAddress = (addrId: string) => {
    const filtered = currentUser.addresses.filter(a => a.id !== addrId);
    updateCurrentUser({ addresses: filtered });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-[#0F1B2D]/10 pb-4">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0F1B2D]">Account & Addresses</h1>
        <p className="text-xs text-slate-500 mt-1">Manage personal contact details and delivery addresses for fast checkout</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Profile Card */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-white border border-[#0F1B2D]/10 shadow-xs space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0F1B2D] text-white flex items-center justify-center font-display font-bold text-2xl">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#0F1B2D]">{currentUser.name}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                Role: {currentUser.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0F1B2D] hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Persona quick switch buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fast Role Switcher</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => switchRole('seller')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Store className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Seller Mode</span>
              </button>
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-[#0F1B2D]" />
                <span>Admin Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Address Book */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-[#0F1B2D] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF6B4A]" />
              <span>Saved Delivery Addresses</span>
            </h2>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B4A] hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Form */}
          {isAddingAddress && (
            <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-white border border-[#F59E0B] shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase">New Address Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Recipient Name</label>
                  <input
                    type="text"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Phone</label>
                  <input
                    type="tel"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600">Street & House Details</label>
                <input
                  type="text"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full text-xs p-2 border rounded-lg bg-slate-50"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">City</label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">State</label>
                  <input
                    type="text"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0F1B2D] text-white text-xs font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List of saved addresses */}
          <div className="space-y-3">
            {currentUser.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{addr.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{addr.street}</p>
                  <p className="text-slate-600">{addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong></p>
                  <p className="text-slate-500 font-mono">Phone: {addr.phone}</p>
                </div>

                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                  aria-label="Delete address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
