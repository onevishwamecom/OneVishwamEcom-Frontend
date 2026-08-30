import { useEffect, useState } from 'react';
import { getPropertyContactInfo } from '../data/footerContent';

function EnquiryModal({ open, onClose, propertyTitle }) {
  const [copied, setCopied] = useState(false);
  const activeContact = getPropertyContactInfo(propertyTitle);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(activeContact.phoneRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-brand-navy to-brand-blue px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <i className="fa-solid fa-paper-plane" /> Enquire Now
              </h2>
              {propertyTitle && (
                <p className="mt-1 text-xs text-white/80 line-clamp-2">{propertyTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Our {activeContact.brandName} team will help you with this property. Reach us on the official contact number below.
          </p>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-phone text-brand-blue text-sm" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                  <a href={`tel:${activeContact.phoneTel}`} className="text-base font-bold text-brand-charcoal hover:text-brand-blue transition-colors">
                    {activeContact.phoneDisplay}
                  </a>
                </div>
              </div>
              <button
                onClick={copyPhone}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-blue text-white hover:bg-brand-navy'}`}
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-envelope text-emerald-600 text-sm" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                <a href={`mailto:${activeContact.email}`} className="text-sm font-bold text-brand-charcoal hover:text-brand-blue transition-colors break-all">
                  {activeContact.email}
                </a>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${activeContact.whatsapp}${propertyTitle ? `?text=${encodeURIComponent(`Hi, I would like to enquire about ${propertyTitle}.`)}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 text-sm font-bold hover:bg-emerald-700 transition-colors"
          >
            <i className="fa-brands fa-whatsapp" /> Chat on WhatsApp
          </a>

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 text-gray-600 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiryModal;