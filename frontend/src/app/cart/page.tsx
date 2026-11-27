'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-slate-900">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mt-1 mb-6">Looks like you have not added anything to your cart yet.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.productId} className="p-4 sm:p-6 flex items-center gap-4">
                      {/* Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover bg-slate-100 border shrink-0"
                      />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">In Stock</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg bg-slate-50">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.productId, item.quantity - 1);
                            } else {
                              removeItem(item.productId);
                            }
                          }}
                          className="p-1.5 text-slate-600 hover:text-slate-900 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal & Delete */}
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-900 text-sm">
                          ₹{item.subtotal.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-slate-400 hover:text-rose-500 transition mt-2 inline-flex"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/products"
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Continue Shopping →
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit space-y-4">
              <h2 className="font-bold text-slate-900 text-base">Order Summary</h2>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">₹{totalAmount().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST 18%)</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center font-bold text-slate-900 text-base">
                <span>Total Amount</span>
                <span>₹{totalAmount().toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => alert('Proceeding to checkout with atomic stock reservation...')}
                className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition shadow-sm"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-slate-400 text-center">
                Secure checkout powered by Razorpay. All transactions are encrypted.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
