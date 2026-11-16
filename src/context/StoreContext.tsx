import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProductById, PRODUCTS } from '../data/catalog';
import {
  CartItem,
  CheckoutFormData,
  EnquiryRecord,
  OrderRequest,
  Product,
  ShippingMethodId,
  UserProfile,
} from '../types/store';
import { calculateCartTotals, CartCalculation } from '../utils/store';

interface StoreContextValue {
  currentPath: string;
  navigate: (path: string) => void;
  cart: CartItem[];
  cartTotals: CartCalculation;
  addToCart: (productId: string, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  shippingMethod: ShippingMethodId;
  setShippingMethod: (method: ShippingMethodId) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  recentlyViewed: string[];
  trackRecentlyViewed: (productId: string) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  profile: UserProfile;
  signIn: (name: string, email: string, phone?: string) => void;
  signOut: () => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  orderRequests: OrderRequest[];
  submitOrderRequest: (customer: CheckoutFormData) => OrderRequest;
  enquiries: EnquiryRecord[];
  submitEnquiry: (data: Omit<EnquiryRecord, 'id' | 'createdAt'>) => EnquiryRecord;
  newsletterSubscribers: string[];
  subscribeNewsletter: (email: string) => boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEYS = {
  cart: 'dms_cart_v1',
  wishlist: 'dms_wishlist_v1',
  recent: 'dms_recent_v1',
  shipping: 'dms_shipping_v1',
  profile: 'dms_profile_v1',
  orders: 'dms_orders_v1',
  enquiries: 'dms_enquiries_v1',
  newsletter: 'dms_newsletter_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: 'Delhi (NCR)',
  addressLine1: '',
  postalCode: '',
  signedIn: false,
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname + window.location.search || '/';
  });

  const [cart, setCart] = useState<CartItem[]>(() => readStorage(STORAGE_KEYS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => readStorage(STORAGE_KEYS.wishlist, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.recent, [])
  );
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>(() =>
    readStorage(STORAGE_KEYS.shipping, 'india-standard')
  );
  const [profile, setProfile] = useState<UserProfile>(() =>
    readStorage(STORAGE_KEYS.profile, DEFAULT_PROFILE)
  );
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>(() =>
    readStorage(STORAGE_KEYS.orders, [])
  );
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() =>
    readStorage(STORAGE_KEYS.enquiries, [])
  );
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.newsletter, [])
  );

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recentlyViewed));
    } catch {
      // ignore
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.shipping, JSON.stringify(shippingMethod));
    } catch {
      // ignore
    }
  }, [shippingMethod]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orderRequests));
    } catch {
      // ignore
    }
  }, [orderRequests]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.enquiries, JSON.stringify(enquiries));
    } catch {
      // ignore
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.newsletter, JSON.stringify(newsletterSubscribers));
    } catch {
      // ignore
    }
  }, [newsletterSubscribers]);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const navigate = useCallback((path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', normalized);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
    setCurrentPath(normalized);
    setSearchOpen(false);
    setQuickViewProduct(null);
  }, []);

  const addToCart = useCallback(
    (productId: string, quantity = 1, openDrawer = true) => {
      const prod = getProductById(productId);
      if (!prod) return;
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
              : item
          );
        }
        return [...prev, { productId, quantity: Math.max(1, quantity) }];
      });
      if (openDrawer) {
        setCartDrawerOpen(true);
      } else {
        showToast(`Added "${prod.name}" to your shopping cart.`);
      }
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(99, quantity) } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const prod = getProductById(productId);
      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          if (prod) showToast(`Removed "${prod.name}" from Wishlist.`);
          return prev.filter((id) => id !== productId);
        }
        if (prod) showToast(`Saved "${prod.name}" to Wishlist.`);
        return [productId, ...prev];
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const trackRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)];
      return next.slice(0, 8);
    });
  }, []);

  const signIn = useCallback(
    (name: string, email: string, phone = '') => {
      setProfile((prev) => ({
        ...prev,
        name: name.trim() || prev.name || 'Magician Customer',
        email: email.trim(),
        phone: phone.trim() || prev.phone,
        signedIn: true,
      }));
      showToast(`Signed in as ${email.trim()}`);
    },
    [showToast]
  );

  const signOut = useCallback(() => {
    setProfile((prev) => ({ ...prev, signedIn: false }));
    showToast('Signed out of your account.');
  }, [showToast]);

  const updateProfile = useCallback(
    (partial: Partial<UserProfile>) => {
      setProfile((prev) => ({ ...prev, ...partial }));
      showToast('Account details updated.');
    },
    [showToast]
  );

  const cartTotals = useMemo(
    () => calculateCartTotals(cart, PRODUCTS, shippingMethod),
    [cart, shippingMethod]
  );

  const submitOrderRequest = useCallback(
    (customer: CheckoutFormData): OrderRequest => {
      const resolvedItems = cart
        .map((c) => {
          const p = getProductById(c.productId);
          if (!p) return null;
          return {
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: c.quantity,
            image: p.image,
          };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      const totals = calculateCartTotals(cart, PRODUCTS, customer.shippingMethod);
      const request: OrderRequest = {
        requestId: `DMS-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        items: resolvedItems,
        subtotal: totals.subtotal,
        shippingCost: totals.shippingCost,
        totalEstimated: totals.totalEstimated,
        customer,
        status: 'Pending Payment Verification',
      };

      setOrderRequests((prev) => [request, ...prev]);
      setCart([]);
      setShippingMethod(customer.shippingMethod);
      return request;
    },
    [cart]
  );

  const submitEnquiry = useCallback((data: Omit<EnquiryRecord, 'id' | 'createdAt'>): EnquiryRecord => {
    const record: EnquiryRecord = {
      ...data,
      id: `ENQ-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    setEnquiries((prev) => [record, ...prev]);
    return record;
  }, []);

  const subscribeNewsletter = useCallback((email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return false;
    setNewsletterSubscribers((prev) => (prev.includes(clean) ? prev : [clean, ...prev]));
    return true;
  }, []);

  const value: StoreContextValue = {
    currentPath,
    navigate,
    cart,
    cartTotals,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    shippingMethod,
    setShippingMethod,
    wishlist,
    toggleWishlist,
    isWishlisted,
    recentlyViewed,
    trackRecentlyViewed,
    cartDrawerOpen,
    setCartDrawerOpen,
    quickViewProduct,
    setQuickViewProduct,
    searchOpen,
    setSearchOpen,
    profile,
    signIn,
    signOut,
    updateProfile,
    orderRequests,
    submitOrderRequest,
    enquiries,
    submitEnquiry,
    newsletterSubscribers,
    subscribeNewsletter,
    toastMessage,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
