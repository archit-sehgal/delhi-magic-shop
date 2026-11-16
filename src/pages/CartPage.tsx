import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { SHIPPING_METHODS } from '../data/business';
import { getProductById } from '../data/catalog';
import { ShippingMethodId } from '../types/store';
import { usePageSeo } from '../utils/seo';
import { formatINR } from '../utils/store';

export function CartPage() {
  const {
    cart,
    cartTotals,
    shippingMethod,
    setShippingMethod,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  usePageSeo(
    'Shopping Cart – Delhi Magic Shop',
    'Review your selected magic props, update quantities, estimate India or international shipping, and proceed to checkout.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-white">
      <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

      <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">
        Shopping Cart ({cartTotals.itemCount})
      </h1>

      {cart.length === 0 ? (
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" aria-hidden="true" />
          <h2 className="text-xl font-display font-bold text-[#121A25]">Your cart is empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Browse our close-up, mentalism, card magic, and stage illusion collections to add props.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
            {cart.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="p-5 flex flex-col sm:flex-row gap-5">
                  <div className="w-full sm:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <SmartImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div>
                      <a
                        href={`/product/${product.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/product/${product.slug}`);
                        }}
                        className="text-base font-bold text-[#121A25] hover:text-[#DC2626]"
                      >
                        {product.name}
                      </a>
                      <div className="text-xs text-slate-500 mt-1">
                        {product.availability} · Skill: {product.skillLevel}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Decrease quantity for ${product.name}`}
                          className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-mono font-bold tabular-nums text-[#121A25]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Increase quantity for ${product.name}`}
                          className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-base font-mono font-bold tabular-nums text-[#121A25]">
                            {formatINR(product.price * item.quantity)}
                          </div>
                          <div className="text-[11px] font-mono tabular-nums text-slate-500">
                            {formatINR(product.price)} each
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${product.name}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#DC2626] hover:bg-slate-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-display font-bold text-[#121A25]">Order Summary</h2>

            <div className="space-y-2">
              <label htmlFor="cart-shipping-select" className="block text-xs font-semibold text-slate-700">
                Shipping Option
              </label>
              <select
                id="cart-shipping-select"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value as ShippingMethodId)}
                className="w-full h-11 px-3 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#121A25] focus:outline-none focus:border-[#DC2626]"
              >
                {SHIPPING_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.cost === null ? 'Quote' : m.cost === 0 ? 'Free' : formatINR(m.cost)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#121A25] font-semibold">
                  {formatINR(cartTotals.subtotal)}
                </span>
              </div>
              {cartTotals.totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium text-xs">
                  <span>Catalogue Savings</span>
                  <span className="font-mono tabular-nums">
                    −{formatINR(cartTotals.totalSavings)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-mono tabular-nums">
                  {cartTotals.shippingCost === null
                    ? 'Quoted on review'
                    : cartTotals.shippingCost === 0
                    ? 'Free'
                    : formatINR(cartTotals.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#121A25] pt-3 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-[#DC2626]">
                  {formatINR(cartTotals.totalEstimated)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full h-12 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="w-full h-10 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#121A25] cursor-pointer"
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
