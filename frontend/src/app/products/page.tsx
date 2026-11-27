'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { SlidersHorizontal, Search } from 'lucide-react';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Ergonomic Wireless Mechanical Keyboard',
    slug: 'ergonomic-wireless-mechanical-keyboard',
    description: 'Gateron brown switches, per-key RGB backlighting, Bluetooth 5.2 and multi-device connection.',
    price: 6499,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    categoryId: 'c1',
    category: { id: 'c1', name: 'Electronics', slug: 'electronics' },
    availableStock: 45,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p2',
    title: 'Precision Gaming Mouse with 26K DPI Sensor',
    slug: 'precision-gaming-mouse-26k-dpi',
    description: 'Ultra-lightweight 58g chassis, optical micro-switches, and 8000Hz polling rate.',
    price: 3299,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    categoryId: 'c1',
    category: { id: 'c1', name: 'Electronics', slug: 'electronics' },
    availableStock: 80,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p3',
    title: 'Active Noise Cancelling Wireless Headphones',
    slug: 'active-noise-cancelling-wireless-headphones',
    description: 'Hybrid 4-mic ANC, 40-hour battery life, high-res audio codec support and memory foam earcups.',
    price: 11999,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    categoryId: 'c1',
    category: { id: 'c1', name: 'Electronics', slug: 'electronics' },
    availableStock: 18,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p4',
    title: '4K Ultra-Wide IPS Curved Monitor 34-inch',
    slug: '4k-ultrawide-ips-curved-monitor-34',
    description: '144Hz refresh rate, USB-C 90W power delivery, HDR600 and 98% DCI-P3 color gamut.',
    price: 45999,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    categoryId: 'c1',
    category: { id: 'c1', name: 'Electronics', slug: 'electronics' },
    availableStock: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p5',
    title: 'Minimalist Water-Resistant Commuter Backpack',
    slug: 'minimalist-water-resistant-commuter-backpack',
    description: 'Dedicated 16-inch laptop compartment, hidden security pockets, and magnetic quick-access buckles.',
    price: 4299,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    categoryId: 'c2',
    category: { id: 'c2', name: 'Fashion', slug: 'fashion' },
    availableStock: 25,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'p6',
    title: 'Smart LED Desk Lamp with Wireless Charging Base',
    slug: 'smart-led-desk-lamp-wireless-charging',
    description: 'Adjustable color temperatures (2700K-6500K), auto-dimming ambient sensor, and Qi fast charger.',
    price: 2899,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    categoryId: 'c3',
    category: { id: 'c3', name: 'Home & Living', slug: 'home-living' },
    availableStock: 30,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filtered = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'all' || product.category?.slug === selectedCategory;
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Product Catalogue</h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore high-performance gear with real-time stock availability.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home-living">Home & Living</option>
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-1.5 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-semibold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
