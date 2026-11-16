import { Heart, LogOut, Package, User } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { SERVICE_AREAS_INDIA } from '../data/business';
import { getProductById } from '../data/catalog';
import { usePageSeo } from '../utils/seo';
import { formatINR } from '../utils/store';

export function WishlistPage() {
  const { wishlist, navigate } = useStore();

  usePageSeo(
    'My Wishlist – Delhi Magic Shop',
    'Review your saved magic tricks, props, and illusions in your Delhi Magic Shop wishlist.'
  );

  const products = wishlist
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-white">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />

      <div className="flex items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">
            Saved Wishlist ({products.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of props you plan to add to your performance repertoire.
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-12 text-center space-y-4">
          <Heart className="w-11 h-11 text-slate-400 mx-auto" aria-hidden="true" />
          <h2 className="text-xl font-display font-bold text-[#121A25]">No saved items yet</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Click the heart icon on any product card to save it here for later comparison.
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AccountPage() {
  const { profile, signIn, signOut, updateProfile, orderRequests, enquiries, wishlist, navigate } =
    useStore();

  usePageSeo(
    'My Account – Delhi Magic Shop',
    'Manage your Delhi Magic Shop profile, saved delivery details, wishlist, and submitted order verification requests.'
  );

  const [loginName, setLoginName] = useState(profile.name || '');
  const [loginEmail, setLoginEmail] = useState(profile.email || '');
  const [loginPhone, setLoginPhone] = useState(profile.phone || '');
  const [loginError, setLoginError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setLoginError('Please enter your name and a valid email address.');
      return;
    }
    setLoginError('');
    signIn(loginName, loginEmail, loginPhone);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-white">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">My Account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Save your shipping profile and track submitted order requests and store enquiries.
          </p>
        </div>
        {profile.signedIn && (
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:border-[#DC2626] hover:text-[#DC2626] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        )}
      </div>

      {!profile.signedIn ? (
        <div className="max-w-lg bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#DC2626]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-[#121A25]">
                Customer Profile Access
              </h2>
              <p className="text-xs text-slate-500">
                Save your contact details locally for faster checkout and enquiry tracking.
              </p>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="acc-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                id="acc-name"
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
              />
            </div>
            <div>
              <label htmlFor="acc-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                id="acc-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
              />
            </div>
            <div>
              <label htmlFor="acc-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mobile / WhatsApp (Optional)
              </label>
              <input
                id="acc-phone"
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
              />
            </div>

            {loginError && <p className="text-xs text-[#DC2626]">{loginError}</p>}

            <button
              type="submit"
              className="w-full h-11 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
            >
              Continue to Account
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-display font-bold text-[#121A25]">Saved Shipping Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label htmlFor="prof-addr" className="block text-xs font-medium text-slate-600 mb-1">
                  Address Line
                </label>
                <input
                  id="prof-addr"
                  type="text"
                  value={profile.addressLine1}
                  onChange={(e) => updateProfile({ addressLine1: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-xs text-[#121A25]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="prof-city" className="block text-xs font-medium text-slate-600 mb-1">
                    City
                  </label>
                  <input
                    id="prof-city"
                    type="text"
                    value={profile.city}
                    onChange={(e) => updateProfile({ city: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-xs text-[#121A25]"
                  />
                </div>
                <div>
                  <label htmlFor="prof-pin" className="block text-xs font-medium text-slate-600 mb-1">
                    PIN Code
                  </label>
                  <input
                    id="prof-pin"
                    type="text"
                    value={profile.postalCode}
                    onChange={(e) => updateProfile({ postalCode: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-xs text-[#121A25]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="prof-state" className="block text-xs font-medium text-slate-600 mb-1">
                  State
                </label>
                <select
                  id="prof-state"
                  value={profile.state}
                  onChange={(e) => updateProfile({ state: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-white border border-slate-300 text-xs text-[#121A25]"
                >
                  {SERVICE_AREAS_INDIA.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Saved Wishlist Items: {wishlist.length}</span>
              <button
                type="button"
                onClick={() => navigate('/wishlist')}
                className="text-[#DC2626] font-semibold hover:underline cursor-pointer"
              >
                Open Wishlist →
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <section className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-display font-bold text-[#121A25] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#DC2626]" />
                Order Verification Requests ({orderRequests.length})
              </h2>
              {orderRequests.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No order requests submitted from this browser yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {orderRequests.map((req) => (
                    <div
                      key={req.requestId}
                      className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-mono font-bold text-[#121A25]">#{req.requestId}</span>
                        <span className="font-semibold text-amber-700">{req.status}</span>
                      </div>
                      <div className="text-slate-600">
                        {req.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </div>
                      <div className="font-mono font-semibold tabular-nums text-[#121A25]">
                        Estimated Total: {formatINR(req.totalEstimated)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-3">
              <h2 className="text-lg font-display font-bold text-[#121A25]">
                Contact Enquiries ({enquiries.length})
              </h2>
              {enquiries.length === 0 ? (
                <p className="text-xs text-slate-500">No store enquiries logged yet.</p>
              ) : (
                enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between text-[#121A25] font-semibold">
                      <span>{enq.subject}</span>
                      <span className="font-mono text-slate-400">{enq.id}</span>
                    </div>
                    <p className="text-slate-600">{enq.message}</p>
                  </div>
                ))
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
