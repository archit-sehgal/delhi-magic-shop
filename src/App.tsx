/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { QuickViewModal } from './components/QuickViewModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { StoreProvider, useStore } from './context/StoreContext';
import { HomePage } from './pages/HomePage';
import { CategorySlug } from './types/store';

const ShopPage = lazy(() =>
  import('./pages/ShopPage').then((m) => ({ default: m.ShopPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const AccountPage = lazy(() =>
  import('./pages/AccountWishlistPages').then((m) => ({ default: m.AccountPage }))
);
const WishlistPage = lazy(() =>
  import('./pages/AccountWishlistPages').then((m) => ({ default: m.WishlistPage }))
);
const AboutUsPage = lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.AboutUsPage }))
);
const ContactUsPage = lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.ContactUsPage }))
);
const PolicyPage = lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.PolicyPage }))
);
const ServiceAreasPage = lazy(() =>
  import('./pages/InfoPages').then((m) => ({ default: m.ServiceAreasPage }))
);

function RouteLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-72 rounded-xl bg-slate-100 border border-slate-200" />
        ))}
      </div>
    </div>
  );
}

function AppRouter() {
  const { currentPath } = useStore();
  const pathname = currentPath.split('?')[0].replace(/\/+$/, '') || '/';

  if (pathname === '/') {
    return <HomePage />;
  }
  if (pathname === '/shop') {
    return <ShopPage />;
  }
  if (pathname.startsWith('/category/')) {
    const slug = pathname.slice('/category/'.length) as CategorySlug;
    return <ShopPage categorySlug={slug} />;
  }
  if (pathname.startsWith('/product/')) {
    const slug = pathname.slice('/product/'.length);
    return <ProductDetailPage slug={slug} />;
  }
  if (pathname === '/about-us') {
    return <AboutUsPage />;
  }
  if (pathname === '/contact-us') {
    return <ContactUsPage />;
  }
  if (pathname === '/cart') {
    return <CartPage />;
  }
  if (pathname === '/checkout') {
    return <CheckoutPage />;
  }
  if (pathname === '/account') {
    return <AccountPage />;
  }
  if (pathname === '/wishlist') {
    return <WishlistPage />;
  }
  if (pathname === '/payment-information') {
    return <PolicyPage type="payment" />;
  }
  if (pathname === '/shipping-policy') {
    return <PolicyPage type="shipping" />;
  }
  if (pathname === '/return-policy') {
    return <PolicyPage type="returns" />;
  }
  if (pathname === '/privacy-policy') {
    return <PolicyPage type="privacy" />;
  }
  if (pathname === '/terms-and-conditions') {
    return <PolicyPage type="terms" />;
  }
  if (pathname === '/service-areas') {
    return <ServiceAreasPage />;
  }

  return <HomePage />;
}

function ToastBanner() {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 max-w-sm bg-[#121A25] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl"
    >
      {toastMessage}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-white text-[#121A25]">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<RouteLoadingFallback />}>
            <AppRouter />
          </Suspense>
        </main>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
        <WhatsAppWidget />
        <ToastBanner />
      </div>
    </StoreProvider>
  );
}
