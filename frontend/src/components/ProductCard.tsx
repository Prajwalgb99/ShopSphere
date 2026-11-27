'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      availableStock: product.availableStock,
      isAvailable: product.availableStock > 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        {product.availableStock <= 0 ? (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-rose-500 text-white rounded">
            Out of Stock
          </span>
        ) : product.availableStock < 10 ? (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-amber-500 text-white rounded">
            Only {product.availableStock} left
          </span>
        ) : null}
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <h3 className="font-semibold text-slate-900 text-sm mt-1 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-slate-500 text-xs mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Price</span>
            <span className="font-bold text-slate-900 text-lg">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.availableStock <= 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition ${
              added
                ? 'bg-emerald-700 text-white'
                : product.availableStock <= 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
