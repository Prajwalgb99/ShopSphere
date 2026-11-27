'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCartStore } from '@/store/useCartStore';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Lock,
  X,
  Truck,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

interface ConfirmedOrder {
  orderId: string;
  items: Array<{ title: string; quantity: number; subtotal: number; imageUrl: string }>;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  placedAt: string;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCartStore();

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    phone: '+91 98765 43210',
    street: '124 Cyber City Blvd, Sector 5',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100',
    paymentMethod: 'razorpay',
  });

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate backend payment verification & stock reservation
    setTimeout(() => {
      const orderData: ConfirmedOrder = {
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}-SS`,
        items: items.map((i) => ({
          title: i.title,
          quantity: i.quantity,
          subtotal: i.subtotal,
          imageUrl: i.imageUrl,
        })),
        totalAmount: totalAmount(),
        shippingAddress: { ...formData },
        placedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setConfirmedOrder(orderData);
      clearCart();
      setIsProcessing(false);
      setIsCheckoutOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        {/* SUCCESS CONFIRMATION VIEW */}
        {confirmedOrder ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Payment Confirmed & Verified
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-3">
              Thank you for your order!
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Order ID: <strong className="text-slate-800 font-mono">{confirmedOrder.orderId}</strong>
            </p>

            <div className="my-6 border-t border-b py-4 text-left space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Items Summary
              </h3>
              <div className="divide-y divide-slate-100">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-9 h-9 rounded object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{item.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t flex justify-between items-center font-bold text-slate-900 text-sm">
                <span>Total Paid (Razorpay)</span>
                <span className="text-emerald-700">
                  ₹{confirmedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs text-slate-600 space-y-1 mb-6">
              <p className="font-semibold text-slate-800">Shipping To:</p>
              <p>{confirmedOrder.shippingAddress.fullName} ({confirmedOrder.shippingAddress.phone})</p>
              <p>{confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.postalCode}</p>
              <p className="text-emerald-600 font-medium pt-1">
                Estimated Delivery: Within 3–4 business days via Express Courier
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
              >
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setConfirmedOrder(null)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Back to Cart
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD CART VIEW */
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

            {items.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 max-w-lg mx-auto">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-slate-900">Your cart is empty</h2>
                <p className="text-sm text-slate-500 mt-1 mb-6">
                  Explore our catalogue and add items to experience the checkout flow.
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
                >
                  Browse Catalogue <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <div key={item.productId} className="p-4 sm:p-6 flex items-center gap-4">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-20 h-20 rounded-lg object-cover bg-slate-100 border shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 text-sm truncate">
                              {item.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                              ₹{item.price.toLocaleString('en-IN')} each
                            </p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">In Stock</p>
                          </div>

                          {/* Stepper */}
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

                          {/* Subtotal */}
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

                {/* Order Summary & Checkout Trigger */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit space-y-4">
                  <h2 className="font-bold text-slate-900 text-base">Order Summary</h2>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900">
                        ₹{totalAmount().toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-emerald-600 font-medium">FREE</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>GST (18% included)</span>
                      <span>₹{Math.round((totalAmount() * 0.18) / 1.18).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center font-bold text-slate-900 text-base">
                    <span>Total Amount</span>
                    <span>₹{totalAmount().toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Proceed to Checkout
                  </button>

                  <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>256-bit Encrypted Razorpay Checkout</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CHECKOUT & PAYMENT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => !isProcessing && setIsCheckoutOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-lg text-slate-900">Secure Order Checkout</h2>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Atomic inventory reservation & Razorpay payment gateway execution.
            </p>

            <form onSubmit={handleProcessPayment} className="space-y-4">
              {/* Shipping Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-500" /> Shipping Destination
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1 w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">Phone</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="mt-1 w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1 w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="mt-1 w-full px-2.5 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="pt-2 border-t space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Payment Method
                </h3>
                <div className="border border-emerald-500 bg-emerald-50/40 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      id="rzp"
                      name="paymentMethod"
                      checked
                      readOnly
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="rzp" className="text-xs font-bold text-slate-900 cursor-pointer">
                      Razorpay Checkout (UPI, Cards, NetBanking)
                    </label>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">
                    TEST MODE
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Cart Items ({items.length})</span>
                  <span>₹{totalAmount().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Express Delivery</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm pt-1 border-t">
                  <span>Payable Now</span>
                  <span className="text-emerald-700">₹{totalAmount().toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit Payment CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Razorpay Signature...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{totalAmount().toLocaleString('en-IN')} Now</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
