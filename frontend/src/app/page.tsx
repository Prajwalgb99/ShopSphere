import Link from "next/link";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>Shop<span className="text-emerald-600">Sphere</span></span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/products" className="hover:text-emerald-600 transition">Products</Link>
            <Link href="/categories" className="hover:text-emerald-600 transition">Categories</Link>
            <Link href="/cart" className="hover:text-emerald-600 transition">Cart (0)</Link>
            <Link href="/login" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" /> High-Performance E-Commerce Engine
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-6 sm:text-6xl">
          The Modern Shopping Platform Engineered for Scale
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          ShopSphere provides seamless shopping with instant catalog browsing, real-time inventory tracking, and resilient event-driven order processing.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            Explore Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Architecture Specs
          </Link>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="bg-slate-50 border-t py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
            Engineered with Production-Grade Architecture
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Microservices Ready</h3>
              <p className="text-slate-600 text-sm">
                Built modularly from day one and decomposed into decoupled domain services communicating via Apache Kafka and gRPC/REST.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Sub-millisecond Cache</h3>
              <p className="text-slate-600 text-sm">
                Redis-powered cache-aside pattern to reduce PostgreSQL database load and deliver lightning-fast product search & pagination.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Concurrency Protection</h3>
              <p className="text-slate-600 text-sm">
                Strict ACID transactional inventory reservations with idempotency keys and Razorpay webhook signature verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white py-8 text-center text-sm text-slate-500">
        <p>© 2026 ShopSphere. Developed with Next.js, Express, PostgreSQL, Redis, Kafka, and Kubernetes.</p>
      </footer>
    </main>
  );
}
