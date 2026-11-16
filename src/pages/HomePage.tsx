import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Globe,
  Headphones,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { SmartImage } from '../components/SmartImage';
import { useStore } from '../context/StoreContext';
import { ABOUT_COPY, HERO_SLIDES, PROMO_SPOTLIGHTS, TESTIMONIALS } from '../data/business';
import { CATEGORIES, getProductBySlug, IMAGES, PRODUCTS } from '../data/catalog';
import { CategorySlug } from '../types/store';
import { usePageSeo } from '../utils/seo';
import { formatINR } from '../utils/store';

const COLLECTION_TABS: { slug: CategorySlug; label: string }[] = [
  { slug: 'close-up-magic', label: 'Close-Up Magic' },
  { slug: 'hot-selling-magic', label: 'Hot Selling Magic' },
  { slug: 'mentalism-magic', label: 'Mentalism Magic' },
  { slug: 'card-magic-tricks', label: 'Card Magic Tricks' },
  { slug: 'stage-magic', label: 'Stage Magic' },
  { slug: 'birthday-party-magic', label: 'Birthday Party Magic' },
  { slug: 'classic-magic-items', label: 'Classic Magic Items' },
  { slug: 'comedy-magic', label: 'Comedy Magic' },
  { slug: 'illusion-show-items', label: 'Illusion Show Items' },
  { slug: 'magic-for-beginners', label: 'Magic for Beginners' },
];

export function HomePage() {
  const { navigate, addToCart, subscribeNewsletter } = useStore();
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [activeCollection, setActiveCollection] = useState<CategorySlug>('close-up-magic');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const shelfRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  usePageSeo(
    'Delhi Magic Shop – Professional Magic Props, Tricks & Illusions Since 2002',
    'Shop close-up magic, mentalism equipment, playing cards, stage illusions, and beginner magic kits from Delhi Magic Shop, Karampura, New Delhi.'
  );

  useEffect(() => {
    if (heroPaused) return;
    const timer = window.setInterval(() => {
      setHeroIdx((idx) => (idx + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  const activeSlide = HERO_SLIDES[heroIdx];
  const spotlightProduct = useMemo(
    () => getProductBySlug(activeSlide.featuredProductSlug),
    [activeSlide.featuredProductSlug]
  );

  const featuredCategories = useMemo(
    () => CATEGORIES.filter((c) => c.featuredOnHome),
    []
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      counts[cat.slug] = PRODUCTS.filter(
        (p) => p.category === cat.slug || p.collections.includes(cat.slug)
      ).length;
    }
    return counts;
  }, []);

  const bestsellers = useMemo(
    () => PRODUCTS.filter((p) => p.isBestseller).slice(0, 10),
    []
  );

  const collectionProducts = useMemo(
    () =>
      PRODUCTS.filter(
        (p) => p.category === activeCollection || p.collections.includes(activeCollection)
      ).slice(0, 8),
    [activeCollection]
  );

  const scrollShelf = (direction: -1 | 1) => {
    if (!shelfRef.current) return;
    shelfRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
  };

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      setHeroIdx((i) => (i + 1) % HERO_SLIDES.length);
    } else {
      setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    }
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeNewsletter(newsletterEmail)) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
    }
  };

  return (
    <div className="bg-white text-[#121A25]">
      {/* C. Multi-Image Interactive E-Commerce Hero Slider */}
      <section
        aria-label="Featured Storefront Showcase"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onTouchStart={handleHeroTouchStart}
        onTouchEnd={handleHeroTouchEnd}
        className="bg-[#F8FAFC] border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8 sm:py-8">
          <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 lg:h-[500px]">
            {/* Left Content Column (Fixed height so container never shifts when sliding or swiping) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-4 order-2 lg:order-1 bg-white h-[350px] sm:h-[330px] lg:h-full">
              <div className="space-y-3">
                <p
                  data-testid="hero-slide-eyebrow"
                  className="text-xs font-semibold uppercase tracking-widest text-[#DC2626] truncate"
                >
                  {activeSlide.eyebrow}
                </p>
                <h1
                  data-testid="hero-slide-title"
                  className="text-2xl sm:text-3xl lg:text-[38px] font-display font-bold text-[#121A25] leading-[1.12] line-clamp-2"
                >
                  {activeSlide.title}
                </h1>
                <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed line-clamp-3">
                  {activeSlide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate(activeSlide.ctaPath)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer shadow-xs"
                  >
                    {activeSlide.ctaLabel}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(activeSlide.secondaryPath)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[#121A25] text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {activeSlide.secondaryLabel}
                  </button>
                </div>
              </div>

              <div className="space-y-3 mt-auto">
                {/* Quick-Add Spotlight Bar kept cleanly in left column so artwork stays unobstructed */}
                {spotlightProduct && (
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] border border-slate-200 px-3.5 py-2.5">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-slate-500">Featured Hero Product</div>
                      <div className="flex items-baseline gap-2">
                        <a
                          href={`/product/${spotlightProduct.slug}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/product/${spotlightProduct.slug}`);
                          }}
                          className="text-sm font-bold text-[#121A25] hover:text-[#DC2626] truncate"
                        >
                          {spotlightProduct.name}
                        </a>
                        <span className="text-xs font-mono font-bold tabular-nums text-[#DC2626] shrink-0">
                          {formatINR(spotlightProduct.price)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(spotlightProduct.id, 1, true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#121A25] hover:bg-[#DC2626] text-white text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                      Add to Cart
                    </button>
                  </div>
                )}

                {/* Slide Switcher Bar */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        role="tab"
                        aria-selected={heroIdx === idx}
                        aria-label={`Show slide ${idx + 1}: ${slide.eyebrow}`}
                        onClick={() => setHeroIdx(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          heroIdx === idx
                            ? 'w-8 bg-[#DC2626]'
                            : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono tabular-nums text-slate-500 mr-1">
                      0{heroIdx + 1} / 0{HERO_SLIDES.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setHeroIdx((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                      }
                      aria-label="Previous hero slide"
                      className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#121A25] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length)}
                      aria-label="Next hero slide"
                      className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#121A25] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Carousel Image (Locked uniform frame height & seamless ambient fill across all slides) */}
            <div
              className={`lg:col-span-7 relative h-[260px] sm:h-[340px] lg:h-full order-1 lg:order-2 overflow-hidden ${
                activeSlide.imageFit === 'contain' ? 'bg-[#0E081D]' : 'bg-[#F1F5F9]'
              }`}
            >
              <a
                href={activeSlide.ctaPath}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(activeSlide.ctaPath);
                }}
                aria-label={activeSlide.title}
                className="relative block w-full h-full overflow-hidden"
              >
                {activeSlide.imageFit === 'contain' && (
                  <img
                    src={activeSlide.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 brightness-90 pointer-events-none select-none"
                  />
                )}
                <SmartImage
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  priority={heroIdx === 0}
                  className={`relative z-10 w-full h-full transition-opacity duration-300 ${
                    activeSlide.imageFit === 'contain'
                      ? 'object-contain object-center'
                      : 'object-cover object-center'
                  }`}
                />
              </a>
            </div>
          </div>

          {/* 4-Card Promotional Spotlights Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {PROMO_SPOTLIGHTS.map((promo) => (
              <a
                key={promo.title}
                href={promo.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(promo.path);
                }}
                className="group flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-[#DC2626]/40 hover:shadow-sm transition-all"
              >
                <div
                  className={`relative w-18 h-14 rounded-lg overflow-hidden shrink-0 ${
                    promo.imageFit === 'contain' ? 'bg-[#0E081D]' : 'bg-slate-100'
                  }`}
                >
                  {promo.imageFit === 'contain' && (
                    <img
                      src={promo.image}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-md scale-125 pointer-events-none select-none"
                    />
                  )}
                  <SmartImage
                    src={promo.image}
                    alt={promo.title}
                    className={`relative z-10 w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                      promo.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#121A25] group-hover:text-[#DC2626] line-clamp-1">
                    {promo.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{promo.subtitle}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* D. Shop by Category (9 Core Categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-1.5">
              Curated Magic Disciplines
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
              Shop by Category
            </h2>
          </div>
          <a
            href="/shop"
            onClick={(e) => {
              e.preventDefault();
              navigate('/shop');
            }}
            className="text-sm font-semibold text-[#DC2626] hover:underline whitespace-nowrap"
          >
            View All Categories →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCategories.map((cat) => (
            <a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/category/${cat.slug}`);
              }}
              className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="aspect-[16/10] w-full bg-[#F8FAFC] overflow-hidden border-b border-slate-100">
                <SmartImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-lg font-display font-bold text-[#121A25] group-hover:text-[#DC2626] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-slate-500 shrink-0">
                    {categoryCounts[cat.slug] || 0} props
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
                <span className="mt-auto pt-2 text-xs font-semibold text-[#DC2626] inline-flex items-center gap-1.5">
                  Explore Category
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* E. Bestselling Products */}
      <section className="bg-[#F8FAFC] border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-1.5">
                Performer Favourites
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
                Bestselling Products
              </h2>
            </div>
            <a
              href="/shop?tab=bestsellers"
              onClick={(e) => {
                e.preventDefault();
                navigate('/shop?tab=bestsellers');
              }}
              className="text-sm font-semibold text-[#DC2626] hover:underline whitespace-nowrap"
            >
              Shop All Bestsellers →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* F. Explore Our Magic Collection (All 10 Collections Interactive Shelf) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-1.5">
              Complete Repertoire
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
              Explore Our Magic Collection
            </h2>
          </div>
          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => scrollShelf(-1)}
              aria-label="Scroll collection left"
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#121A25] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollShelf(1)}
              aria-label="Scroll collection right"
              className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#121A25] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate(`/category/${activeCollection}`)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#DC2626] hover:underline whitespace-nowrap ml-2 cursor-pointer"
            >
              View All {COLLECTION_TABS.find((t) => t.slug === activeCollection)?.label}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Collection Filter Tabs */}
        <div
          role="tablist"
          aria-label="Magic Collections"
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 magic-scroll"
        >
          {COLLECTION_TABS.map((tab) => {
            const active = activeCollection === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCollection(tab.slug)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                  active
                    ? 'bg-[#121A25] border-[#121A25] text-white'
                    : 'bg-[#F8FAFC] border-slate-200 text-slate-700 hover:border-slate-300 hover:text-[#121A25]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Horizontal Carousel for Selected Collection */}
        <div
          ref={shelfRef}
          className="flex gap-5 overflow-x-auto pb-4 magic-scroll snap-x"
        >
          {collectionProducts.map((product) => (
            <div key={product.id} className="w-[260px] sm:w-[275px] shrink-0 snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* G. Why Choose Delhi Magic Shop? */}
      <section className="bg-[#F8FAFC] border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-1.5">
              Trust &amp; Heritage
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25] text-balance">
              Everything a Magician Needs, All in One Place.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'Established in 2002',
                desc: 'Over two decades serving performing magicians, hobbyists, and collectors from our Karampura showroom in New Delhi.',
              },
              {
                icon: Sparkles,
                title: 'Extensive Product Range',
                desc: 'Props spanning pocket close-up tricks, electronic mentalism, card magic, comedy gags, and grand stage illusions.',
              },
              {
                icon: Wand2,
                title: 'For Beginners & Professionals',
                desc: 'Whether learning your very first card force or outfitting a touring theatre illusion show, find props matched to your level.',
              },
              {
                icon: Globe,
                title: 'International Sourcing & Export',
                desc: 'Curating apparatus from reputable international makers alongside Indian craft—dispatched across India and worldwide.',
              },
              {
                icon: Headphones,
                title: 'Dedicated Customer Assistance',
                desc: 'Direct guidance from an experienced magic team via phone, WhatsApp, and in-store demonstrations in New Delhi.',
              },
              {
                icon: Compass,
                title: 'Serving the Magic Community',
                desc: 'Committed to helping performers expand their repertoire with reliable, performance-ready apparatus and instruction.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#DC2626]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-[#121A25]">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* H. About the Business */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-[#F8FAFC]">
            <SmartImage
              src={IMAGES.about}
              alt="Delhi Magic Shop heritage display cabinet and performance table in New Delhi"
              className="w-full h-full object-cover min-h-[320px]"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626]">
              Our Story · Managed by Sumit Kharbanda
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25] text-balance">
              {ABOUT_COPY.headline}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {ABOUT_COPY.paragraphs[1]}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {ABOUT_COPY.paragraphs[2]}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/about-us')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#121A25] hover:bg-[#DC2626] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                About Us
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* I. Customer Testimonials */}
      <section className="bg-[#F8FAFC] border-y border-slate-200 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#DC2626] mb-1.5">
              From Our Customers
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
              Trusted by Magicians &amp; Enthusiasts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <blockquote
                key={t.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4 shadow-xs"
              >
                <p className="text-sm text-slate-700 leading-relaxed">“{t.quote}”</p>
                <footer className="pt-3 border-t border-slate-100">
                  <div className="text-sm font-bold text-[#121A25]">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* J. Shopping Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: ShieldCheck,
              title: 'Secure Shopping',
              text: 'Payments handled via trusted third-party gateways (UPI, Paytm, PhonePe, Google Pay & Cards).',
              link: '/payment-information',
            },
            {
              icon: PackageCheck,
              title: 'India & Global Shipping',
              text: 'Dispatched within 2 business days via DHL, FedEx & India Post. Charges confirmed by weight.',
              link: '/shipping-policy',
            },
            {
              icon: RotateCcw,
              title: '3-Day Return Policy',
              text: 'Eligible unused items returnable within 3 days of delivery; damaged items within 48 hours.',
              link: '/return-policy',
            },
            {
              icon: Headphones,
              title: 'Customer Support',
              text: 'Direct assistance on +91-9654162641 / +91-9910406619 and our Karampura showroom.',
              link: '/contact-us',
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <a
                key={b.title}
                href={b.link}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(b.link);
                }}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 hover:border-[#DC2626]/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-[#121A25]">{b.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{b.text}</p>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* K. Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#121A25]">
          Stay Ahead of the Magic.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-xl mx-auto">
          Discover new magic products, interesting tricks and the latest additions to our
          collection.
        </p>

        <form
          onSubmit={handleNewsletter}
          className="mt-7 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={newsletterEmail}
            onChange={(e) => {
              setNewsletterEmail(e.target.value);
              if (newsletterStatus !== 'idle') setNewsletterStatus('idle');
            }}
            placeholder="Enter your email address"
            className="flex-1 h-12 px-4 rounded-lg bg-[#F8FAFC] border border-slate-300 text-sm text-[#121A25] placeholder:text-slate-400 focus:outline-none focus:border-[#DC2626]"
          />
          <button
            type="submit"
            className="h-12 px-6 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
          >
            Subscribe
          </button>
        </form>

        {newsletterStatus === 'success' && (
          <p className="mt-3 text-xs text-emerald-700 font-medium inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            You are subscribed to Delhi Magic Shop updates.
          </p>
        )}
        {newsletterStatus === 'error' && (
          <p className="mt-3 text-xs text-[#DC2626]">Please enter a valid email address.</p>
        )}
      </section>
    </div>
  );
}
