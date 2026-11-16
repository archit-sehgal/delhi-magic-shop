import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import {
  ABOUT_COPY,
  BUSINESS_INFO,
  POLICY_CONTENT,
  SERVICE_AREAS_INDIA,
  SERVICE_AREAS_INTERNATIONAL,
  TESTIMONIALS,
} from '../data/business';
import { IMAGES } from '../data/catalog';
import { usePageSeo } from '../utils/seo';
import { buildWhatsAppUrl, validateEnquiryForm } from '../utils/store';

export function AboutUsPage() {
  const { navigate } = useStore();
  usePageSeo(
    'About Us – Delhi Magic Shop (Est. 2002)',
    'Learn about Delhi Magic Shop, established in 2002 in Karampura, New Delhi by Director Sumit Kharbanda under Ira Magic Impex.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16 bg-white">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
            Established {BUSINESS_INFO.establishedYear} · {BUSINESS_INFO.legalEntity}
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#121A25] text-balance">
            {ABOUT_COPY.headline}
          </h1>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {ABOUT_COPY.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold cursor-pointer"
            >
              Explore Our Catalogue
            </button>
            <button
              type="button"
              onClick={() => navigate('/contact-us')}
              className="px-6 py-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-[#121A25] text-sm font-semibold cursor-pointer"
            >
              Visit Karampura Showroom
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-[#F8FAFC]">
          <SmartImage
            src={IMAGES.about}
            alt="Delhi Magic Shop showroom and magic workshop shelves in New Delhi"
            className="w-full h-full object-cover min-h-[360px]"
          />
        </div>
      </div>

      {/* Leadership & Store Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#DC2626]">Director &amp; Manager</div>
          <div className="text-xl font-display font-bold text-[#121A25]">
            {BUSINESS_INFO.directorName}
          </div>
          <p className="text-sm text-slate-600">
            Leading Delhi Magic Shop since 2002, guiding beginners and stage professionals toward
            dependable performance apparatus.
          </p>
        </div>
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#DC2626]">New Delhi Showroom</div>
          <div className="text-xl font-display font-bold text-[#121A25]">Karampura Commercial Complex</div>
          <p className="text-sm text-slate-600">{BUSINESS_INFO.address.full}</p>
        </div>
        <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#DC2626]">Global Reach</div>
          <div className="text-xl font-display font-bold text-[#121A25]">India &amp; Worldwide Export</div>
          <p className="text-sm text-slate-600">
            Dispatching orders across 18+ Indian states and 26+ countries via DHL, FedEx, and
            India Post.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
          Customer Words
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <blockquote
              key={t.id}
              className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <p className="text-sm text-slate-700 leading-relaxed">“{t.quote}”</p>
              <footer className="text-xs font-bold text-[#121A25]">{t.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ContactUsPage() {
  const { submitEnquiry } = useStore();
  usePageSeo(
    'Contact Us – Delhi Magic Shop, Karampura, New Delhi',
    'Get in touch with Delhi Magic Shop at M-7, Mahavir Bhawan, Karampura, New Delhi - 110015. Call +91-9654162641 or +91-9910406619.'
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateEnquiryForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const rec = submitEnquiry(form);
    setSubmittedId(rec.id);
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12 bg-white">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">
          Contact Delhi Magic Shop
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          We are always happy to help with prop recommendations, international freight quotes, or
          showroom visits in New Delhi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Direct Info & Showroom Location */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-display font-bold text-[#121A25]">Store Details</h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#121A25]">Physical Showroom &amp; Office</div>
                  <p className="text-slate-600 mt-0.5">{BUSINESS_INFO.address.full}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#121A25]">Phone &amp; WhatsApp</div>
                  <p className="font-mono text-slate-600 mt-0.5">
                    {BUSINESS_INFO.phones.join(' · ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#121A25]">Email Addresses</div>
                  <p className="text-slate-600 mt-0.5">{BUSINESS_INFO.emails.join(' · ')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#121A25]">Showroom Hours</div>
                  <p className="text-slate-600 mt-0.5">{BUSINESS_INFO.storeHours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl('Hello Delhi Magic Shop, I would like to ask a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <a
                href={BUSINESS_INFO.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-[#121A25] text-xs font-semibold"
              >
                <ExternalLink className="w-4 h-4 text-[#DC2626]" />
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-[#121A25]">Directions to Karampura Showroom</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Located in Mahavir Bhawan Commercial Complex, Karampura, West Delhi (PIN 110015), near
              Moti Nagar &amp; Karampura Bus Terminal. Call ahead on +91-9654162641 for live
              demonstrations of stage illusions.
            </p>
          </div>
        </div>

        {/* Right: Enquiry Form */}
        <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-2xl font-display font-bold text-[#121A25]">Send an Enquiry</h2>

          {submittedId && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Enquiry <strong className="font-mono">{submittedId}</strong> saved. Our team will
                respond via email or WhatsApp.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enq-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  id="enq-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.name && <p className="text-xs text-[#DC2626] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="enq-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email *
                </label>
                <input
                  id="enq-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.email && <p className="text-xs text-[#DC2626] mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="enq-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile No. *
                </label>
                <input
                  id="enq-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.phone && <p className="text-xs text-[#DC2626] mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="enq-subject" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject *
                </label>
                <input
                  id="enq-subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
                />
                {errors.subject && <p className="text-xs text-[#DC2626] mt-1">{errors.subject}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="enq-msg" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Write Your Message *
              </label>
              <textarea
                id="enq-msg"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-3.5 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] focus:outline-none focus:border-[#DC2626]"
              />
              {errors.message && <p className="text-xs text-[#DC2626] mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Submit Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ServiceAreasPage() {
  const [regionFilter, setRegionFilter] = useState<'all' | 'india' | 'international'>('all');

  usePageSeo(
    'Service Areas – India & International Shipping | Delhi Magic Shop',
    'Delhi Magic Shop dispatches magic tricks and props across 18 Indian states & UTs and over 26 countries worldwide.'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 bg-white">
      <Breadcrumbs items={[{ label: 'Service Areas' }]} />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">
            Service Areas
          </h1>
          <p className="text-sm text-slate-600">
            Serving performers, collectors, and event artists across India and worldwide via
            trusted courier and postal networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'india', 'international'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRegionFilter(tab)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                regionFilter === tab
                  ? 'bg-[#121A25] border-[#121A25] text-white'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {(regionFilter === 'all' || regionFilter === 'india') && (
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-[#121A25] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#DC2626]" />
            Indian States &amp; Union Territories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SERVICE_AREAS_INDIA.map((state) => (
              <div
                key={state}
                className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-[#121A25]"
              >
                {state}
              </div>
            ))}
          </div>
        </section>
      )}

      {(regionFilter === 'all' || regionFilter === 'international') && (
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-[#121A25] flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#DC2626]" />
            International Export Destinations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {SERVICE_AREAS_INTERNATIONAL.map((country) => (
              <div
                key={country}
                className="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-[#121A25]"
              >
                {country}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

type PolicySlug = 'payment' | 'shipping' | 'returns' | 'privacy' | 'terms';

const POLICY_META: Record<PolicySlug, { title: string; subtitle: string; seoDesc: string }> = {
  payment: {
    title: 'Payment Information',
    subtitle: 'Secure UPI, Card & NetBanking payment guidance under Ira Magic Impex.',
    seoDesc:
      'Pay safely at Delhi Magic Shop using Paytm, PhonePe, Google Pay UPI, Visa, Mastercard, and RuPay.',
  },
  shipping: {
    title: 'Shipping Policy',
    subtitle: 'Dispatch timelines, domestic Speed Post / courier, and international DHL / FedEx parcels.',
    seoDesc:
      'Review Delhi Magic Shop processing timelines, battery/liquid air parcel rules, and domestic or global delivery schedules.',
  },
  returns: {
    title: 'Return & Refund Policy',
    subtitle: '3-day return eligibility, 48-hour damaged item reporting, and 5-day refund timelines.',
    seoDesc:
      'Understand our 3-day return window, unboxing video verification, and 5-business-day refund processing.',
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How Delhi Magic Shop collects, protects, and uses your order and contact information.',
    seoDesc: 'Read how Delhi Magic Shop protects your customer and shipping data.',
  },
  terms: {
    title: 'Terms and Conditions',
    subtitle: 'Store terms governing purchases and intellectual property of Ira Magic Impex.',
    seoDesc: 'Terms and Conditions for shopping at Delhi Magic Shop (Ira Magic Impex).',
  },
};

export function PolicyPage({ type }: { type: PolicySlug }) {
  const { navigate } = useStore();
  const meta = POLICY_META[type];
  const sections = POLICY_CONTENT[type];

  usePageSeo(`${meta.title} – Delhi Magic Shop`, meta.seoDesc);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-white">
      <Breadcrumbs items={[{ label: meta.title }]} />

      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 text-xs text-[#DC2626] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>{BUSINESS_INFO.legalEntity} · Official Store Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">{meta.title}</h1>
        <p className="text-sm text-slate-600">{meta.subtitle}</p>
      </div>

      <div className="space-y-6">
        {sections.map((sec) => (
          <section
            key={sec.title}
            className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 space-y-2.5"
          >
            <h2 className="text-lg font-bold text-[#121A25]">{sec.title}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{sec.body}</p>
          </section>
        ))}
      </div>

      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-700">
        <span>Need clarification on this policy? Contact {BUSINESS_INFO.emails[0]} or {BUSINESS_INFO.phones[0]}.</span>
        <button
          type="button"
          onClick={() => navigate('/contact-us')}
          className="px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold whitespace-nowrap cursor-pointer"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
