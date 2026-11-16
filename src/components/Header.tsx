import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ANNOUNCEMENTS } from '../data/business';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { filterAndSortProducts, formatINR } from '../utils/store';
import { SmartImage } from './SmartImage';

export function Header() {
  const {
    currentPath,
    navigate,
    cartTotals,
    wishlist,
    setCartDrawerOpen,
    searchOpen,
    setSearchOpen,
    profile,
  } = useStore();

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const megaRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 40);
    }
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSortProducts(PRODUCTS, { searchQuery: query }).slice(0, 6);
  }, [query]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Close-Up', path: '/category/close-up-magic' },
    { label: 'Mentalism', path: '/category/mentalism-magic' },
    { label: 'Card Magic', path: '/category/card-magic-tricks' },
    { label: 'Stage Magic', path: '/category/stage-magic' },
    { label: 'Beginners', path: '/category/magic-for-beginners' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact', path: '/contact-us' },
  ];

  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMegaOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Slim Top Announcement Bar */}
      <div className="bg-[#121A25] px-3 sm:px-4 h-7 sm:h-8 flex items-center justify-between text-xs text-white">
        <button
          type="button"
          onClick={() =>
            setAnnouncementIdx((i) => (i - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)
          }
          aria-label="Previous announcement"
          className="p-1 text-slate-300 hover:text-white hidden sm:inline-flex cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <p className="mx-auto text-center truncate tracking-wide text-[11px] sm:text-xs font-medium text-slate-100">
          {ANNOUNCEMENTS[announcementIdx]}
        </p>
        <button
          type="button"
          onClick={() => setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length)}
          aria-label="Next announcement"
          className="p-1 text-slate-300 hover:text-white hidden sm:inline-flex cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main White E-Commerce Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-5">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-slate-200 flex items-center justify-center text-[#121A25] hover:bg-slate-50 shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className="font-display text-lg sm:text-[24px] font-bold tracking-tight text-[#121A25] whitespace-nowrap shrink-0 hover:text-[#DC2626] transition-colors"
          >
            Delhi Magic Shop
          </a>
        </div>

        {/* Desktop Single-Row Navigation */}
        <nav aria-label="Primary Navigation" className="hidden xl:flex items-center gap-5">
          <a
            href="/"
            onClick={(e) => handleLink(e, '/')}
            className={`text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              currentPath === '/' ? 'text-[#DC2626] font-semibold' : 'text-slate-700 hover:text-[#121A25]'
            }`}
          >
            Home
          </a>

          {/* Shop All with Functional Category Mega-Menu */}
          <div className="relative" ref={megaRef}>
            <button
              type="button"
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
              className={`inline-flex items-center gap-1 text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                currentPath.startsWith('/shop') || megaOpen
                  ? 'text-[#DC2626] font-semibold'
                  : 'text-slate-700 hover:text-[#121A25]'
              }`}
            >
              Shop All
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {megaOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[780px] bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                  <span className="text-sm font-display font-bold text-[#121A25]">
                    Explore Magic Categories
                  </span>
                  <a
                    href="/shop"
                    onClick={(e) => handleLink(e, '/shop')}
                    className="text-xs font-semibold text-[#DC2626] hover:underline"
                  >
                    Browse All Products →
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => (
                    <a
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={(e) => handleLink(e, `/category/${cat.slug}`)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <SmartImage
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#121A25] group-hover:text-[#DC2626] truncate">
                          {cat.name}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {navItems.slice(1).map((item) => {
            const active = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLink(e, item.path)}
                className={`text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'text-[#DC2626] font-semibold' : 'text-slate-700 hover:text-[#121A25]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search magic products"
            aria-expanded={searchOpen}
            className="w-8 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-700 hover:text-[#121A25] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <a
            href="/account"
            onClick={(e) => handleLink(e, '/account')}
            aria-label={profile.signedIn ? 'My Account' : 'Account Sign In'}
            className="w-8 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-700 hover:text-[#121A25] hover:bg-slate-100 transition-colors"
          >
            <User className="w-4 h-4" />
          </a>

          <a
            href="/wishlist"
            onClick={(e) => handleLink(e, '/wishlist')}
            aria-label={`Wishlist (${wishlist.length} saved items)`}
            className="relative w-8 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-slate-700 hover:text-[#121A25] hover:bg-slate-100 transition-colors"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-0.5 sm:top-1.5 sm:right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-mono font-bold flex items-center justify-center tabular-nums">
                {wishlist.length}
              </span>
            )}
          </a>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            aria-label={`Shopping cart (${cartTotals.itemCount} items)`}
            className="relative inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span className="font-mono tabular-nums" data-testid="header-cart-count">
              ({cartTotals.itemCount})
            </span>
          </button>
        </div>
      </div>

      {/* Live Search Dropdown Bar */}
      {searchOpen && (
        <div className="border-t border-slate-200 bg-[#F8FAFC] px-4 py-4">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="header-search-input" className="sr-only">
                Search magic tricks and props
              </label>
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="header-search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Slate Writer, Bee Playing Cards, Magic Lamp, Mentalism..."
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-white border border-slate-300 text-sm text-[#121A25] placeholder:text-slate-400 focus:outline-none focus:border-[#DC2626]"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold whitespace-nowrap cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="h-11 w-11 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:text-[#121A25] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {query.trim().length > 0 && (
              <div className="mt-3 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-md">
                {searchResults.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500">
                    No magic props matched “{query}”. Try searching for cards, wallet, lamp, or stage.
                  </p>
                ) : (
                  <>
                    {searchResults.map((prod) => (
                      <a
                        key={prod.id}
                        href={`/product/${prod.slug}`}
                        onClick={(e) => handleLink(e, `/product/${prod.slug}`)}
                        className="flex items-center justify-between gap-3 p-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-9 rounded bg-slate-100 overflow-hidden shrink-0">
                            <SmartImage
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#121A25] truncate">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-slate-500 capitalize">
                              {prod.category.replace(/-/g, ' ')}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-mono font-semibold tabular-nums text-[#DC2626] shrink-0">
                          {formatINR(prod.price)}
                        </span>
                      </a>
                    ))}
                    <a
                      href={`/shop?q=${encodeURIComponent(query.trim())}`}
                      onClick={(e) => handleLink(e, `/shop?q=${encodeURIComponent(query.trim())}`)}
                      className="block p-3 text-center text-xs font-semibold text-[#DC2626] hover:bg-slate-50"
                    >
                      View all results for “{query}” →
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 max-h-[75vh] overflow-y-auto shadow-lg"
        >
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLink(e, item.path)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#121A25] hover:bg-slate-100 hover:text-[#DC2626]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/shop"
              onClick={(e) => handleLink(e, '/shop')}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#DC2626] hover:bg-red-50"
            >
              Shop All Products
            </a>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="px-3 text-xs font-semibold text-slate-500 mb-2">All Categories</div>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={(e) => handleLink(e, `/category/${cat.slug}`)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100 hover:text-[#121A25] truncate"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
