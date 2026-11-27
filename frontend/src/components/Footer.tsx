import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 ShopSphere E-Commerce. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-slate-700">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-700">Terms of Service</Link>
          <Link href="/architecture" className="hover:text-slate-700">Architecture Spec</Link>
        </div>
      </div>
    </footer>
  );
}
