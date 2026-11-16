import { Check, Eye, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getCategoryBySlug } from '../data/catalog';
import { Product } from '../types/store';
import { formatINR, getDiscountPercent } from '../utils/store';
import { SmartImage } from './SmartImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct, navigate } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const category = getCategoryBySlug(product.category);

  const handleAdd = () => {
    addToCart(product.id, 1, true);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  const isPromoArtwork = product.image.startsWith('/assets/aistudio/');

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden border-b border-slate-100 ${
          isPromoArtwork ? 'bg-[#0E081D]' : 'bg-[#F8FAFC]'
        }`}
      >
        <a
          href={`/product/${product.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/product/${product.slug}`);
          }}
          className="relative block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
        >
          {isPromoArtwork && (
            <img
              src={product.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 brightness-90 pointer-events-none select-none"
            />
          )}
          <SmartImage
            src={product.image}
            alt={product.name}
            fallbackLabel={product.name}
            className={`relative z-10 w-full h-full transition-transform duration-300 group-hover:scale-[1.04] ${
              isPromoArtwork ? 'object-contain' : 'object-cover'
            }`}
          />
        </a>

        {/* Single clean discount tag */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-20 bg-[#DC2626] text-white text-[11px] font-mono tabular-nums font-semibold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-xs transition-colors cursor-pointer ${
              wishlisted
                ? 'bg-[#DC2626] border-[#DC2626] text-white'
                : 'bg-white/95 border-slate-200 text-slate-600 hover:border-[#DC2626] hover:text-[#DC2626]'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label={`Quick view ${product.name}`}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/95 border border-slate-200 text-slate-600 hover:border-[#121A25] hover:text-[#121A25] shadow-xs transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <span className="truncate">{category?.shortLabel || 'Magic'}</span>
          <span aria-hidden="true">·</span>
          <span className="shrink-0">{product.skillLevel}</span>
        </div>

        <h3 className="text-[15px] font-semibold leading-snug text-[#121A25] line-clamp-2 min-h-[2.625rem]">
          <a
            href={`/product/${product.slug}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product.slug}`);
            }}
            className="hover:text-[#DC2626] transition-colors focus:outline-none focus-visible:underline"
          >
            {product.name}
          </a>
        </h3>

        <div className="mt-auto pt-2 flex items-baseline justify-between gap-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-mono font-bold tabular-nums text-[#121A25]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs font-mono tabular-nums text-slate-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-emerald-700 whitespace-nowrap">
            {product.availability}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={`mt-2 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            justAdded
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-[#121A25] hover:bg-[#DC2626]'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
}
