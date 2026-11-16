/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { QuickViewModal } from './components/QuickViewModal';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { StoreProvider, useStore } from './context/StoreContext';
import { AccountPage, WishlistPage } from './pages/AccountWishlistPages';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { AboutUsPage, ContactUsPage, PolicyPage, ServiceAreasPage } from './pages/InfoPages';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';
import { CategorySlug } from './types/store';

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
          <AppRouter />
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
