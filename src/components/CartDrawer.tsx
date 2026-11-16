import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { getProductById } from '../data/catalog';
import { formatINR } from '../utils/store';
import { SmartImage } from './SmartImage';

export function CartDrawer() {
  const {
    cart,
    cartTotals,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    navigate,
  } = useStore();

  useEffect(() => {
    if (!cartDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartDrawerOpen, setCartDrawerOpen]);

  if (!cartDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      onClick={() => setCartDrawerOpen(false)}
    >
      <aside
        className="w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#DC2626]" aria-hidden="true" />
            <h2 className="text-xl font-display font-bold text-[#121A25]">
              Shopping Cart ({cartTotals.itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(false)}
            aria-label="Close shopping cart"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#121A25] hover:bg-slate-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" aria-hidden="true" />
              <p className="text-sm text-slate-600">Your cart is currently empty.</p>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/shop');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
              >
                Explore Magic Catalogue
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;
              return (
                <div
                  key={item.productId}
                  className="flex gap-3.5 pb-4 border-b border-slate-200 last:border-b-0"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <SmartImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={`/product/${product.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCartDrawerOpen(false);
                        navigate(`/product/${product.slug}`);
                      }}
                      className="text-sm font-semibold text-[#121A25] hover:text-[#DC2626] line-clamp-2"
                    >
                      {product.name}
                    </a>
                    <div className="text-xs font-mono tabular-nums text-slate-500 mt-1">
                      {formatINR(product.price)} × {item.quantity} ={' '}
                      <span className="text-[#121A25] font-bold">
                        {formatINR(product.price * item.quantity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="inline-flex items-center border border-slate-300 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-mono tabular-nums text-[#121A25] font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label={`Remove ${product.name}`}
                        className="text-xs text-slate-500 hover:text-[#DC2626] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-[#F8FAFC] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#121A25] font-bold">
                  {formatINR(cartTotals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-xs">
                <span>Estimated Shipping</span>
                <span className="font-mono tabular-nums">
                  {cartTotals.shippingCost === null
                    ? 'Quoted at review'
                    : cartTotals.shippingCost === 0
                    ? 'Free Pickup'
                    : formatINR(cartTotals.shippingCost)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-[#121A25] transition-colors whitespace-nowrap cursor-pointer"
              >
                View Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/checkout');
                }}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
