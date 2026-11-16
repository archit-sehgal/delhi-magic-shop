import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../data/catalog';
import {
  calculateCartTotals,
  filterAndSortProducts,
  formatINR,
  getDiscountPercent,
  validateCheckoutForm,
  validateEnquiryForm,
} from './store';

test('formatINR formats Indian Rupee values cleanly without decimals', () => {
  assert.equal(formatINR(38000), '₹38,000');
  assert.equal(formatINR(1250), '₹1,250');
  assert.equal(formatINR(550), '₹550');
});

test('getDiscountPercent calculates accurate rounded savings percentage', () => {
  assert.equal(getDiscountPercent(38000, 42000), 10);
  assert.equal(getDiscountPercent(1250, 2000), 38);
  assert.equal(getDiscountPercent(400, 400), 0);
  assert.equal(getDiscountPercent(500, undefined), 0);
});

test('filterAndSortProducts filters by category, search, price, and sorts accurately', () => {
  const mentalism = filterAndSortProducts(PRODUCTS, {
    category: 'mentalism-magic',
    sortBy: 'price-asc',
  });
  assert.ok(mentalism.length >= 5);
  assert.ok(mentalism[0].price <= mentalism[1].price);

  const searchMatches = filterAndSortProducts(PRODUCTS, {
    searchQuery: 'Slate Writer',
  });
  assert.ok(searchMatches.some((p) => p.name.includes('Slate Writer')));

  const discountedOnly = filterAndSortProducts(PRODUCTS, {
    collectionTab: 'discounted',
    sortBy: 'discount-desc',
  });
  assert.ok(discountedOnly.length > 0);
  assert.ok(
    getDiscountPercent(discountedOnly[0].price, discountedOnly[0].originalPrice) >=
      getDiscountPercent(discountedOnly[1].price, discountedOnly[1].originalPrice)
  );
});

test('calculateCartTotals computes subtotal, savings, shipping, and air-parcel flags', () => {
  const totals = calculateCartTotals(
    [
      { productId: 'dms-101', quantity: 1 }, // 38000 (orig 42000 -> 4000 savings)
      { productId: 'dms-105', quantity: 1 }, // Comedy Shocking Chair 16500 (orig 17700 -> 1200 savings, airRestricted)
    ],
    PRODUCTS,
    'india-standard'
  );

  assert.equal(totals.itemCount, 2);
  assert.equal(totals.subtotal, 54500);
  assert.equal(totals.totalSavings, 5200);
  assert.equal(totals.shippingCost, 150);
  assert.equal(totals.totalEstimated, 54650);
  assert.equal(totals.hasAirRestrictedItems, true);

  const intlTotals = calculateCartTotals(
    [{ productId: 'dms-107', quantity: 2 }],
    PRODUCTS,
    'international'
  );
  assert.equal(intlTotals.shippingCost, null);
  assert.equal(intlTotals.totalEstimated, 1100);
});

test('validateCheckoutForm rejects missing required fields and passes valid orders', () => {
  const bad = validateCheckoutForm({
    fullName: '',
    email: 'not-an-email',
    phone: '123',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: '',
    shippingMethod: 'india-standard',
    paymentMethod: 'upi',
  });
  assert.ok(bad.fullName);
  assert.ok(bad.email);
  assert.ok(bad.phone);
  assert.ok(bad.addressLine1);

  const goodPickup = validateCheckoutForm({
    fullName: 'Aarav Verma',
    email: 'aarav@example.com',
    phone: '+91 9811122334',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: '',
    shippingMethod: 'pickup',
    paymentMethod: 'upi',
  });
  assert.deepEqual(goodPickup, {});
});

test('validateEnquiryForm enforces complete contact details', () => {
  const err = validateEnquiryForm({
    name: '',
    email: 'bad',
    phone: '99',
    subject: '',
    message: 'hi',
  });
  assert.equal(Object.keys(err).length, 5);

  const ok = validateEnquiryForm({
    name: 'Kabir',
    email: 'kabir@example.com',
    phone: '9654162641',
    subject: 'Stage Prop Inquiry',
    message: 'Looking for availability on Auto Lit Dove Table.',
  });
  assert.deepEqual(ok, {});
});
