import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../../../hooks/useProperties';
import { getNumericPrice } from '../GalleryComponents';
import { contactInfo, getPropertyContactInfo } from '../../../data/footerContent';
import { navigateTo } from '../../../config/navigation';
import { getPropertyCoverImage, getPropertyStatusPill, isPlotOrLand } from './propertyHelpers';
import EnquiryModal from '../../../components/EnquiryModal';

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL
  ? new URL(import.meta.env.VITE_API_BASE_URL).origin
  : `http://${window.location.hostname}:5001`;

function resolveImage(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  if (src.startsWith('/assets/') || src.startsWith('/src/assets/')) return src;
  return `${API_ORIGIN}${src.startsWith('/') ? '' : '/'}${src}`;
}

const AMENITY_ICONS = {
  'Swimming Pool': 'fa-person-swimming',
  '24×7 Security': 'fa-shield-halved',
  '24/7 Security': 'fa-shield-halved',
  Gym: 'fa-dumbbell',
  Gymnasium: 'fa-dumbbell',
  'Power Backup': 'fa-bolt',
  'Club House': 'fa-building-flag',
  Clubhouse: 'fa-building-flag',
  Park: 'fa-tree',
  Garden: 'fa-tree',
  "Children's Play Area": 'fa-children',
  '2 Wheeler Parking': 'fa-motorcycle',
  '4 Wheeler Parking': 'fa-car',
  'Visitor Parking': 'fa-square-parking',
  CCTV: 'fa-video',
  Lift: 'fa-elevator',
  'Indoor Games': 'fa-gamepad',
  'Community Hall': 'fa-people-group',
  'Solar Power': 'fa-solar-panel',
  'EV Charging': 'fa-charging-station',
  Intercom: 'fa-phone',
  'Wi-Fi': 'fa-wifi',
};

const PROPERTY_HIGHLIGHTS_META = [
  { key: 'bhk', label: 'Configuration', icon: 'fa-bed', color: 'text-blue-600 bg-blue-50' },
  { key: 'area', label: 'Super Built-up Area', icon: 'fa-vector-square', color: 'text-emerald-600 bg-emerald-50' },
  { key: 'facing', label: 'Facing Direction', icon: 'fa-compass', color: 'text-amber-600 bg-amber-50' },
  { key: 'status', label: 'Possession Status', icon: 'fa-key', color: 'text-purple-600 bg-purple-50' },
  { key: 'furnishing', label: 'Furnishing State', icon: 'fa-couch', color: 'text-indigo-600 bg-indigo-50' },
  { key: 'bathrooms', label: 'Bathrooms', icon: 'fa-bath', color: 'text-cyan-600 bg-cyan-50' },
  { key: 'floor', label: 'Floor Level', icon: 'fa-layer-group', color: 'text-rose-600 bg-rose-50' },
  { key: 'parking', label: 'Reserved Parking', icon: 'fa-car', color: 'text-teal-600 bg-teal-50' },
];

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
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-20"
        aria-label="Close modal"
      >
        <i className="fa-solid fa-xmark text-xl" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-all z-20 shadow-lg"
        aria-label="Previous image"
      >
        <i className="fa-solid fa-chevron-left text-xl" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-all z-20 shadow-lg"
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

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`
);

function PropertyCard({ property }) {
  const [imgError, setImgError] = useState(false);
  const [faved, setFaved] = useState(false);
  if (!property) return null;
  const imgSrc = resolveImage(getPropertyCoverImage(property));

  return (
    <div className="w-[260px] sm:w-[290px] lg:w-[310px] flex-shrink-0 snap-start">
      <div
        onClick={() => navigateTo(`/property/${property._id || property.id}`)}
        className="group bg-white rounded-2xl border border-gray-200/80 hover:border-brand-blue/60 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={property.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <img src={FALLBACK_IMG} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {property.loanApproved && (
              <span className="rounded-md bg-emerald-600/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                Loan Approved
              </span>
            )}
            {property.recentlyAdded && (
              <span className="rounded-md bg-blue-600/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                New
              </span>
            )}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1 gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
            {property.propertyType || 'Property'}
          </span>
          <h4 className="text-sm font-bold text-brand-charcoal leading-snug line-clamp-1 group-hover:text-brand-blue transition-colors">
            {property.title}
          </h4>
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <i className="fa-solid fa-location-dot text-brand-blue text-[10px]" /> {property.location || property.city}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-baseline justify-between">
            <div>
              <span className="text-base font-extrabold text-brand-charcoal">{property.price}</span>
              {property.priceSuffix && <span className="text-[11px] text-gray-400 ml-1">{property.priceSuffix}</span>}
            </div>
            {property.bhk && <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{property.bhk}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetails() {
  const { properties, loading: listLoading } = useProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeFpIndex, setActiveFpIndex] = useState(0);
  const [fpGalleryOpen, setFpGalleryOpen] = useState(false);
  const [fpGalleryIndex, setFpGalleryIndex] = useState(0);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const heroRef = useRef(null);
  const similarRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const propertySlug = pathParts.length > 1 ? pathParts[1] : null;

  const property = properties.find(
    (p) => p._id === propertySlug || String(p.id) === propertySlug
  ) || null;
  const loading = listLoading;
  const error = !property && !listLoading ? new Error('Property not found') : null;

  const activeId = property ? (property._id || property.id) : null;
  const currentSubcat = property ? (property.subcategory || property.subCategory || property.propertyType || '') : '';

  const similarProperties = useMemo(() => {
    if (!property) return [];
    const matched = properties.filter((p) => {
      const pId = p._id || p.id;
      if (String(pId) === String(activeId)) return false;
      const pSubcat = p.subcategory || p.subCategory || p.propertyType || '';
      return (
        pSubcat.toLowerCase() === currentSubcat.toLowerCase() ||
        (p.city && property.city && p.city.toLowerCase() === property.city.toLowerCase())
      );
    });
    if (matched.length < 4) {
      const rest = properties.filter((p) => {
        const pId = p._id || p.id;
        return String(pId) !== String(activeId) && !matched.some((m) => String(m._id || m.id) === String(pId));
      });
      return [...matched, ...rest].slice(0, 8);
    }
    return matched.slice(0, 8);
  }, [property, properties, activeId, currentSubcat]);

  useEffect(() => {
    if (!property) return;
    try {
      const STORAGE_KEY = 'vishwam_recently_viewed_properties';
      const storedJson = localStorage.getItem(STORAGE_KEY);
      let storedList = storedJson ? JSON.parse(storedJson) : [];
      if (!Array.isArray(storedList)) storedList = [];

      const filtered = storedList.filter((item) => String(item._id || item.id) !== String(activeId));
      const updated = [property, ...filtered].slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setRecentlyViewed(filtered.slice(0, 8));
    } catch (e) {
      console.warn('Recently viewed storage notice:', e);
    }
  }, [property, activeId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [propertySlug]);

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
    else navigateTo('/our-services/real-estate-property');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.title || 'OneVishwam Property';
    const text = `Check out this property on OneVishwam: ${title}`;
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
      alert('Property link copied to clipboard!');
    } catch (e) {
      prompt('Copy the link manually:', url);
    }
  };

  const hasVideo = Boolean(
    property?.videoUrl &&
    typeof property.videoUrl === 'string' &&
    property.videoUrl.trim() !== '' &&
    !property.videoUrl.startsWith('WhatsApp') &&
    !property.videoUrl.includes('youtu')
  );

  const floorPlanImages = useMemo(() => {
    if (!property) return [];
    const fp = property.floorPlanImages || property.floorPlans || property.floorPlanMap;
    if (Array.isArray(fp)) return fp.filter(Boolean);
    if (typeof fp === 'string' && fp) return [fp];
    return [];
  }, [property]);

  const pdfUrl = property?.pdfUrl || property?.floorPlanPdf || property?.pdf || null;
  const hasFloorPlans = floorPlanImages.length > 0 || Boolean(pdfUrl);

  const mediaItems = property
    ? [
        ...(property.images || []).filter(Boolean).map((img) => ({ type: 'image', url: img })),
        ...(hasVideo ? [{ type: 'video', url: property.videoUrl }] : []),
      ]
    : [];

  const fpMediaItems = useMemo(
    () => floorPlanImages.map((img) => ({ type: 'image', url: img })),
    [floorPlanImages]
  );

  const goPrev = useCallback(() => {
    if (!mediaItems.length) return;
    setCurrentImageIndex((i) => (i === 0 ? mediaItems.length - 1 : i - 1));
  }, [mediaItems.length]);
  const goNext = useCallback(() => {
    if (!mediaItems.length) return;
    setCurrentImageIndex((i) => (i === mediaItems.length - 1 ? 0 : i + 1));
  }, [mediaItems.length]);

  const goFpPrev = useCallback(() => {
    if (!fpMediaItems.length) return;
    setFpGalleryIndex((i) => (i === 0 ? fpMediaItems.length - 1 : i - 1));
  }, [fpMediaItems.length]);
  const goFpNext = useCallback(() => {
    if (!fpMediaItems.length) return;
    setFpGalleryIndex((i) => (i === fpMediaItems.length - 1 ? 0 : i + 1));
  }, [fpMediaItems.length]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-blue" />
        <span className="text-sm font-medium">Loading property details...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen pt-32 text-center bg-gray-50 px-4">
        <div className="mx-auto max-w-md bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <h1 className="text-xl font-bold text-brand-charcoal mb-2">Property Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">The listing you are searching for might have been sold or removed.</p>
          <button
            onClick={goBack}
            className="w-full rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white hover:bg-brand-navy transition-colors"
          >
            &larr; Back to Real Estate
          </button>
        </div>
      </div>
    );
  }

  const activeContact = getPropertyContactInfo(property);
  const whatsappUrl = `https://wa.me/${activeContact.whatsapp}?text=${encodeURIComponent(`Hi, I would like to enquire about ${property.title} (${property.location || property.city}).`)}`;
  const currentMedia = mediaItems[currentImageIndex] || mediaItems[0];
  const isPlot = isPlotOrLand(property);
  const statusPill = getPropertyStatusPill(property);

  const renderHighlightCard = (meta) => {
    if (meta.key === 'bhk' && isPlot) return null;
    let value = property[meta.key];
    if (meta.key === 'facing' && property.facing) value = property.facing;
    if (meta.key === 'area' && value) {
      value = String(value).split('·')[0].trim();
    }
    if (meta.key === 'status') {
      value = statusPill?.label || (value === 'available' ? (isPlot ? 'Ready for Registration' : 'Ready to Occupy') : value) || 'Ready to Occupy';
    }
    if (!value || value === 'N/A' || value === '') return null;

    return (
      <div
        key={meta.key}
        className="group relative flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border border-gray-100/90 bg-gray-50/60 hover:bg-white hover:border-brand-blue/30 hover:shadow-md transition-all duration-300"
      >
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm ${meta.color || 'text-brand-blue bg-blue-50'} group-hover:scale-105 transition-transform shrink-0`}>
          <i className={`fa-solid ${meta.icon}`} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">{meta.label}</span>
          <span className="text-sm sm:text-base font-extrabold text-brand-charcoal leading-snug block mt-0.5 break-words">
            {value}
          </span>
        </div>
      </div>
    );
  };

  const amenities = (property.amenities?.length > 0
    ? property.amenities
    : ['Swimming Pool', '24×7 Security', 'Gym', 'Power Backup', 'Clubhouse', 'Garden', '2 Wheeler Parking', '4 Wheeler Parking']
  ).slice(0, 20);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Lightbox Modals */}
      {galleryOpen && (
        <GalleryModal
          items={mediaItems}
          index={currentImageIndex}
          onClose={() => setGalleryOpen(false)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
      {fpGalleryOpen && (
        <GalleryModal
          items={fpMediaItems}
          index={fpGalleryIndex}
          onClose={() => setFpGalleryOpen(false)}
          onPrev={goFpPrev}
          onNext={goFpNext}
        />
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        open={enquiryOpen}
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        propertyTitle={property.title}
        propertyId={property.id || property._id}
      />

      {/* ─── STICKY FLOATING QUICK-ACTION BAR (Shows on Scroll) ─── */}
      <div
        className={`fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md transition-all duration-300 ${
          scrolledPastHero ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={goBack} className="text-xs font-semibold text-gray-500 hover:text-brand-blue flex items-center gap-1.5 shrink-0">
              <i className="fa-solid fa-arrow-left" />
            </button>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-brand-charcoal truncate">{property.title}</h4>
              <p className="text-xs text-gray-500 truncate">{property.location || property.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-right">
              <span className="text-sm font-extrabold text-brand-charcoal">{property.price}</span>
              {property.priceSuffix && <span className="text-[11px] text-gray-400 ml-1">{property.priceSuffix}</span>}
            </div>
            <button
              onClick={() => setEnquiryOpen(true)}
              className="rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs"
            >
              <i className="fa-solid fa-paper-plane mr-1.5" /> Enquire
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <i className="fa-brands fa-whatsapp mr-1" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ─── TOP NAVIGATION & BREADCRUMBS ─── */}
      <div className="bg-white border-b border-gray-100 pt-16 lg:pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <button onClick={goBack} className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline">
                <i className="fa-solid fa-arrow-left" /> Back to Properties
              </button>
              <span>/</span>
              <Link to="/home" className="hover:text-brand-blue">Home</Link>
              <span>/</span>
              <Link to="/our-services/real-estate-property" className="hover:text-brand-blue">Real Estate</Link>
              <span>/</span>
              <span className="text-brand-charcoal font-medium truncate max-w-[180px] sm:max-w-xs">{property.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-semibold transition-colors ${
                  isSaved ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${isSaved ? 'fa-solid text-rose-500' : 'fa-regular'} fa-heart`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <i className="fa-solid fa-share-nodes" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PROPERTY HERO HEADER & MOSAIC GALLERY ─── */}
      <div ref={heroRef} className="bg-white border-b border-gray-200/60 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">

          {/* Title, Badges & Price Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-bold px-3 py-0.5">
                  {property.propertyType || 'Property'}
                </span>
                <span className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${statusPill?.cls || 'bg-emerald-100 text-emerald-700'}`}>
                  {statusPill?.label || property.possession || 'Ready to Occupy'}
                </span>
                {property.loanApproved && (
                  <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-3 py-0.5 inline-flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-[10px]" /> Loan Pre-Approved
                  </span>
                )}
                {property.recentlyAdded && (
                  <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5">
                    New Listing
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-charcoal tracking-tight leading-tight">
                {property.title}
              </h1>

              {property.subtitle && (
                <p className="text-sm font-medium text-gray-500">{property.subtitle}</p>
              )}

              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5 pt-0.5">
                <i className="fa-solid fa-location-dot text-brand-blue text-sm" />
                <span>
                  {property.location}{property.zone ? ` (${property.zone})` : ''}{property.pincode ? ` — ${property.pincode}` : ''}
                </span>
              </p>
            </div>

            {/* Price & Primary CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-3 shrink-0">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                    {property.price}
                  </span>
                  {property.priceSuffix && (
                    <span className="text-sm font-semibold text-gray-500">{property.priceSuffix}</span>
                  )}
                </div>
                {property.priceNote && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{property.priceNote}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white hover:bg-brand-navy transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-paper-plane" /> Enquire Now
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-base" /> WhatsApp
                </a>
                <Link
                  to="/contact-us/"
                  className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-headset" /> Contact Us
                </Link>
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
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <button className="absolute bottom-5 right-5 rounded-xl bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-white transition-colors flex items-center gap-2 shadow-lg">
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
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute top-4 left-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white font-semibold">
                    Featured
                  </div>
                </div>

                {/* Right 4 Grid Photos */}
                {mediaItems.slice(1, 5).map((item, idx) => {
                  const actualIdx = idx + 1;
                  const isLastSlot = idx === 3 || actualIdx === mediaItems.length - 1;
                  const hasMore = mediaItems.length > 5 && idx === 3;

                  return (
                    <div
                      key={actualIdx}
                      onClick={() => { setCurrentImageIndex(actualIdx); setGalleryOpen(true); }}
                      className="relative overflow-hidden bg-gray-900 cursor-pointer group hidden md:block"
                    >
                      {item.type === 'video' ? (
                        <div className="relative w-full h-full">
                          <video src={item.url} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <i className="fa-solid fa-play text-white text-lg" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={resolveImage(item.url)}
                          alt={`${property.title} - ${actualIdx + 1}`}
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-brand-charcoal hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <i className="fa-solid fa-table-cells" /> Show all photos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Full Width Max-7XL) ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ═══ MODULE 1: BENTO SPEC HIGHLIGHTS ═══ */}
        <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-base">
                <i className="fa-solid fa-gem" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-brand-charcoal">Property Key Specifications</h2>
                <p className="text-xs text-gray-500">Core parameters and verified configuration</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-200/60 self-start sm:self-auto">
              Listing ID: #{property.id || property._id?.slice(-6)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {PROPERTY_HIGHLIGHTS_META.map(renderHighlightCard)}
          </div>
        </section>

        {/* ═══ MODULE 2: OVERVIEW & DESCRIPTION ═══ */}
        <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center text-base">
              <i className="fa-solid fa-circle-info" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-charcoal">About This Property</h2>
              <p className="text-xs text-gray-500">Comprehensive overview and highlights</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-3">
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {showFullDesc || !property.description || property.description.length < 350
                ? property.description
                : property.description.slice(0, 350) + '...'}
            </p>
          </div>

          {property.description && property.description.length > 350 && (
            <button
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-navy transition-colors pt-2"
            >
              {showFullDesc ? 'Show Less' : 'Read Full Description'}
              <i className={`fa-solid fa-chevron-${showFullDesc ? 'up' : 'down'} text-[10px]`} />
            </button>
          )}

          {/* Quick tags / attributes */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            {property.gatedCommunity && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-shield-check" /> Gated Community
              </span>
            )}
            {property.approval && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-stamp" /> {property.approval} Approved
              </span>
            )}
            {property.possession && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/70 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-calendar-check" /> {property.possession}
              </span>
            )}
            {property.postedBy && (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">
                <i className="fa-solid fa-user-check" /> Posted by {property.postedBy}
              </span>
            )}
          </div>
        </section>

        {/* ═══ MODULE 3: FLOOR PLANS & ARCHITECTURAL LAYOUTS ═══ */}
        {hasFloorPlans && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-base">
                  <i className="fa-solid fa-map-location-dot" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">Unit Layouts & Master Floor Maps</h2>
                  <p className="text-xs text-gray-500">Architectural dimensions, unit blueprint, and master site layouts</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {floorPlanImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setFpGalleryIndex(activeFpIndex); setFpGalleryOpen(true); }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
                  >
                    <i className="fa-solid fa-expand text-[10px]" /> Fullscreen Layout
                  </button>
                )}
                {pdfUrl && (
                  <>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
                    >
                      <i className="fa-solid fa-up-right-from-square text-[10px]" /> View Brochure PDF
                    </a>
                    <a
                      href={pdfUrl}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold text-white hover:bg-brand-navy transition-colors shadow-xs"
                    >
                      <i className="fa-solid fa-download text-[10px]" /> Download Plan
                    </a>
                  </>
                )}
              </div>
            </div>

            {floorPlanImages.length > 0 && (
              <div className="space-y-4">
                <div
                  className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 flex items-center justify-center min-h-[340px] sm:min-h-[480px] group cursor-pointer shadow-inner"
                  onClick={() => { setFpGalleryIndex(activeFpIndex); setFpGalleryOpen(true); }}
                >
                  <img
                    src={resolveImage(floorPlanImages[activeFpIndex] || floorPlanImages[0])}
                    alt={`${property.title} Floor Plan ${activeFpIndex + 1}`}
                    className="max-h-[500px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 text-white flex justify-between items-center">
                    <span className="text-xs font-bold bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <i className="fa-solid fa-layer-group text-blue-400 mr-1.5" />
                      Plan {activeFpIndex + 1} of {floorPlanImages.length}
                    </span>
                    <span className="text-xs text-gray-300 group-hover:text-white flex items-center gap-1.5 font-semibold">
                      <i className="fa-solid fa-magnifying-glass-plus text-xs text-blue-400" /> Click to Zoom Full Screen
                    </span>
                  </div>
                </div>

                {/* Floor plan thumbnails */}
                {floorPlanImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {floorPlanImages.map((fp, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFpIndex(idx)}
                        className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          idx === activeFpIndex
                            ? 'border-brand-blue ring-2 ring-brand-blue/20 shadow-md scale-105'
                            : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400'
                        }`}
                      >
                        <img src={resolveImage(fp)} alt="" className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ═══ MODULE 4: MODERN AMENITIES & LIFESTYLE ═══ */}
        <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base">
                <i className="fa-solid fa-tree-city" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-charcoal">Amenities & Lifestyle Features</h2>
                <p className="text-xs text-gray-500">Modern conveniences and residential infrastructure</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {amenities.length} Features Verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {amenities.map((amenity) => {
              const icon = AMENITY_ICONS[amenity] || 'fa-star';
              return (
                <div
                  key={amenity}
                  className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3.5 hover:bg-white hover:border-brand-blue/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-white text-brand-blue flex items-center justify-center shadow-2xs border border-gray-100 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <i className={`fa-solid ${icon} text-xs`} />
                  </div>
                  <span className="text-xs font-bold text-brand-charcoal leading-snug">{amenity}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ MODULE 5: DEVELOPER & VERIFIED PARTNER ═══ */}
        {property.agent && (
          <section className="rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue p-6 sm:p-8 text-white shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/15">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={resolveImage(property.agent.avatar)}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] border-2 border-white">
                    <i className="fa-solid fa-check" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{property.agent.name}</h3>
                    <span className="rounded-full bg-yellow-400 text-brand-navy text-[10px] font-extrabold px-2.5 py-0.5">
                      {property.agent.type || 'Verified Partner'}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1">Authorized Developer & Representation Partner</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/80">
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
                  <span className="block text-sm font-bold text-white">{property.projectCount || 12}+</span>
                  <span className="text-[10px] text-white/70">Properties</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-center">
                  <span className="block text-sm font-bold text-emerald-400">&lt; 5 min</span>
                  <span className="text-[10px] text-white/70">Response Time</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/80 max-w-xl">
                Get direct pricing, unit selection, site visit scheduling, and documentation assistance through OneVishwam.
              </p>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="flex-1 sm:flex-initial rounded-xl bg-yellow-400 px-5 py-3 text-xs font-extrabold text-brand-navy hover:bg-yellow-300 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-paper-plane" /> Book Site Visit
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial rounded-xl bg-emerald-600 px-5 py-3 text-xs font-extrabold text-white hover:bg-emerald-500 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <i className="fa-brands fa-whatsapp text-sm" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ═══ MODULE 6: SIMILAR PROPERTIES ═══ */}
        {similarProperties.length > 0 && (
          <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center text-base">
                  <i className="fa-solid fa-city" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-charcoal">Similar Properties You May Like</h2>
                  <p className="text-xs text-gray-500">Comparable properties in {property.location || property.city || 'Bangalore'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { similarRef.current?.scrollBy({ left: -320, behavior: 'smooth' }); }}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Previous properties"
                >
                  <i className="fa-solid fa-chevron-left text-xs" />
                </button>
                <button
                  onClick={() => { similarRef.current?.scrollBy({ left: 320, behavior: 'smooth' }); }}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Next properties"
                >
                  <i className="fa-solid fa-chevron-right text-xs" />
                </button>
              </div>
            </div>

            <div
              ref={similarRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
            >
              {similarProperties.map((sp) => (
                <PropertyCard key={sp._id || sp.id} property={sp} />
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
                <h2 className="text-lg font-bold text-brand-charcoal">Recently Viewed Properties</h2>
                <p className="text-xs text-gray-500">Pick up right where you left off</p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide">
              {recentlyViewed.map((sp, i) => (
                <PropertyCard key={(sp._id || sp.id) + '-recent-' + i} property={sp} />
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
            <span className="text-base font-extrabold text-brand-charcoal leading-tight">{property.price}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnquiryOpen(true)}
              className="rounded-xl bg-brand-blue px-4 py-2.5 text-xs font-bold text-white shadow-xs"
            >
              <i className="fa-solid fa-paper-plane mr-1" /> Enquire
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs"
            >
              <i className="fa-brands fa-whatsapp text-sm" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
