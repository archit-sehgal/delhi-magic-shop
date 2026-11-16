import { MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';
import { getProductBySlug } from '../data/catalog';
import { buildWhatsAppUrl } from '../utils/store';

export function WhatsAppWidget() {
  const { currentPath } = useStore();
  const [open, setOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');

  const productSlugMatch = currentPath.match(/^\/product\/([^/?]+)/);
  const activeProduct = productSlugMatch ? getProductBySlug(productSlugMatch[1]) : undefined;
  const defaultInquiry = activeProduct
    ? `Hello Delhi Magic Shop, I would like to enquire about "${activeProduct.name}" (${activeProduct.slug}).`
    : 'Hello Delhi Magic Shop, I need assistance selecting magic products.';

  const targetHref = buildWhatsAppUrl(customMessage.trim() || defaultInquiry);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div
          className="w-80 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl space-y-3"
          role="dialog"
          aria-label="WhatsApp Product Assistance"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-bold text-[#121A25]">WhatsApp Store Assistance</div>
              <div className="text-xs text-slate-500 font-mono">
                {BUSINESS_INFO.whatsappDisplay}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close WhatsApp assistant"
              className="p-1 text-slate-400 hover:text-[#121A25] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Ask our Karampura team about prop sizing, shipping quotes, or skill recommendations before you purchase.
          </p>

          <div>
            <label htmlFor="wa-message-input" className="sr-only">
              Your WhatsApp message
            </label>
            <textarea
              id="wa-message-input"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={defaultInquiry}
              className="w-full rounded-lg bg-[#F8FAFC] border border-slate-300 p-2.5 text-xs text-[#121A25] placeholder:text-slate-400 focus:outline-none focus:border-[#16A34A]"
            />
          </div>

          <a
            href={targetHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            Continue on WhatsApp
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="WhatsApp assistance"
        aria-expanded={open}
        className="inline-flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:h-11 sm:px-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline whitespace-nowrap">WhatsApp Help</span>
      </button>
    </div>
  );
}
