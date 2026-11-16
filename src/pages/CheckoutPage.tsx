import { AlertCircle, CheckCircle2, Lock, MessageCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO, SERVICE_AREAS_INDIA, SHIPPING_METHODS } from '../data/business';
import { getProductById, PRODUCTS } from '../data/catalog';
import { CheckoutFormData, OrderRequest, PaymentMethodId, ShippingMethodId } from '../types/store';
import { usePageSeo } from '../utils/seo';
import {
  buildWhatsAppUrl,
  calculateCartTotals,
  formatINR,
  validateCheckoutForm,
} from '../utils/store';

export function CheckoutPage() {
  const {
    cart,
    shippingMethod,
    setShippingMethod,
    profile,
    submitOrderRequest,
    navigate,
  } = useStore();

  usePageSeo(
    'Checkout – Delhi Magic Shop',
    'Complete your delivery details and submit an order verification request to Delhi Magic Shop.'
  );

  const [form, setForm] = useState<CheckoutFormData>({
    fullName: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    addressLine1: profile.addressLine1 || '',
    addressLine2: '',
    city: profile.city || '',
    state: profile.state || 'Delhi (NCR)',
    postalCode: profile.postalCode || '',
    country: 'India',
    notes: '',
    shippingMethod,
    paymentMethod: 'upi',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedRequest, setSubmittedRequest] = useState<OrderRequest | null>(null);

  const totals = calculateCartTotals(cart, PRODUCTS, form.shippingMethod);

  const updateField = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const created = submitOrderRequest(form);
    setSubmittedRequest(created);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  if (submittedRequest) {
    const waText = `Hello Delhi Magic Shop, I submitted Order Request ${submittedRequest.requestId} for ${submittedRequest.items
      .map((i) => `${i.name} x${i.quantity}`)
      .join(', ')} (Est. ${formatINR(submittedRequest.totalEstimated)}). Preferred payment: ${submittedRequest.customer.paymentMethod.toUpperCase()}. Please share payment verification details.`;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-8 bg-white">
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700">
                Order Inquiry Recorded · {submittedRequest.status}
              </p>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
                Request Reference #{submittedRequest.requestId}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                No payment has been charged online. Our Karampura order desk verifies physical stock
                and shipping weight first, then sends your official UPI / Card payment link via email
                and WhatsApp.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
            {submittedRequest.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 text-slate-700">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-mono tabular-nums text-[#121A25] font-semibold">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-3 border-t border-slate-200 font-bold text-[#121A25]">
              <span>Estimated Total (incl. selected shipping)</span>
              <span className="font-mono tabular-nums text-[#DC2626]">
                {formatINR(submittedRequest.totalEstimated)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={buildWhatsAppUrl(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Confirm &amp; Pay via WhatsApp Desk ({BUSINESS_INFO.whatsappDisplay})
            </a>
            <button
              type="button"
              onClick={() => navigate('/account')}
              className="px-5 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-sm font-semibold text-[#121A25] cursor-pointer"
            >
              View in My Account
            </button>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-5 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-[#121A25] cursor-pointer"
            >
              Return to Shop
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-display font-bold text-[#121A25]">Checkout</h1>
        <p className="text-sm text-slate-500">Your cart is empty. Add items before checking out.</p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
        >
          Browse Magic Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-white">
      <Breadcrumbs items={[{ label: 'Shopping Cart', path: '/cart' }, { label: 'Checkout' }]} />

      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">Checkout</h1>
        <p className="text-sm text-slate-600 mt-1">
          Submit your delivery details below to request stock confirmation and official payment link
          (Ira Magic Impex / Delhi Magic Shop).
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Details */}
          <section className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-display font-bold text-[#121A25]">1. Customer Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="chk-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  id="chk-name"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.fullName && <p className="text-xs text-[#DC2626] mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="chk-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  id="chk-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.email && <p className="text-xs text-[#DC2626] mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="chk-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 98XXXXXXXX"
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.phone && <p className="text-xs text-[#DC2626] mt-1">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-display font-bold text-[#121A25]">2. Shipping Method</h2>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    form.shippingMethod === m.id
                      ? 'border-[#DC2626] bg-red-50/60'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={form.shippingMethod === m.id}
                    onChange={() => {
                      updateField('shippingMethod', m.id as ShippingMethodId);
                      setShippingMethod(m.id as ShippingMethodId);
                    }}
                    className="mt-1 accent-[#DC2626]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#121A25]">{m.label}</span>
                      <span className="text-xs font-mono font-semibold tabular-nums text-[#DC2626] shrink-0">
                        {m.cost === null ? 'Quoted' : m.cost === 0 ? 'Free' : formatINR(m.cost)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{m.timeline}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{m.note}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Shipping Address */}
          {form.shippingMethod !== 'pickup' && (
            <section className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-display font-bold text-[#121A25]">3. Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="chk-addr1" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    House / Flat / Street Address *
                  </label>
                  <input
                    id="chk-addr1"
                    type="text"
                    value={form.addressLine1}
                    onChange={(e) => updateField('addressLine1', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                  />
                  {errors.addressLine1 && (
                    <p className="text-xs text-[#DC2626] mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    City *
                  </label>
                  <input
                    id="chk-city"
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                  />
                  {errors.city && <p className="text-xs text-[#DC2626] mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="chk-state" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    State / Region *
                  </label>
                  <select
                    id="chk-state"
                    value={form.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className="w-full h-11 px-3 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                  >
                    {SERVICE_AREAS_INDIA.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                    <option value="International / Outside India">International / Outside India</option>
                  </select>
                  {errors.state && <p className="text-xs text-[#DC2626] mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="chk-pin" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    PIN / Postal Code *
                  </label>
                  <input
                    id="chk-pin"
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-[#DC2626] mt-1">{errors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="chk-country" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Country
                  </label>
                  <input
                    id="chk-country"
                    type="text"
                    value={form.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Payment Preference */}
          <section className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-display font-bold text-[#121A25]">
              4. Preferred Payment Method
            </h2>
            <p className="text-xs text-slate-600">
              In line with our payment security policy, sensitive card credentials are never entered
              or stored here. Select your preferred method to receive an official payment gateway
              link upon stock confirmation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)' },
                  { id: 'card', label: 'Credit / Debit Card Gateway' },
                  { id: 'netbanking', label: 'NetBanking / Bank Transfer' },
                  { id: 'desk', label: 'Pay via Store Order Desk' },
                ] as { id: PaymentMethodId; label: string }[]
              ).map((pm) => (
                <label
                  key={pm.id}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    form.paymentMethod === pm.id
                      ? 'border-[#DC2626] bg-red-50/60 text-[#121A25]'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={form.paymentMethod === pm.id}
                    onChange={() => updateField('paymentMethod', pm.id)}
                    className="accent-[#DC2626]"
                  />
                  {pm.label}
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Order Summary */}
        <aside className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-5 lg:sticky lg:top-28">
          <h2 className="text-xl font-display font-bold text-[#121A25]">Order Summary</h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => {
              const p = getProductById(item.productId);
              if (!p) return null;
              return (
                <div key={item.productId} className="flex items-center gap-3 text-xs">
                  <div className="w-14 h-11 rounded bg-white border border-slate-200 overflow-hidden shrink-0">
                    <SmartImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#121A25] font-semibold truncate">{p.name}</div>
                    <div className="text-slate-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-mono font-semibold tabular-nums text-[#121A25] shrink-0">
                    {formatINR(p.price * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          {totals.hasAirRestrictedItems && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Your cart includes battery-operated items restricted from international air parcel
                dispatch. Surface or domestic dispatch applies.
              </span>
            </div>
          )}

          <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-[#121A25] font-semibold">
                {formatINR(totals.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-mono tabular-nums">
                {totals.shippingCost === null
                  ? 'Quoted by weight'
                  : totals.shippingCost === 0
                  ? 'Free'
                  : formatINR(totals.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#121A25] pt-3 border-t border-slate-200">
              <span>Estimated Total</span>
              <span className="font-mono tabular-nums text-[#DC2626]">
                {formatINR(totals.totalEstimated)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Submit Order Request
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified order confirmation before gateway payment</span>
          </div>
        </aside>
      </form>
    </div>
  );
}
