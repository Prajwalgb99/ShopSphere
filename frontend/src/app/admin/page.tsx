'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  LayoutDashboard,
  Boxes,
  Package,
  ShoppingBag as OrdersIcon,
  Search,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  Filter,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { Product } from '@/types';

interface AdminOrder {
  id: string;
  customerName: string;
  email: string;
  totalAmount: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  itemsCount: number;
  createdAt: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-9821-SS',
    customerName: 'John Doe',
    email: 'john.doe@example.com',
    totalAmount: 18498,
    status: 'CONFIRMED',
    paymentStatus: 'SUCCESS',
    itemsCount: 2,
    createdAt: '2026-02-27 10:30 AM',
  },
  {
    id: 'ORD-9820-SS',
    customerName: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    totalAmount: 3299,
    status: 'SHIPPED',
    paymentStatus: 'SUCCESS',
    itemsCount: 1,
    createdAt: '2026-02-26 04:15 PM',
  },
  {
    id: 'ORD-9819-SS',
    customerName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    totalAmount: 45999,
    status: 'DELIVERED',
    paymentStatus: 'SUCCESS',
    itemsCount: 1,
    createdAt: '2026-02-25 01:20 PM',
  },
  {
    id: 'ORD-9818-SS',
    customerName: 'Priya Patel',
    email: 'priya.patel@example.com',
    totalAmount: 6499,
    status: 'PENDING_PAYMENT',
    paymentStatus: 'PENDING',
    itemsCount: 1,
    createdAt: '2026-02-24 11:45 AM',
  },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'products' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);

  // Inventory & Product Filters
  const [search, setSearch] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);

  // Modal States
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Add Product Form State
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    category: 'electronics',
    price: '',
    stock: '',
    imageUrl: '',
    description: '',
  });

  // KPI Calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.paymentStatus === 'SUCCESS')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const lowStockCount = products.filter((p) => p.availableStock <= 5).length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.availableStock, 0);

  // Filtered Products for Inventory
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = lowStockFilter ? p.availableStock <= 5 : true;
    return matchesSearch && matchesLowStock;
  });

  // Handle Restock Save
  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProduct) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === restockProduct.id
          ? { ...p, availableStock: Number(newStockValue) }
          : p
      )
    );
    setRestockProduct(null);
  };

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: newProductForm.title,
      slug: newProductForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newProductForm.description,
      price: Number(newProductForm.price),
      imageUrl: newProductForm.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      categoryId: `cat-${newProductForm.category}`,
      category: {
        id: `cat-${newProductForm.category}`,
        name: newProductForm.category.charAt(0).toUpperCase() + newProductForm.category.slice(1),
        slug: newProductForm.category,
      },
      availableStock: Number(newProductForm.stock) || 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setProducts([newProd, ...products]);
    setIsAddProductOpen(false);
    setNewProductForm({
      title: '',
      category: 'electronics',
      price: '',
      stock: '',
      imageUrl: '',
      description: '',
    });
  };

  // Handle Order Status Change
  const handleOrderStatusChange = (orderId: string, newStatus: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <span>Shop<span className="text-emerald-400">Sphere</span></span>
            </Link>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Admin Suite
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/products"
              className="text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              ← Back to Storefront
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <span className="font-semibold text-slate-300">admin@shopsphere.com</span>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-sm gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs rounded-t-lg transition border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview & KPIs
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs rounded-t-lg transition border-b-2 ${
              activeTab === 'inventory'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Inventory Management
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs rounded-t-lg transition border-b-2 ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Products Catalogue ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-xs rounded-t-lg transition border-b-2 ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <OrdersIcon className="w-4 h-4" />
            Orders & Fulfillment ({orders.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Total Platform Revenue</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last week
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  ₹
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Total Customer Orders</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalOrdersCount}</p>
                  <span className="text-[11px] text-slate-500 mt-1 block">Processed with ACID Transactions</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <OrdersIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Total Units in Stock</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalStockUnits}</p>
                  <span className="text-[11px] text-slate-500 mt-1 block">Across {products.length} products</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Boxes className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{lowStockCount}</p>
                  <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Needs immediate restock
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 mb-4">Latest Processed Orders</h3>
              <div className="divide-y divide-slate-100">
                {orders.slice(0, 4).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-slate-900">{o.id}</span>
                      <span className="text-xs text-slate-500 ml-2">({o.customerName})</span>
                      <div className="text-xs text-slate-400 mt-0.5">{o.createdAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹{o.totalAmount.toLocaleString('en-IN')}</div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                          o.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-800'
                            : o.status === 'DELIVERED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Controls */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product inventory by title or SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLowStockFilter(!lowStockFilter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    lowStockFilter
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {lowStockFilter ? 'Showing Low Stock Only' : 'Filter Low Stock (≤ 5)'}
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[11px] border-b">
                  <tr>
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-center">In Stock</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const isLow = p.availableStock <= 5 && p.availableStock > 0;
                    const isOut = p.availableStock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              SKU: {p.slug.slice(0, 18)}...
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                            {p.category?.name || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900">
                          {p.availableStock}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center justify-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Low Stock ({p.availableStock})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-slate-900">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setRestockProduct(p);
                              setNewStockValue(p.availableStock);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] transition shadow-sm"
                          >
                            <RefreshCw className="w-3 h-3" /> Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h3 className="font-bold text-base text-slate-900">Product Management</h3>
                <p className="text-xs text-slate-500">Create, edit and manage products in the active catalogue.</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="border rounded-xl p-4 flex gap-4 bg-slate-50/50 hover:bg-white transition shadow-sm">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-20 h-20 rounded-lg object-cover bg-slate-100 border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      {p.category?.name}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-xs truncate mt-0.5">{p.title}</h4>
                    <p className="font-bold text-slate-900 text-sm mt-1">₹{Number(p.price).toLocaleString('en-IN')}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t text-[11px]">
                      <span className="text-slate-500">Stock: <strong className="text-slate-800">{p.availableStock}</strong></span>
                      <button
                        onClick={() => {
                          setProducts(products.filter((item) => item.id !== p.id));
                        }}
                        className="text-rose-500 hover:text-rose-700 flex items-center gap-0.5"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Orders & Fulfillment Engine</h3>
                <p className="text-xs text-slate-500">Track and update delivery status across order lifecycles.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100/70 text-slate-700 uppercase font-semibold text-[11px] border-b">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4 text-center">Items</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Payment</th>
                    <th className="py-3 px-4 text-center">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{o.id}</span>
                        <span className="text-[10px] text-slate-400">{o.createdAt}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{o.customerName}</span>
                        <span className="text-[11px] text-slate-400">{o.email}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                        {o.itemsCount} unit(s)
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleOrderStatusChange(o.id, e.target.value as AdminOrder['status'])
                          }
                          className="py-1 px-2.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* RESTOCK MODAL */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setRestockProduct(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900">Update Stock Level</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{restockProduct.title}</p>

            <form onSubmit={handleSaveStock} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Available Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="mt-1 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 rounded-lg border text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-base text-slate-900">Add New Product</h3>
            <p className="text-xs text-slate-500 mt-1">Provide product info and starting inventory quantity.</p>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Pro Earbuds"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home-living">Home & Living</option>
                    <option value="fitness">Fitness & Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="4999"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="25"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash..."
                    value={newProductForm.imageUrl}
                    onChange={(e) => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key product highlights, specifications..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="mt-1 w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg border text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
