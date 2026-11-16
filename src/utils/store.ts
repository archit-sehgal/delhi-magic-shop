import { BUSINESS_INFO, SHIPPING_METHODS } from '../data/business';
import {
  CartItem,
  CategorySlug,
  CheckoutFormData,
  Product,
  ShippingMethodId,
} from '../types/store';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function getDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount-desc' | 'name-asc';
export type CollectionTabFilter = 'all' | 'bestsellers' | 'new-arrivals' | 'discounted';

export interface FilterOptions {
  category?: CategorySlug | 'all';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  collectionTab?: CollectionTabFilter;
  onlyInStock?: boolean;
}

export function filterAndSortProducts(products: Product[], options: FilterOptions): Product[] {
  const {
    category = 'all',
    searchQuery = '',
    minPrice = 0,
    maxPrice = Infinity,
    sortBy = 'featured',
    collectionTab = 'all',
    onlyInStock = false,
  } = options;

  const q = searchQuery.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (category !== 'all') {
      const inCat = p.category === category || p.collections.includes(category);
      if (!inCat) return false;
    }

    if (collectionTab === 'bestsellers' && !p.isBestseller) return false;
    if (collectionTab === 'new-arrivals' && !p.isNewArrival) return false;
    if (collectionTab === 'discounted' && getDiscountPercent(p.price, p.originalPrice) === 0) {
      return false;
    }

    if (onlyInStock && p.availability !== 'In Stock') return false;

    if (p.price < minPrice || p.price > maxPrice) return false;

    if (q.length > 0) {
      const hay = `${p.name} ${p.description} ${p.category.replace(/-/g, ' ')} ${p.skillLevel}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });

  const sorted = [...filtered];
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'discount-desc':
      sorted.sort(
        (a, b) =>
          getDiscountPercent(b.price, b.originalPrice) -
          getDiscountPercent(a.price, a.originalPrice)
      );
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => Number(Boolean(b.isBestseller)) - Number(Boolean(a.isBestseller)));
      break;
  }

  return sorted;
}

export interface CartCalculation {
  itemCount: number;
  subtotal: number;
  totalSavings: number;
  shippingCost: number | null;
  totalEstimated: number;
  hasAirRestrictedItems: boolean;
}

export function calculateCartTotals(
  items: CartItem[],
  products: Product[],
  shippingMethodId: ShippingMethodId
): CartCalculation {
  let itemCount = 0;
  let subtotal = 0;
  let totalSavings = 0;
  let hasAirRestrictedItems = false;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || item.quantity <= 0) continue;

    itemCount += item.quantity;
    subtotal += product.price * item.quantity;
    if (product.originalPrice && product.originalPrice > product.price) {
      totalSavings += (product.originalPrice - product.price) * item.quantity;
    }
    if (product.airParcelRestricted) {
      hasAirRestrictedItems = true;
    }
  }

  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === shippingMethodId);
  const shippingCost = items.length === 0 ? 0 : shippingMethod ? shippingMethod.cost : 150;
  const totalEstimated = subtotal + (shippingCost ?? 0);

  return {
    itemCount,
    subtotal,
    totalSavings,
    shippingCost,
    totalEstimated,
    hasAirRestrictedItems,
  };
}

export function validateCheckoutForm(data: CheckoutFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) {
    errors.phone = 'Please enter a valid 10–14 digit mobile number.';
  }

  if (data.shippingMethod !== 'pickup') {
    if (!data.addressLine1.trim() || data.addressLine1.trim().length < 5) {
      errors.addressLine1 = 'Please enter your street / house delivery address.';
    }
    if (!data.city.trim()) {
      errors.city = 'Please enter your city.';
    }
    if (!data.state.trim()) {
      errors.state = 'Please select or enter your state / region.';
    }
    if (!data.postalCode.trim() || data.postalCode.trim().length < 4) {
      errors.postalCode = 'Please enter a valid PIN / postal code.';
    }
  }

  return errors;
}

export function validateEnquiryForm(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = 'Full name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }
  const digits = data.phone.replace(/\D/g, '');
  if (digits.length < 10) errors.phone = 'Please provide a valid mobile number.';
  if (!data.subject.trim()) errors.subject = 'Please specify a subject.';
  if (data.message.trim().length < 10) errors.message = 'Please enter at least 10 characters.';
  return errors;
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
