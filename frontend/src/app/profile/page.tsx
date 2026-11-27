'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/store/useAuthStore';
import { User, MapPin, Plus, Shield, Mail, Trash2 } from 'lucide-react';

interface SavedAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      street: '124 Cyber City Blvd',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560100',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: true,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        ...newAddr,
        country: 'India',
        isDefault: addresses.length === 0,
      },
    ]);
    setNewAddr({ street: '', city: '', state: '', postalCode: '', phone: '' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

        {/* Account Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
              {user ? user.firstName[0].toUpperCase() : 'G'}
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest Shopper'}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email || 'Not signed in'}
              </p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mt-2">
                <Shield className="w-3 h-3 text-emerald-600" />
                {user?.role || 'GUEST'}
              </span>
            </div>
          </div>

          {!user && (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition text-center"
            >
              Sign In to Sync Account
            </Link>
          )}
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Saved Shipping Addresses</h3>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-slate-50 p-4 rounded-xl border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="px-3 py-1.5 text-xs border rounded-lg bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs border rounded-lg text-slate-600 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="border rounded-xl p-4 text-xs space-y-1 bg-slate-50/50 relative">
                {addr.isDefault && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 mb-1">
                    Default
                  </span>
                )}
                <p className="font-semibold text-slate-900">{addr.street}</p>
                <p className="text-slate-600">
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-slate-500">{addr.country} • {addr.phone}</p>
                <button
                  onClick={() => setAddresses(addresses.filter((a) => a.id !== addr.id))}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                  title="Remove address"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
