export type CategorySlug =
  | 'close-up-magic'
  | 'mentalism-magic'
  | 'card-magic-tricks'
  | 'stage-magic'
  | 'birthday-party-magic'
  | 'comedy-magic'
  | 'magic-for-beginners'
  | 'illusion-show-items'
  | 'classic-magic-items'
  | 'hot-selling-magic';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  shortLabel: string;
  description: string;
  image: string;
  featuredOnHome: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  collections: CategorySlug[];
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  description: string;
  specifications?: { label: string; value: string }[];
  availability: 'In Stock' | 'Limited Stock' | 'Made to Order';
  isBestseller?: boolean;
  isNewArrival?: boolean;
  skillLevel: 'Beginner' | 'Intermediate' | 'Professional' | 'All Levels';
  airParcelRestricted?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type ShippingMethodId = 'pickup' | 'india-standard' | 'india-express' | 'international';

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  timeline: string;
  cost: number | null; // null means quoted after order review per store policy
  note: string;
}

export type PaymentMethodId = 'upi' | 'card' | 'netbanking' | 'desk';

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
}

export interface OrderRequest {
  requestId: string;
  createdAt: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingCost: number | null;
  totalEstimated: number;
  customer: CheckoutFormData;
  status: 'Pending Payment Verification';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  addressLine1: string;
  postalCode: string;
  signedIn: boolean;
}

export interface EnquiryRecord {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
