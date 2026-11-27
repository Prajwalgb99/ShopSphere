'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package, ArrowRight, AlertTriangle, CheckCircle2, Truck, Clock } from 'lucide-react';

interface CustomerOrder {
  id: string;
  placedAt: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
}

const INITIAL_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'ORD-9821-SS',
    placedAt: '27 Feb 2026, 10:30 AM',
    status: 'CONFIRMED',
    totalAmount: 18498,
    shippingAddress: '124 Cyber City Blvd, Bengaluru, Karnataka - 560100',
    items: [
      {
        title: 'Ergonomic Wireless Mechanical Keyboard',
        quantity: 1,
        price: 6499,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Active Noise Cancelling Wireless Headphones',
        quantity: 1,
        price: 11999,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  {
    id: 'ORD-9820-SS',
    placedAt: '26 Feb 2026, 04:15 PM',
    status: 'SHIPPED',
    totalAmount: 3299,
    shippingAddress: '124 Cyber City Blvd, Bengaluru, Karnataka - 560100',
    items: [
      {
        title: 'Precision Gaming Mouse with 26K DPI Sensor',
        quantity: 1,
        price: 3299,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>(INITIAL_CUSTOMER_ORDERS);
  const [cancelTarget, setCancelTarget] = useState<CustomerOrder | null>(null);

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === cancelTarget.id ? { ...o, status: 'CANCELLED' } : o))
    );
    setCancelTarget(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track shipments, inspect receipts, and manage active orders.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="font-semibold text-slate-900">No orders yet</h2>
            <p className="text-xs text-slate-500 mt-1">Your order history will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Order ID</span>
                      <span className="font-bold text-slate-900 font-mono">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Placed On</span>
                      <span className="font-medium text-slate-700">{order.placedAt}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Total</span>
                      <span className="font-bold text-slate-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'DELIVERED'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status === 'CONFIRMED' && <CheckCircle2 className="w-3 h-3" />}
                      {order.status === 'SHIPPED' && <Truck className="w-3 h-3" />}
                      {order.status === 'PENDING_PAYMENT' && <Clock className="w-3 h-3" />}
                      {order.status}
                    </span>

                    {(order.status === 'PENDING_PAYMENT' || order.status === 'CONFIRMED') && (
                      <button
                        onClick={() => setCancelTarget(order)}
                        className="px-3 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[11px] transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="p-5 divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border bg-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">{item.title}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900 text-xs">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 mt-3 text-[11px] text-slate-500">
                    <strong>Delivery Address:</strong> {order.shippingAddress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* YES / NO CANCEL ORDER CONFIRMATION */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Cancel Order?</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Are you sure you want to cancel order <strong className="font-mono">{cancelTarget.id}</strong>? Reserved inventory will be released immediately.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                No
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
