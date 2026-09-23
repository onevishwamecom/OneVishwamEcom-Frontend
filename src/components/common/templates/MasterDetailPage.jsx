import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import EnquiryModal from '../../EnquiryModal';
import CategoryListingCard from './CategoryListingCard';
import oneVishwamLogo from '../../../assets/logo.png';
import { contactInfo, getPropertyContactInfo } from '../../../data/footerContent';
import { cleanProductName } from '../../../utils/searchUtils';

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL
  ? new URL(import.meta.env.VITE_API_BASE_URL).origin
  : `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5001`;

function resolveImage(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  if (src.startsWith('/assets/') || src.startsWith('/src/assets/')) return src;
  return `${API_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`;
}

const DEFAULT_FEATURE_ICONS = {
  'Swimming Pool': 'fa-person-swimming',
  '24×7 Security': 'fa-shield-halved',
  '24/7 Security': 'fa-shield-halved',
  Gym: 'fa-dumbbell',
  Gymnasium: 'fa-dumbbell',
  'Power Backup': 'fa-bolt',
  'Club House': 'fa-building-flag',
  Clubhouse: 'fa-building-flag',
  Garden: 'fa-tree',
  Park: 'fa-tree',
  CCTV: 'fa-video',
  'EV Charging': 'fa-charging-station',
  'Wi-Fi': 'fa-wifi',
  'Air Conditioning': 'fa-snowflake',
  Sunroof: 'fa-sun',
  'Touchscreen Infotainment': 'fa-tablet-screen-button',
  'Reverse Camera': 'fa-video',
  'Cruise Control': 'fa-gauge-high',
  'Alloy Wheels': 'fa-circle-notch',
  'Leather Seats': 'fa-couch',
  'Keyless Entry': 'fa-key',
  'Push Button Start': 'fa-power-off',
  'Dual Airbags': 'fa-shield-heart',
  '6 Airbags': 'fa-shield-halved',
  'ABS with EBD': 'fa-car-burst',
  'Hill Hold Assist': 'fa-mountain',
  'Wireless Charger': 'fa-bolt',
  'Apple CarPlay & Android Auto': 'fa-mobile-screen',
  '4K Ultra HD': 'fa-tv',
  OLED: 'fa-display',
  'Dolby Atmos': 'fa-volume-high',
  'Dolby Vision': 'fa-film',
  '120Hz Refresh Rate': 'fa-clock-rotate-left',
  'Smart TV': 'fa-tv',
  Bluetooth: 'fa-bluetooth',
  'Voice Assistant': 'fa-microphone',
  'Orthopedic Support': 'fa-bone',
  'Memory Foam': 'fa-bed',
  'Zero Motion Transfer': 'fa-shield',
  Hypoallergenic: 'fa-heart-pulse',
  'Breathable Fabric': 'fa-wind',
  'Washable Cover': 'fa-shirt',
  '10-Year Warranty': 'fa-award',
};

function GalleryModal({ items = [], index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const current = items[index] || items[0];

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-20 cursor-pointer"
        aria-label="Close modal"
      >
        <i className="fa-solid fa-xmark text-xl" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-all z-20 shadow-lg cursor-pointer"
        aria-label="Previous image"
      >
        <i className="fa-solid fa-chevron-left text-xl" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-all z-20 shadow-lg cursor-pointer"
        aria-label="Next image"
      >
        <i className="fa-solid fa-chevron-right text-xl" />
      </button>
      <div className="absolute top-5 left-6 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white/90 text-xs font-semibold z-20">
        {index + 1} / {items.length}
      </div>
      <div className="max-h-[85vh] max-w-[92vw] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {current?.type === 'video' ? (
          <video
            src={current.url}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        ) : (
          <img
            src={resolveImage(current?.url || current)}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl select-none"
          />
        )}
      </div>
    </div>
  );
}

/**
 * MasterDetailPage
 * Master reusable detail page template extracted directly from PropertyDetails.jsx.
 * Strictly preserves 100% of the visual styling, CSS classes, typography, spacing, and DOM structure:
 * 1. Fixed floating quick-action bar on scroll past hero
 * 2. Top navigation with back link, breadcrumbs, save & share actions
 * 3. Title, badges, location line, co-branding block, price, and primary CTAs
 * 4. 5-Photo luxury mosaic gallery with fullscreen modal
 * 5. Bento key specifications highlights grid
 * 6. Overview & description block with toggle and tag pills
 * 7. Grouped technical specifications table
 * 8. Features & amenities grid
 * 9. Enterprise / Partner co-branding block
 * 10. Similar items carousel
 * 11. Mobile sticky floating bottom bar
 */
export default function MasterDetailPage({
  item,
  categoryName = 'Marketplace',
  categoryLink = '/our-services/real-estate-property',
  similarItems = [],
  itemLinkPrefix = '/property/',
  loading = false,
  error = null,
  bentoTitle = 'Key Specifications & Verified Parameters',
  featuresTitle = 'Key Features & Included Highlights',
  headerExtra = null,
  children = null,
}) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const heroRef = useRef(null);
  const similarRef = useRef(null);

  const activeId = item ? (item._id || item.id) : null;

  // Track recently viewed items in localStorage
  useEffect(() => {
    if (!item) return;
    try {
      const STORAGE_KEY = `vishwam_recently_viewed_${categoryName.toLowerCase().replace(/\s+/g, '_')}`;
      const storedJson = localStorage.getItem(STORAGE_KEY);
      let storedList = storedJson ? JSON.parse(storedJson) : [];
      if (!Array.isArray(storedList)) storedList = [];

      const filtered = storedList.filter((x) => String(x._id || x.id) !== String(activeId));
      const updated = [item, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentlyViewed(filtered.slice(0, 8));
    } catch (e) {
      console.warn('Recently viewed storage notice:', e);
    }
  }, [item, activeId, categoryName]);

  // Scroll to top on mount / change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeId]);

  // Scroll listener for sticky floating quick-action bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(categoryLink);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = item?.title || `OneVishwam ${categoryName}`;
    const text = `Check out this listing on OneVishwam: ${title}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Share API failed:', err);
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('Listing link copied to clipboard!');
    } catch {
      prompt('Copy the link manually:', url);
    }
  };

  const mediaItems = useMemo(() => {
    if (!item) return [];
    const imgs = (item.images || [item.image]).filter(Boolean).map((img) => ({ type: 'image', url: img }));
    if (item.videoUrl && typeof item.videoUrl === 'string' && item.videoUrl.trim() !== '') {
      imgs.push({ type: 'video', url: item.videoUrl });
    }
    return imgs.length > 0 ? imgs : [{ type: 'image', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80' }];
  }, [item]);

  const goPrev = useCallback(() => {
    if (!mediaItems.length) return;
    setCurrentImageIndex((i) => (i === 0 ? mediaItems.length - 1 : i - 1));
  }, [mediaItems.length]);

  const goNext = useCallback(() => {
    if (!mediaItems.length) return;
    setCurrentImageIndex((i) => (i === mediaItems.length - 1 ? 0 : i + 1));
  }, [mediaItems.length]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-blue" />
        <span className="text-sm font-medium">Loading details...</span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen pt-32 text-center bg-gray-50 px-4">
        <div className="mx-auto max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h1 className="text-xl font-bold text-brand-charcoal mb-2">Item Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">The listing you are searching for might have been sold or removed.</p>
          <button
            onClick={goBack}
            className="w-full rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-navy transition-colors cursor-pointer"
          >
            &larr; Back to {categoryName}
          </button>
        </div>
      </div>
    );
  }

  const itemTitle = cleanProductName(item.title);
  const activeContact = getPropertyContactInfo(item.title);
  const currentMedia = mediaItems[currentImageIndex] || mediaItems[0];

  // Badges normalization
  const badges = item.statusBadges || item.badges || [];
  const statusPill = badges[0] || null;

  // Partner / Enterprise normalization
  const enterpriseName =
    item.showroom?.name ||
    item.enterpriseName ||
    item.companyName ||
    item.brand ||
    item.seller?.name ||
    item.agent?.name ||
    null;

  const enterpriseLogo =
    item.showroom?.logo ||
    item.enterpriseLogo ||
    item.companyLogo ||
    item.brandLogo ||
    item.seller?.logo ||
    null;

  // Bento Highlights normalization
  const bentoHighlights = item.overviewHighlights || item.keyAttributes || [
    { label: 'Category', value: item.category || categoryName, icon: 'fa-layer-group', color: 'text-blue-600 bg-blue-50' },
    { label: 'Condition', value: item.condition === 'new' ? 'Brand New' : 'Pre-Owned', icon: 'fa-certificate', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Location', value: item.location || 'Bangalore', icon: 'fa-location-dot', color: 'text-amber-600 bg-amber-50' },
    { label: 'Verification', value: '100% Inspected', icon: 'fa-circle-check', color: 'text-purple-600 bg-purple-50' },
  ];

  // Features normalization
  const featuresList = item.features || item.amenities || [
    'Brand Genuine Guarantee',
    'Official Manufacturer Warranty',
    'Instant Loan & EMI Assistance',
    'Doorstep Delivery',
    'Verified Inspection Report',
    '7-Day Return / Exchange Policy',
  ];

  // Specification Sections normalization
  const specSections = item.specifications || [];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Lightbox Modal */}
      {galleryOpen && (
        <GalleryModal
          items={mediaItems}
          index={currentImageIndex}
          onClose={() => setGalleryOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        open={enquiryOpen}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        propertyTitle={item.title}
        propertyId={item.id || item._id}
      />

      {/* ─── STICKY FLOATING QUICK-ACTION BAR (Shows on Scroll) ─── */}
      <div
        className={`fixed top-[122px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md transition-all duration-300 ${
          scrolledPastHero ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={goBack} className="text-xs font-semibold text-gray-500 hover:text-brand-blue flex items-center gap-1.5 shrink-0 cursor-pointer">
              <i className="fa-solid fa-arrow-left" />
            </button>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-brand-charcoal truncate">{item.title}</h4>
              <h4 className="text-sm font-bold text-brand-charcoal truncate">{itemTitle}</h4>
              <p className="text-xs text-gray-500 truncate">{item.location || item.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-right">
              <span className={item.price === 'This is negotiable' ? "text-sm font-normal text-gray-500" : "text-sm font-extrabold text-brand-charcoal"}>{item.price}</span>
              {item.priceSuffix && <span className="text-[11px] text-gray-400 ml-1">{item.priceSuffix}</span>}
            </div>
            <button
              onClick={() => setEnquiryOpen(true)}
              className="rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane mr-1.5" /> Enquire Now
            </button>
            <a
              href={`tel:${activeContact.phoneTel || '+918546996622'}`}
              className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-phone" />
              <span className="hidden md:inline">Contact: {activeContact.phoneDisplay || '+91 85469 96622'}</span>
              <span className="md:hidden">Contact Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* ─── TOP NAVIGATION & BREADCRUMBS ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <button onClick={goBack} className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline cursor-pointer">
                <i className="fa-solid fa-arrow-left" /> Back to {categoryName}
              </button>
              <span>/</span>
              <Link to="/home" className="hover:text-brand-blue">Home</Link>
              <span>/</span>
              <Link to={categoryLink} className="hover:text-brand-blue">{categoryName}</Link>
              <span>/</span>
              <span className="text-brand-charcoal font-medium truncate max-w-[180px] sm:max-w-xs">{item.title}</span>
              <span className="text-brand-charcoal font-medium truncate max-w-[180px] sm:max-w-xs">{itemTitle}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                  isSaved ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${isSaved ? 'fa-solid text-rose-500' : 'fa-regular'} fa-heart`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-share-nodes" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HERO HEADER & MOSAIC GALLERY ─── */}
      <div ref={heroRef} className="bg-white border-b border-gray-200/60 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">

          {/* Title, Badges & Price Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-bold px-3 py-0.5">
                  {item.category || item.brand || categoryName}
                </span>

                {statusPill && (
                  <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                    statusPill.variant === 'green' ? 'bg-emerald-100 text-emerald-700' :
                    statusPill.variant === 'amber' ? 'bg-amber-100 text-amber-800' :
                    statusPill.variant === 'blue' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {statusPill.label || statusPill}
                  </span>
                )}

                {item.loanApproved && (
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-0.5 inline-flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-[10px]" /> Loan Pre-Approved
                  </span>
                )}

                {(item.recentlyAdded || item.condition === 'new') && (
                  <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5">
                    {item.condition === 'new' ? 'Brand New' : 'New Listing'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-charcoal tracking-tight leading-tight">
                {item.title}
                {itemTitle}
              </h1>

              {item.subtitle && (
                <p className="text-sm font-medium text-gray-500">{item.subtitle}</p>
              )}

              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 pt-0.5">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm" />
                <span>
                  {item.location}{item.zone ? ` (${item.zone})` : ''}{item.pincode ? ` — ${item.pincode}` : ''}
                </span>
              </p>

              {headerExtra && (
                <div className="pt-2">
                  {headerExtra}
                </div>
              )}
            </div>

            {/* Price & Primary CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-3 shrink-0">
              {/* Co-Branding: Partner / Brand + OneVishwam Logo */}
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50/90 border border-slate-200/80 px-3 py-1.5 shadow-2xs">
                {enterpriseLogo ? (
                  <>
                    <img
                      src={resolveImage(enterpriseLogo)}
                      alt={enterpriseName || 'Partner'}
                      className="h-6 max-w-[110px] object-contain"
                    />
                    <span className="text-slate-300 font-light text-xs">✕</span>
                  </>
                ) : enterpriseName ? (
                  <>
                    <span className="text-xs font-bold text-slate-800 tracking-wide">
                      {enterpriseName}
                    </span>
                    <span className="text-slate-300 font-light text-xs">✕</span>
                  </>
                ) : null}

                <img
                  src={oneVishwamLogo}
                  alt="OneVishwam"
                  className="h-5 sm:h-5.5 w-auto object-contain"
                />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className={item.price === 'This is negotiable' ? "text-xl sm:text-2xl font-normal text-gray-500" : "text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight"}>
                    {item.price}
                  </span>
                  {item.priceSuffix && (
                    <span className="text-sm font-semibold text-gray-500">{item.priceSuffix}</span>
                  )}
                </div>
                {item.priceNote && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.priceNote}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-paper-plane" /> Enquire Now
                </button>
                <a
                  href={`tel:${activeContact.phoneTel || '+918546996622'}`}
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <i className="fa-solid fa-phone" />
                  <span>Contact Us: {activeContact.phoneDisplay || '+91 85469 96622'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* ─── MOSAIC LUXURY PHOTO GALLERY ─── */}
          <div className="mt-2">
            {mediaItems.length <= 1 ? (
              /* Single Photo Hero */
              <div
                onClick={() => setGalleryOpen(true)}
                className="relative h-[340px] sm:h-[460px] lg:h-[540px] rounded-3xl overflow-hidden bg-gray-900 shadow-sm cursor-pointer group"
              >
                <img
                  src={resolveImage(currentMedia?.url || currentMedia)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <button className="absolute bottom-5 right-5 rounded-xl bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-white transition-colors flex items-center gap-2 shadow-lg cursor-pointer">
                  <i className="fa-solid fa-expand" /> View Fullscreen
                </button>
              </div>
            ) : (
              /* 5-Photo Mosaic Grid */
              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[360px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden">
                {/* Main Hero Photo (Left 2x2) */}
                <div
                  onClick={() => { setCurrentImageIndex(0); setGalleryOpen(true); }}
                  className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-gray-900 cursor-pointer group"
                >
                  {mediaItems[0]?.type === 'video' ? (
                    <video src={mediaItems[0].url} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <img
                      src={resolveImage(mediaItems[0]?.url || mediaItems[0])}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute top-4 left-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white font-semibold">
                    Featured
                  </div>
                </div>

                {/* Right 4 Grid Photos */}
                {mediaItems.slice(1, 5).map((media, idx) => {
                  const actualIdx = idx + 1;
                  const hasMore = mediaItems.length > 5 && idx === 3;

                  return (
                    <div
                      key={actualIdx}
                      onClick={() => { setCurrentImageIndex(actualIdx); setGalleryOpen(true); }}
                      className="relative overflow-hidden bg-gray-900 cursor-pointer group hidden md:block"
                    >
                      {media.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video src={media.url} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <i className="fa-solid fa-play text-white text-lg" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={resolveImage(media.url)}
                          alt={`${item.title} - ${actualIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

                      {/* View All Photos Button on the Last Slot */}
                      {hasMore && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-3 text-center group-hover:bg-black/70 transition-colors">
                          <i className="fa-solid fa-images text-xl mb-1.5 text-blue-400" />
                          <span className="text-sm font-bold">+{mediaItems.length - 4} More</span>
                          <span className="text-[11px] text-gray-300">View all photos</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Mobile Thumbnails & Gallery CTA */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <i className="fa-solid fa-camera text-brand-blue" />
                <span>{mediaItems.length} Photos & Media available</span>
              </div>
              <button
                onClick={() => setGalleryOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-charcoal hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                <i className="fa-solid fa-table-cells" /> Show all photos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Full Width Max-7XL) ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {children}

        {/* ═══ MODULE 1: BENTO SPEC HIGHLIGHTS ═══ */}
        {bentoHighlights.length > 0 && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
                  <i className="fa-solid fa-gem" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-brand-charcoal">{bentoTitle}</h2>
                  <p className="text-xs text-gray-500">Core parameters and verified configuration</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200/60 self-start sm:self-auto">
                Listing ID: #{String(item.id || item._id || '').slice(-6)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {bentoHighlights.map((meta, idx) => {
                const icon = meta.icon || 'fa-sliders';
                const color = meta.color || 'text-brand-blue bg-blue-50';
                return (
                  <div
                    key={idx}
                    className="group relative flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border border-gray-100/90 bg-gray-50/60 hover:bg-white hover:border-brand-blue/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm ${color} group-hover:scale-105 transition-transform shrink-0`}>
                      <i className={`fa-solid ${icon}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">{meta.label}</span>
                      <span className="text-sm sm:text-base font-extrabold text-brand-charcoal leading-snug block mt-0.5 break-words">
                        {meta.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ MODULE 2: OVERVIEW & DESCRIPTION ═══ */}
        <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center text-base">
              <i className="fa-solid fa-circle-info" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-charcoal">About This Listing</h2>
              <p className="text-xs text-gray-500">Comprehensive overview and manufacturer details</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {showFullDesc || !item.description || item.description.length < 350
                ? item.description || `${item.title} verified and listed on OneVishwam. Inspected for quality, authenticity, and pre-approved for priority fulfillment and customer protection.`
                : item.description.slice(0, 350) + '...'}
            </p>
          </div>

          {item.description && item.description.length > 350 && (
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-navy transition-colors pt-2 cursor-pointer"
            >
              {showFullDesc ? 'Show Less' : 'Read Full Description'}
              <i className={`fa-solid fa-chevron-${showFullDesc ? 'up' : 'down'} text-[10px]`} />
            </button>
          )}

          {/* Quick tags / attributes */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            {item.loanApproved && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-circle-check" /> 100% Pre-Approved Loan
              </span>
            )}
            {item.highlightBanner && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-stamp" /> {item.highlightBanner}
              </span>
            )}
            {item.brand && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-certificate" /> Official {item.brand} Genuine
              </span>
            )}
            {enterpriseName && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-user-check" /> Verified by {enterpriseName}
              </span>
            )}
          </div>
        </section>

        {/* ═══ MODULE 3: GROUPED SPECIFICATIONS TABLE ═══ */}
        {specSections.length > 0 && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
                <i className="fa-solid fa-table-list" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">Detailed Technical Specifications</h2>
                <p className="text-xs text-gray-500">Comprehensive manufacturer parameters and configurations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {specSections.map((sec, secIdx) => (
                <div key={secIdx} className="rounded-2xl border border-gray-100 bg-gray-50/60 overflow-hidden">
                  <div className="bg-gray-100/80 px-4 py-3 border-b border-gray-200/60">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-charcoal">
                      {sec.title}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100 p-2">
                    {sec.items.map((it, itIdx) => (
                      <div key={itIdx} className="flex justify-between items-center py-2 px-3 text-xs">
                        <span className="font-semibold text-gray-500">{it.label}</span>
                        <span className="font-bold text-brand-charcoal text-right">{it.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ MODULE 4: FEATURES & INCLUDED HIGHLIGHTS ═══ */}
        {featuresList.length > 0 && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                  <i className="fa-solid fa-sparkles" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">{featuresTitle}</h2>
                  <p className="text-xs text-gray-500">Verified standards, built-in features, and perks</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {featuresList.length} Highlights Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {featuresList.map((feat, idx) => {
                const featName = typeof feat === 'string' ? feat : feat.name;
                const icon = (typeof feat === 'object' && feat.icon) || DEFAULT_FEATURE_ICONS[featName] || 'fa-check-double';
                return (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 hover:bg-white hover:border-brand-blue/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-brand-blue flex items-center justify-center shadow-2xs border border-gray-100 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all shrink-0">
                      <i className={`fa-solid ${icon} text-xs`} />
                    </div>
                    <span className="text-xs font-bold text-brand-charcoal leading-snug">{featName}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ MODULE 5: ENTERPRISE & DEALER PARTNERSHIP ═══ */}
        <section className="rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue p-6 sm:p-8 text-white shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-5 border-b border-white/15">
            <div className="flex items-center gap-4">
              {enterpriseLogo ? (
                <div className="relative bg-white rounded-2xl p-2 h-16 w-24 flex items-center justify-center border-2 border-white/30 shadow-md">
                  <img
                    src={resolveImage(enterpriseLogo)}
                    alt={enterpriseName || 'Partner'}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] border-2 border-white">
                    <i className="fa-solid fa-check" />
                  </div>
                </div>
              ) : (
                <div className="relative w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black text-amber-400 shrink-0">
                  {enterpriseName ? enterpriseName.charAt(0) : <i className="fa-solid fa-building" />}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {enterpriseName || 'Authorized Brand Partner'}
                  </h3>
                  <span className="rounded-full bg-yellow-400 text-brand-navy text-[10px] font-extrabold px-2.5 py-0.5">
                    Official Partner
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-1">Authorized Showroom & Direct Distribution</p>
              </div>
            </div>

            {/* Co-branded with OneVishwam */}
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shrink-0">
              <span className="text-[11px] text-white/80 font-medium">In Partnership with</span>
              <img
                src={oneVishwamLogo}
                alt="OneVishwam"
                className="h-6 sm:h-7 w-auto object-contain bg-white/95 rounded-lg px-2 py-0.5"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/80 max-w-xl">
              Get genuine brand warranty, priority test drive or showroom demo, instant financing, and express delivery through OneVishwam.
            </p>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="flex-1 sm:flex-initial rounded-xl bg-yellow-400 px-5 py-3 text-xs font-extrabold text-brand-navy hover:bg-yellow-300 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-paper-plane" /> Enquire / Book Demo
              </button>
              <a
                href={`tel:${activeContact.phoneTel || '+918546996622'}`}
                className="flex-1 sm:flex-initial rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 text-xs font-extrabold transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-phone" />
                <span>Contact Us: {activeContact.phoneDisplay || '+91 85469 96622'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* ═══ MODULE 6: SIMILAR LISTINGS ═══ */}
        {similarItems.length > 0 && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center text-base">
                  <i className="fa-solid fa-layer-group" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">Similar {categoryName} You May Like</h2>
                  <p className="text-xs text-gray-500">Comparable options available in Bangalore</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { similarRef.current?.scrollBy({ left: -320, behavior: 'smooth' }); }}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Previous listings"
                >
                  <i className="fa-solid fa-chevron-left text-xs" />
                </button>
                <button
                  onClick={() => { similarRef.current?.scrollBy({ left: 320, behavior: 'smooth' }); }}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Next listings"
                >
                  <i className="fa-solid fa-chevron-right text-xs" />
                </button>
              </div>
            </div>

            <div
              ref={similarRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
            >
              {similarItems.map((sp) => (
                <div key={sp.id || sp._id} className="w-[260px] sm:w-[290px] lg:w-[310px] flex-shrink-0 snap-start">
                  <CategoryListingCard
                    item={sp}
                    link={`${itemLinkPrefix}${sp.id || sp._id}`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ MODULE 7: RECENTLY VIEWED ═══ */}
        {recentlyViewed.length > 0 && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center text-base">
                <i className="fa-solid fa-clock-rotate-left" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">Recently Viewed {categoryName}</h2>
                <p className="text-xs text-gray-500">Pick up right where you left off</p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">
              {recentlyViewed.map((sp, i) => (
                <div key={(sp.id || sp._id) + '-recent-' + i} className="w-[260px] sm:w-[290px] lg:w-[310px] flex-shrink-0 snap-start">
                  <CategoryListingCard
                    item={sp}
                    link={`${itemLinkPrefix}${sp.id || sp._id}`}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── MOBILE BOTTOM BAR (Compact Floating) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 sm:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-gray-500 block leading-tight">Price</span>
            <span className={item.price === 'This is negotiable' ? "text-sm font-normal text-gray-500 leading-tight" : "text-base font-extrabold text-brand-charcoal leading-tight"}>{item.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="rounded-xl bg-brand-blue px-3.5 py-2.5 text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane mr-1" /> Enquire Now
            </button>
            <a
              href={`tel:${activeContact.phoneTel || '+918546996622'}`}
              className="rounded-xl bg-amber-500 px-3.5 py-2.5 text-xs font-bold text-slate-950 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-phone" /> Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

