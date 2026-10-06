import { useEffect, useState, useCallback } from 'react';
import { getPropertyContactInfo } from '../data/footerContent';

function EnquiryModal({ open, isOpen, onClose, propertyTitle, propertyId }) {
  const [localOpen, setLocalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');

  const isModalOpen = open ?? isOpen ?? localOpen;
  const activeTitle = propertyTitle || eventTitle;
  const [copied, setCopied] = useState(false);
  const activeContact = getPropertyContactInfo(activeTitle);

  const handleCloseModal = useCallback(() => {
    setLocalOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  // Listen for global custom event to trigger modal anywhere
  useEffect(() => {
    const handleGlobalOpen = (e) => {
      setEventTitle(e?.detail?.title || e?.detail?.propertyTitle || '');
      setLocalOpen(true);
    };
    window.addEventListener('onevishwam:open_enquiry_modal', handleGlobalOpen);
    return () => window.removeEventListener('onevishwam:open_enquiry_modal', handleGlobalOpen);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e) => { if (e.key === 'Escape') handleCloseModal(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, handleCloseModal]);

  useEffect(() => {
    if (!isModalOpen) setCopied(false);
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const copyPhone = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeContact.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={handleCloseModal}>
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-brand-navy to-brand-blue px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-amber-400" /> Contact & Visit Details
              </h2>
              {activeTitle && (
                <p className="mt-1 text-xs text-white/80 line-clamp-2">{activeTitle}</p>
              )}
            </div>
            <button
              onClick={handleCloseModal}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">
            Visit our office or get in touch with our {activeContact.brandName} team for pricing, plot visits, and legal documentation.
          </p>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Direct Contact</p>
                <p className="text-base font-bold text-brand-charcoal mt-0.5">{activeContact.phone}</p>
              </div>
              <button
                type="button"
                onClick={copyPhone}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-blue text-white hover:bg-brand-navy'}`}
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Office Location</p>
            <p className="text-sm font-semibold text-brand-charcoal mt-1">
              <i className="fa-solid fa-location-dot text-brand-blue mr-1.5" />
              {activeContact.location}
            </p>
          </div>

          <a
            href={`https://wa.me/${activeContact.whatsapp}${activeTitle ? `?text=${encodeURIComponent(`Hi, I would like to visit and enquire about ${activeTitle}.`)}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 text-sm font-bold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <i className="fa-brands fa-whatsapp text-base" /> Chat on WhatsApp
          </a>

          <button
            type="button"
            onClick={handleCloseModal}
            className="w-full rounded-xl border border-gray-200 text-gray-600 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnquiryModal;