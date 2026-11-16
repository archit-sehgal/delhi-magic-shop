import { Mail, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';
import { CATEGORIES } from '../data/catalog';

export function Footer() {
  const { navigate } = useStore();

  const go = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="bg-[#121A25] border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Intro */}
        <div className="space-y-4">
          <a
            href="/"
            onClick={(e) => go(e, '/')}
            aria-label="Delhi Magic Shop"
            className="inline-flex items-center bg-white rounded-xl px-3.5 py-2 shadow-xs hover:opacity-95 transition-opacity"
          >
            <img
              src="/src/assets/images/delhi_magic_logo_1794833755046.jpg"
              alt="Delhi Magic Shop"
              referrerPolicy="no-referrer"
              className="h-12 w-auto object-contain"
            />
          </a>
          <p className="text-sm text-slate-300 leading-relaxed">
            Established in {BUSINESS_INFO.establishedYear} and managed by {BUSINESS_INFO.directorName} under{' '}
            {BUSINESS_INFO.legalEntity}. Supplying professional magic props, mentalism apparatus, playing cards, and
            illusions across India and worldwide.
          </p>
          <div className="space-y-2 text-xs text-slate-300 pt-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{BUSINESS_INFO.address.full}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span className="font-mono">{BUSINESS_INFO.phones.join(' · ')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{BUSINESS_INFO.emails[0]}</span>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Product Categories</h3>
          <ul className="space-y-2 text-xs">
            {CATEGORIES.slice(0, 9).map((cat) => (
              <li key={cat.slug}>
                <a
                  href={`/category/${cat.slug}`}
                  onClick={(e) => go(e, `/category/${cat.slug}`)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Navigation */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/" onClick={(e) => go(e, '/')} className="text-slate-300 hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/shop" onClick={(e) => go(e, '/shop')} className="text-slate-300 hover:text-white">
                Shop All Products
              </a>
            </li>
            <li>
              <a href="/about-us" onClick={(e) => go(e, '/about-us')} className="text-slate-300 hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact-us" onClick={(e) => go(e, '/contact-us')} className="text-slate-300 hover:text-white">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/service-areas" onClick={(e) => go(e, '/service-areas')} className="text-slate-300 hover:text-white">
                Service Areas
              </a>
            </li>
            <li>
              <a href="/account" onClick={(e) => go(e, '/account')} className="text-slate-300 hover:text-white">
                My Account
              </a>
            </li>
            <li>
              <a href="/wishlist" onClick={(e) => go(e, '/wishlist')} className="text-slate-300 hover:text-white">
                Wishlist
              </a>
            </li>
            <li>
              <a href="/cart" onClick={(e) => go(e, '/cart')} className="text-slate-300 hover:text-white">
                Shopping Cart
              </a>
            </li>
          </ul>
        </div>

        {/* Policies & Payments */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Policies &amp; Payments</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/payment-information"
                  onClick={(e) => go(e, '/payment-information')}
                  className="text-slate-300 hover:text-white"
                >
                  Payment Information
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  onClick={(e) => go(e, '/shipping-policy')}
                  className="text-slate-300 hover:text-white"
                >
                  Shipping Policy
                </a>
              </li>
              <li>
                <a
                  href="/return-policy"
                  onClick={(e) => go(e, '/return-policy')}
                  className="text-slate-300 hover:text-white"
                >
                  Return Policy
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => go(e, '/privacy-policy')}
                  className="text-slate-300 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  onClick={(e) => go(e, '/terms-and-conditions')}
                  className="text-slate-300 hover:text-white"
                >
                  Terms and Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white mb-2">Accepted Payment Methods</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              UPI (Google Pay, PhonePe, Paytm) · Visa · Mastercard · RuPay · NetBanking
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white mb-2">Follow Us</h4>
            <div className="flex items-center gap-4 text-xs">
              <a
                href={BUSINESS_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white"
              >
                Facebook
              </a>
              <a
                href={BUSINESS_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white"
              >
                Instagram
              </a>
              <a
                href={BUSINESS_INFO.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>
            © {new Date().getFullYear()} Delhi Magic Shop ({BUSINESS_INFO.legalEntity}). All rights reserved.
          </span>
          <span>Karampura, New Delhi – 110015, India</span>
        </div>
      </div>
    </footer>
  );
}
