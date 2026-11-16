import {
  AlertTriangle,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { getCategoryBySlug, getProductById, getProductBySlug, PRODUCTS } from '../data/catalog';
import { usePageSeo } from '../utils/seo';
import { buildWhatsAppUrl, formatINR, getDiscountPercent } from '../utils/store';

export function ProductDetailPage({ slug }: { slug: string }) {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    recentlyViewed,
    trackRecentlyViewed,
    navigate,
  } = useStore();

  const product = getProductBySlug(slug);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSelectedImageIdx(0);
    setQty(1);
    if (product) {
      trackRecentlyViewed(product.id);
    }
  }, [product, trackRecentlyViewed]);

  usePageSeo(
    product ? `${product.name} – Delhi Magic Shop` : 'Product Not Found – Delhi Magic Shop',
    product
      ? product.description.slice(0, 155)
      : 'Explore magic props and illusions at Delhi Magic Shop.',
    product
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.collections.includes(product.category))
    ).slice(0, 4);
  }, [product]);

  const recentProducts = useMemo(() => {
    if (!product) return [];
    return recentlyViewed
      .filter((id) => id !== product.id)
      .map((id) => getProductById(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .slice(0, 4);
  }, [product, recentlyViewed]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-3xl font-display font-bold text-[#121A25]">Product Not Found</h1>
        <p className="text-sm text-slate-500">
          The magic prop you requested could not be found in our catalogue.
        </p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
        >
          Browse Shop All
        </button>
      </div>
    );
  }

  const category = getCategoryBySlug(product.category);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const wishlisted = isWishlisted(product.id);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16 bg-white">
      <Breadcrumbs
        items={[
          { label: 'Shop All', path: '/shop' },
          ...(category ? [{ label: category.name, path: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      {/* Contiguous Product Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {(() => {
            const activeImg = gallery[selectedImageIdx] || product.image;
            const isPromo = activeImg.startsWith('/assets/aistudio/');
            return (
              <div
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 ${
                  isPromo ? 'bg-[#0E081D]' : 'bg-[#F8FAFC]'
                }`}
              >
                {isPromo && (
                  <img
                    src={activeImg}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-90 pointer-events-none select-none"
                  />
                )}
                <SmartImage
                  src={activeImg}
                  alt={product.name}
                  className={`relative z-10 w-full h-full ${isPromo ? 'object-contain' : 'object-cover'}`}
                />
              </div>
            );
          })()}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3">
              {gallery.map((img, i) => {
                const isThumbPromo = img.startsWith('/assets/aistudio/');
                return (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setSelectedImageIdx(i)}
                    aria-label={`View gallery image ${i + 1}`}
                    className={`w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      isThumbPromo ? 'bg-[#0E081D]' : 'bg-[#F8FAFC]'
                    } ${
                      selectedImageIdx === i
                        ? 'border-[#DC2626]'
                        : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <SmartImage
                      src={img}
                      alt={`${product.name} angle ${i + 1}`}
                      className={`w-full h-full ${isThumbPromo ? 'object-contain' : 'object-cover'}`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Purchase & Info Module */}
        <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{category?.name || 'Magic Prop'}</span>
              <span aria-hidden="true">·</span>
              <span>Skill Level: {product.skillLevel}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">{product.availability}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-[#121A25]">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3 pb-4 border-b border-slate-200">
            <span className="text-3xl font-mono font-bold tabular-nums text-[#121A25]">
              {formatINR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-base font-mono tabular-nums text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="text-xs font-mono font-semibold text-[#DC2626]">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">{product.description}</p>

          {product.specifications && product.specifications.length > 0 ? (
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Specifications
              </h2>
              <dl className="divide-y divide-slate-200 text-xs">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="py-2 flex justify-between gap-4">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="text-[#121A25] font-semibold text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <p className="text-xs text-slate-500 border-t border-slate-200 pt-4">
              Detailed dimensions and instructional format are confirmed with store support upon inquiry.
            </p>
          )}

          {product.airParcelRestricted && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Battery-operated item: Restricted from international air parcel shipping per carrier regulations. Contact us for surface or domestic options.
              </span>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white h-11">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-mono font-bold tabular-nums text-[#121A25]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-full flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addToCart(product.id, qty, true)}
                className="flex-1 h-11 px-6 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`h-11 w-11 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  wishlisted
                    ? 'bg-[#DC2626] border-[#DC2626] text-white'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-[#DC2626] hover:text-[#DC2626]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(product.id, qty, false);
                  navigate('/checkout');
                }}
                className="h-11 px-5 rounded-lg bg-[#121A25] hover:bg-slate-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>

              <a
                href={buildWhatsAppUrl(
                  `Hello Delhi Magic Shop, I have a question about "${product.name}" priced at ${formatINR(product.price)}.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-5 rounded-lg bg-white border border-slate-300 hover:border-[#16A34A] text-[#121A25] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#16A34A]" />
                Ask on WhatsApp
              </a>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="pt-4 border-t border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <Truck className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p>
                Dispatched within <strong className="text-[#121A25]">2 business days</strong> after confirmation.
                India courier / speed post: 3–7 days · International DHL / FedEx: 10–12 days air parcel.
              </p>
              <a
                href="/shipping-policy"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/shipping-policy');
                }}
                className="text-[#DC2626] font-semibold hover:underline inline-block"
              >
                Read full Shipping &amp; Return Policy →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
            Related Magic Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
