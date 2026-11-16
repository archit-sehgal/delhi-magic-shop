import { Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getCategoryBySlug } from '../data/catalog';
import { formatINR, getDiscountPercent } from '../utils/store';
import { SmartImage } from './SmartImage';

export function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    navigate,
  } = useStore();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [quickViewProduct?.id]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const discount = getDiscountPercent(quickViewProduct.price, quickViewProduct.originalPrice);
  const category = getCategoryBySlug(quickViewProduct.category);
  const wishlisted = isWishlisted(quickViewProduct.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      onClick={() => setQuickViewProduct(null)}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-lg bg-white/90 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="aspect-[4/3] md:aspect-auto bg-[#F8FAFC]">
          <SmartImage
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
            <span>{category?.name || 'Magic Collection'}</span>
            <span aria-hidden="true">·</span>
            <span>{quickViewProduct.skillLevel}</span>
          </div>

          <h2 id="quick-view-title" className="text-2xl font-display font-bold text-[#121A25]">
            {quickViewProduct.name}
          </h2>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-mono font-bold tabular-nums text-[#121A25]">
              {formatINR(quickViewProduct.price)}
            </span>
            {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
              <>
                <span className="text-sm font-mono tabular-nums text-slate-400 line-through">
                  {formatINR(quickViewProduct.originalPrice)}
                </span>
                <span className="text-xs font-mono font-semibold text-[#DC2626]">{discount}% Off</span>
              </>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
            {quickViewProduct.description}
          </p>

          <div className="text-xs text-slate-500">
            Availability: <span className="text-emerald-700 font-semibold">{quickViewProduct.availability}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-mono tabular-nums text-[#121A25] font-semibold">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                aria-label="Increase quantity"
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(quickViewProduct.id, qty, true);
                setQuickViewProduct(null);
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(quickViewProduct.id)}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                wishlisted
                  ? 'bg-[#DC2626] border-[#DC2626] text-white'
                  : 'border-slate-300 text-slate-600 hover:text-[#DC2626]'
              }`}
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/product/${quickViewProduct.slug}`)}
            className="mt-auto pt-3 border-t border-slate-200 text-left text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer"
          >
            View Full Product Details &amp; Delivery Notes →
          </button>
        </div>
      </div>
    </div>
  );
}
