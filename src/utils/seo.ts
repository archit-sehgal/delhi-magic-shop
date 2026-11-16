import { useEffect } from 'react';
import { Product } from '../types/store';

export function usePageSeo(title: string, description: string, product?: Product) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);

    const existing = document.getElementById('dynamic-product-ld');
    if (existing) existing.remove();

    if (product) {
      const script = document.createElement('script');
      script.id = 'dynamic-product-ld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        sku: product.id,
        category: product.category.replace(/-/g, ' '),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: String(product.price),
          availability:
            product.availability === 'In Stock'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/LimitedAvailability',
        },
      });
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('dynamic-product-ld');
      if (el) el.remove();
    };
  }, [title, description, product]);
}
