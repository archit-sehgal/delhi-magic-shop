import { ShippingMethod, Testimonial } from '../types/store';

export const BUSINESS_INFO = {
  brandName: 'Delhi Magic Shop',
  legalEntity: 'Ira Magic Impex',
  establishedYear: 2002,
  directorName: 'Sumit Kharbanda',
  directorTitle: 'Director & Manager',
  address: {
    line1: 'M-7, Mahavir Bhawan, Commercial Complex',
    line2: 'Karampura, New Delhi',
    state: 'Delhi',
    postalCode: '110015',
    country: 'India',
    full: 'M-7, Mahavir Bhawan, Commercial Complex, Karampura, New Delhi, Delhi, India - 110015',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=M-7,+Mahavir+Bhawan,+Commercial+Complex,+Karampura,+New+Delhi,+110015',
  },
  phones: ['+91-9654162641', '+91-9910406619'],
  whatsappNumber: '919654162641',
  whatsappDisplay: '+91-9654162641',
  emails: ['info@delhimagicshop.com', 'delhimagicshop@gmail.com'],
  social: {
    facebook: 'https://www.facebook.com/delhimagicshopindia/',
    instagram: 'https://www.instagram.com/delhimagicshop/',
    youtube: 'https://www.youtube.com/@delhimagicshopindia',
  },
  storeHours: 'Monday – Saturday, 11:00 AM – 7:30 PM IST',
};

export const ANNOUNCEMENTS = [
  'Explore Magic Products from Across the World',
  'Discover New Tricks and Professional Magic Props',
  'Shop Magic Products Online · Established 2002 in New Delhi',
];

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaPath: string;
  secondaryLabel: string;
  secondaryPath: string;
  image: string;
  imageFit?: 'cover' | 'contain';
  featuredProductSlug: string;
  featuredLabel: string;
  featuredPrice: number;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-head-off',
    eyebrow: 'Featured Illusion Show Prop',
    title: 'Head Off — Stage Illusion.',
    subtitle:
      'An astonishing stage and parlour illusion where a performer’s head seemingly disappears right before the audience.',
    ctaLabel: 'Shop Head Off',
    ctaPath: '/product/head-off',
    secondaryLabel: 'Illusion Show Items',
    secondaryPath: '/category/illusion-show-items',
    image: '/assets/aistudio/image_35fc712c.png',
    imageFit: 'contain',
    featuredProductSlug: 'head-off',
    featuredLabel: 'Head Off',
    featuredPrice: 9000,
  },
  {
    id: 'slide-shocking-chair',
    eyebrow: 'Comedy & Stage Favorite',
    title: 'Comedy Shocking Chair.',
    subtitle:
      'A lightweight foldable shocking chair for stage and comedy performers—built for hilarious live audience reactions.',
    ctaLabel: 'Shop Shocking Chair',
    ctaPath: '/product/comedy-shocking-chair',
    secondaryLabel: 'Explore Comedy Magic',
    secondaryPath: '/category/comedy-magic',
    image: '/assets/aistudio/image_725cd069.png',
    imageFit: 'contain',
    featuredProductSlug: 'comedy-shocking-chair',
    featuredLabel: 'Comedy Shocking Chair',
    featuredPrice: 16500,
  },
  {
    id: 'slide-cards',
    eyebrow: 'Card Magic & Close-Up Studio',
    title: 'Discover the Art of Magic.',
    subtitle:
      'Explore authentic Bee & Bicycle playing cards and precision close-up apparatus crafted for hobbyists and working magicians.',
    ctaLabel: 'Explore Card & Close-Up',
    ctaPath: '/category/card-magic-tricks',
    secondaryLabel: 'Shop All Products',
    secondaryPath: '/shop',
    image: '/src/assets/images/hero_light_card_closeup_1794832106722.jpg',
    imageFit: 'cover',
    featuredProductSlug: 'bee-playing-cards',
    featuredLabel: 'Bee Playing Cards',
    featuredPrice: 550,
  },
  {
    id: 'slide-mentalism',
    eyebrow: 'Professional Mentalism & Mind Reading',
    title: 'Wallets, Slates & Force Bags.',
    subtitle:
      'Deliver impossible mind-reading moments with peek wallets, 3-Way Ultimate Force Bags, Vernet slate writers, and electronic gear.',
    ctaLabel: 'Shop Mentalism Props',
    ctaPath: '/category/mentalism-magic',
    secondaryLabel: 'Hot Selling Props',
    secondaryPath: '/category/hot-selling-magic',
    image: '/src/assets/images/hero_light_mentalism_props_1794832107853.jpg',
    imageFit: 'cover',
    featuredProductSlug: '3-way-ultimate-force-bag',
    featuredLabel: '3-Way Ultimate Force Bag',
    featuredPrice: 2900,
  },
];

export const PROMO_SPOTLIGHTS: {
  title: string;
  subtitle: string;
  path: string;
  image: string;
  imageFit?: 'cover' | 'contain';
}[] = [
  {
    title: 'Head Off — Stage Illusion',
    subtitle: '₹9,000 · Bestselling Disappearing Head Act',
    path: '/product/head-off',
    image: '/assets/aistudio/image_35fc712c.png',
    imageFit: 'contain',
  },
  {
    title: 'Comedy Shocking Chair',
    subtitle: '₹16,500 · Foldable Live Comedy Stage Prop',
    path: '/product/comedy-shocking-chair',
    image: '/assets/aistudio/image_725cd069.png',
    imageFit: 'contain',
  },
  {
    title: 'Bee & Bicycle Playing Cards',
    subtitle: 'Standard, Svengali, Double Back & Forcing Decks',
    path: '/category/card-magic-tricks',
    image: '/src/assets/images/prod_light_cards_gimmicks_1794832108129.jpg',
  },
  {
    title: 'Brass Magic Lamps & Bags',
    subtitle: 'Classic Stage & Parlour Production Staples',
    path: '/category/classic-magic-items',
    image: '/src/assets/images/prod_light_brass_lamp_bag_1794832108405.jpg',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-anil',
    name: 'Anil Kapoor',
    role: 'Customer',
    quote:
      'I visited Delhi Magic Shop looking for a unique gift, and I was blown away by the variety and quality of magical products they offer. The staff was incredibly knowledgeable and helped me find the perfect magic trick to amaze my friends. Highly recommend for anyone interested in magic.',
  },
  {
    id: 't-ritika',
    name: 'Ritika Sharma',
    role: 'Customer',
    quote:
      'The team at Delhi Magic Shop is truly professional. They took the time to guide me through their extensive collection of magic props and taught me some beginner tricks. It’s now my go-to place for everything magic-related. The service is excellent and the products are top-notch.',
  },
  {
    id: 't-rajeev',
    name: 'Rajeev Mehta',
    role: 'Performing Magician',
    quote:
      'I’ve been practicing magic for years, and I’ve found that Delhi Magic Shop has one of the best selections of magic props in the city. From cards to stage illusions, they have everything you need. I’ve bought several items, and each one is of exceptional quality!',
  },
  {
    id: 't-pooja',
    name: 'Pooja Gupta',
    role: 'Magic Enthusiast',
    quote:
      'As someone who is just starting out with magic, I was a bit overwhelmed by all the options out there. The staff at Delhi Magic Shop made me feel comfortable and helped me pick beginner-friendly tricks. They also offer great advice on how to perform them. I’m hooked!',
  },
  {
    id: 't-vikram',
    name: 'Vikram Chauhan',
    role: 'Long-Term Customer',
    quote:
      'I’ve been into magic for a long time, and Delhi Magic Shop has been my go-to source for high-quality magic supplies. The props I’ve purchased from them have always been durable, easy to use, and really professional. I’ll continue to be a loyal customer.',
  },
  {
    id: 't-manoj',
    name: 'Manoj Yadav',
    role: 'Magician & Collector',
    quote:
      'Delhi Magic Shop is a magical wonderland! The variety of magic tricks, props, and accessories is incredible. I always find something new to try. The quality of the products is unmatched, and the advice I get is invaluable. This shop is a must-visit for anyone serious about magic.',
  },
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'india-standard',
    label: 'India Courier / Speed Post',
    timeline: 'Processed in 2 business days · 3–7 days delivery',
    cost: 150,
    note: 'Standard insured courier or India Post Speed Post across serviceable Indian PIN codes.',
  },
  {
    id: 'india-express',
    label: 'Express Domestic Air Courier',
    timeline: 'Processed in 2 business days · 2–3 days metro delivery',
    cost: 290,
    note: 'Priority dispatch for non-battery, non-liquid magic props.',
  },
  {
    id: 'pickup',
    label: 'Karampura Showroom Pickup (New Delhi)',
    timeline: 'Ready after confirmation · Mon–Sat 11 AM–7:30 PM',
    cost: 0,
    note: 'Collect directly from M-7, Mahavir Bhawan, Commercial Complex, Karampura, New Delhi - 110015.',
  },
  {
    id: 'international',
    label: 'International Courier (DHL / FedEx / Foreign Post)',
    timeline: '10–12 days Air Parcel · up to 30 days via Sea',
    cost: null,
    note: 'Final international freight is calculated by parcel weight and shared via Email & WhatsApp before payment.',
  },
];

export const SERVICE_AREAS_INDIA = [
  'Andhra Pradesh',
  'Chandigarh',
  'Delhi (NCR)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const SERVICE_AREAS_INTERNATIONAL = [
  'Australia',
  'Brazil',
  'Canada',
  'Denmark',
  'Finland',
  'France',
  'Germany',
  'Ghana',
  'Hong Kong',
  'Ireland',
  'Italy',
  'Kuwait',
  'Malaysia',
  'Mauritius',
  'Netherlands',
  'Norway',
  'Poland',
  'Qatar',
  'Singapore',
  'South Africa',
  'Sweden',
  'Thailand',
  'Turkey',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
];

export const ABOUT_COPY = {
  headline: 'Over Two Decades of Bringing Magic to Life.',
  summary:
    'Established in 2002 and managed by Director Sumit Kharbanda under Ira Magic Impex, Delhi Magic Shop is one of India’s premier destinations, exporters, and suppliers of professional magic products.',
  paragraphs: [
    'Welcome to the Biggest Magic Shop in India — Delhi Magic Shop. We bring to you a wide variety of magic products for both working professionals and magic learners.',
    'Established in 2002, we have been serving the global magic community as a trusted exporter and trader of high-quality magic equipment. Under the stewardship of owner and Director Sumit Kharbanda, our mission is to provide the latest and most updated magic products to performers worldwide.',
    'Our extensive catalogue spans classic traditional tricks, intimate close-up apparatus, cutting-edge electronic mentalism, card magic decks, children’s party props, and grand stage illusions—alongside instructional materials to help magicians at every stage perform with confidence.',
    'From our showroom in Karampura, New Delhi, our knowledgeable team offers personal product guidance so every hobbyist, collector, and stage illusionist finds the exact prop to match their performance style.',
  ],
};

export const POLICY_CONTENT = {
  shipping: [
    {
      title: '1. Shipping Destinations & Restrictions',
      body: 'We ship to most serviceable locations within India. International shipping is available for select products and countries via DHL, FedEx International, or India Post Foreign Post Office depending on parcel weight. Please note that products operating on batteries or containing liquid materials cannot be dispatched via air parcel—contact us prior to ordering for alternative logistics.',
    },
    {
      title: '2. Processing Time',
      body: 'Orders are processed within two (2) business days after payment confirmation. Orders submitted on weekends or public holidays are processed on the next working business day.',
    },
    {
      title: '3. Delivery Timelines',
      body: 'Speed Post / domestic courier within India generally takes 3 days to reach major destinations, whereas regular post takes up to 7 days. International couriers typically require 10–12 days for air parcels and up to 30 days via sea freight. Unforeseen weather, customs clearance, or carrier disruptions remain outside our direct control, though our team monitors dispatches closely.',
    },
    {
      title: '4. Shipping Charges',
      body: 'Shipping charges vary based on destination, volumetric parcel weight, and order composition. For international or oversized stage-illusion consignments, final shipping costs are confirmed directly via your email ID or WhatsApp prior to dispatch.',
    },
  ],
  returns: [
    {
      title: '1. Return & Replacement Eligibility',
      body: 'Eligible products may be returned or replaced within three (3) days of delivery. Returned items must be unused, undamaged, and sent back in their original packaging with all tags, gimmicks, and accessories intact. Customized orders, perishable goods, and items marked non-returnable at purchase are exempt.',
    },
    {
      title: '2. Unboxing Video & Claim Process',
      body: 'To initiate a return or replacement, contact our support desk at +91-9910406619 or delhimagicshop@gmail.com with your order details and reason. Customers are required to record a continuous phone video while opening the parcel or showing any damaged item and share it with our team for verification.',
    },
    {
      title: '3. Damaged or Defective Deliveries',
      body: 'Any damaged or defective item received must be reported within 48 hours of delivery along with the parcel unboxing video so we can arrange an appropriate replacement or refund.',
    },
    {
      title: '4. Return Shipping & Refunds',
      body: 'Once your return request is approved, return instructions will be shared. Customers bear return shipping expenses using a trackable service unless the return results from an error on our part. After the returned item passes inspection, refunds are issued to the original payment method within five (5) business days (initial shipping charges are non-refundable unless our error).',
    },
  ],
  payment: [
    {
      title: 'Accepted Indian & International Payment Channels',
      body: 'Delhi Magic Shop (operated under Ira Magic Impex) supports verified third-party digital payment channels including UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit Cards (Visa, Mastercard, RuPay), and NetBanking.',
    },
    {
      title: 'Fraud Protection & Data Security',
      body: 'All payments are processed through trusted, encrypted third-party payment gateways. Delhi Magic Shop does not store sensitive card numbers, CVV codes, or banking credentials on our servers.',
    },
    {
      title: 'Order Confirmation & Direct Payment Assistance',
      body: 'For large stage illusions, international DHL/FedEx consignments, or custom prop inquiries, our order desk (+91-9654162641 / info@delhimagicshop.com) verifies stock availability and shares an official payment link once freight is confirmed.',
    },
  ],
  privacy: [
    {
      title: '1. Information We Collect',
      body: 'When you browse or submit an order inquiry with Delhi Magic Shop, we collect essential contact and delivery details such as your full name, email address, mobile number, billing/shipping address, and order notes.',
    },
    {
      title: '2. How Your Data Is Used',
      body: 'Your information is used solely to verify product availability, coordinate shipping and delivery, provide customer support, and send newsletter updates if you explicitly opt in.',
    },
    {
      title: '3. Payment Security & Third Parties',
      body: 'Payment processing is handled exclusively through trusted third-party gateways. We never sell or share your personal details with unrelated third parties, sharing information only with logistics partners (such as DHL, FedEx, or India Post) necessary to fulfill your delivery or when required by applicable law.',
    },
    {
      title: '4. Your Rights & Cookies',
      body: 'Cookies and local browser storage help preserve your shopping cart, wishlist, and recently viewed items. You may manage cookies via browser settings or request access, updates, or deletion of your customer details by emailing info@delhimagicshop.com.',
    },
  ],
  terms: [
    {
      title: '1. General & Eligibility',
      body: 'Ira Magic Impex operates Delhi Magic Shop and provides magic props, illusions, and instructional accessories. By browsing this website or placing an order inquiry, you confirm that you are at least 18 years of age or accessing with parental or guardian consent.',
    },
    {
      title: '2. Product Availability & Descriptions',
      body: 'We strive to ensure product descriptions, pricing in INR, and visual representations are accurate. Slight variations in finish, colour, or packaging may occur across manufacturer batches. All orders remain subject to physical stock verification.',
    },
    {
      title: '3. Orders, Pricing & Right to Cancel',
      body: 'Delhi Magic Shop reserves the right to verify stock, confirm applicable domestic or international freight charges, or decline/cancel an order inquiry prior to final dispatch in the event of inventory unavailability or pricing discrepancy.',
    },
    {
      title: '4. Intellectual Property',
      body: 'All website text, branding, original prop documentation, and creative assets remain the intellectual property of Ira Magic Impex / Delhi Magic Shop and may not be reproduced commercially without prior written consent.',
    },
  ],
};
