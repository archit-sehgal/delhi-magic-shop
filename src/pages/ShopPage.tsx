import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, getCategoryBySlug, PRODUCTS } from '../data/catalog';
import { CategorySlug } from '../types/store';
import { usePageSeo } from '../utils/seo';
import {
  CollectionTabFilter,
  filterAndSortProducts,
  formatINR,
  SortOption,
} from '../utils/store';

interface ShopPageProps {
  categorySlug?: CategorySlug;
}

export function ShopPage({ categorySlug }: ShopPageProps) {
  const { currentPath, navigate } = useStore();
  const activeCategoryInfo = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const urlParams = useMemo(() => {
    const idx = currentPath.indexOf('?');
    return new URLSearchParams(idx >= 0 ? currentPath.slice(idx) : '');
  }, [currentPath]);

  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(
    categorySlug || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(urlParams.get('q') || '');
  const [collectionTab, setCollectionTab] = useState<CollectionTabFilter>(
    (urlParams.get('tab') as CollectionTabFilter) || 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(45000);
  const [onlyInStock, setOnlyInStock] = useState(false);

  useEffect(() => {
    setSelectedCategory(categorySlug || 'all');
  }, [categorySlug]);

  useEffect(() => {
    const qParam = urlParams.get('q');
    const tabParam = urlParams.get('tab') as CollectionTabFilter | null;
    if (qParam !== null) setSearchQuery(qParam);
    if (tabParam) setCollectionTab(tabParam);
  }, [urlParams]);

  usePageSeo(
    activeCategoryInfo
      ? `${activeCategoryInfo.name} – Delhi Magic Shop`
      : 'Shop All Magic Props & Tricks – Delhi Magic Shop',
    activeCategoryInfo
      ? activeCategoryInfo.description
      : 'Browse our complete online catalogue of close-up magic, mentalism, card decks, stage illusions, and beginner kits in INR.'
  );

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(PRODUCTS, {
        category: selectedCategory,
        searchQuery,
        maxPrice,
        sortBy,
        collectionTab,
        onlyInStock,
      }),
    [selectedCategory, searchQuery, maxPrice, sortBy, collectionTab, onlyInStock]
  );

  const resetFilters = () => {
    setSelectedCategory(categorySlug || 'all');
    setSearchQuery('');
    setCollectionTab('all');
    setSortBy('featured');
    setMaxPrice(45000);
    setOnlyInStock(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 bg-white">
      <Breadcrumbs
        items={
          activeCategoryInfo
            ? [{ label: 'Shop All', path: '/shop' }, { label: activeCategoryInfo.name }]
            : [{ label: 'Shop All' }]
        }
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#121A25]">
            {activeCategoryInfo ? activeCategoryInfo.name : 'Shop All Magic Products'}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {activeCategoryInfo
              ? activeCategoryInfo.description
              : 'Explore professional close-up apparatus, mentalism tools, card decks, stage illusions, and starter kits priced in Indian Rupees (INR).'}
          </p>
        </div>
        <div className="text-xs font-mono tabular-nums text-slate-500 font-medium">
          Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Collection Quick Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'all', label: 'All Items' },
              { id: 'bestsellers', label: 'Bestselling' },
              { id: 'new-arrivals', label: 'New Arrivals' },
              { id: 'discounted', label: 'Discounted' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCollectionTab(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer border ${
                collectionTab === tab.id
                  ? 'bg-[#121A25] border-[#121A25] text-white'
                  : 'bg-[#F8FAFC] border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="shop-sort-select" className="text-xs text-slate-500 whitespace-nowrap font-medium">
            Sort by:
          </label>
          <select
            id="shop-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 px-3 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#121A25] focus:outline-none focus:border-[#DC2626]"
          >
            <option value="featured">Featured &amp; Bestselling</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount-desc">Highest Discount</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-3 bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#121A25] inline-flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#DC2626]" aria-hidden="true" />
              Filter Catalogue
            </h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-[#DC2626] inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search Filter */}
          <div>
            <label htmlFor="shop-search" className="block text-xs font-semibold text-slate-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <Search
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="shop-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or keyword..."
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-300 text-xs text-[#121A25] placeholder:text-slate-400 focus:outline-none focus:border-[#DC2626]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">Categories</div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  if (categorySlug) navigate('/shop');
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#121A25] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                All Categories ({PRODUCTS.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    if (categorySlug) navigate(`/category/${cat.slug}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#121A25] text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label htmlFor="price-range-slider" className="font-semibold text-slate-700">
                Max Price
              </label>
              <span className="font-mono font-semibold tabular-nums text-[#DC2626]">
                Up to {formatINR(maxPrice)}
              </span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min={100}
              max={45000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#DC2626]"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
              <span>₹100</span>
              <span>₹45,000</span>
            </div>
          </div>

          {/* Availability */}
          <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="w-4 h-4 rounded accent-[#DC2626]"
            />
            In Stock items only
          </label>
        </aside>

        {/* Product Results Grid */}
        <div className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-12 text-center space-y-4">
              <p className="text-base font-semibold text-[#121A25]">
                No magic products match your selected filters.
              </p>
              <p className="text-xs text-slate-500">
                Try increasing your price range or clearing the search keyword.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
