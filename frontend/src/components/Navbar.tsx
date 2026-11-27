'use client';

import Link from 'next/link';
import { ShoppingBag, ShoppingCart, User as UserIcon, Search } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 shrink-0">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
          <span>Shop<span className="text-emerald-600">Sphere</span></span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, brands and electronics..."
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/products" className="hover:text-emerald-600 transition">
            Catalogue
          </Link>

          {/* Cart with count badge */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 hover:text-emerald-600 transition"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {mounted && totalItems > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-emerald-600 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth State */}
          {mounted && user ? (
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-full flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                {user.firstName} ({user.role})
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
