import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useProperties } from '../../../hooks/useProperties';
import { getNumericPrice } from '../GalleryComponents';
import { contactInfo } from '../../../data/footerContent';
import { navigateTo } from '../../../config/navigation';
import { getPropertyCoverImage } from './propertyHelpers';
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
  'Swimming Pool': 'fa-person-swimming', '24×7 Security': 'fa-shield-halved',
  '24/7 Security': 'fa-shield-halved', Gym: 'fa-dumbbell', Gymnasium: 'fa-dumbbell',
  'Power Backup': 'fa-bolt', 'Club House': 'fa-building-flag', 'Clubhouse': 'fa-building-flag',
  Park: 'fa-tree', Garden: 'fa-tree', 'Children\'s Play Area': 'fa-children',
  'Jogging Track': 'fa-person-running', 'Visitor Parking': 'fa-square-parking',
  'Covered Parking': 'fa-square-parking', CCTV: 'fa-video', Lift: 'elevator',
  'Indoor Games': 'fa-gamepad', 'Community Hall': 'fa-people-group',
  'Rain Water Harvesting': 'fa-cloud-rain', 'Fire Safety': 'fa-fire-extinguisher',
  'EV Charging': 'fa-charging-station', 'Solar Power': 'fa-solar-panel',
  Intercom: 'fa-phone', 'Central AC': 'fa-snowflake', 'Open Parking': 'fa-square-parking',
  'Attached Market': 'fa-store', 'Wi-Fi': 'fa-wifi',
};

const PROPERTY_HIGHLIGHTS_META = [
  { key: 'bhk', label: 'Bedrooms', icon: 'fa-bed' },
  { key: 'bathrooms', label: 'Bathrooms', icon: 'fa-bath' },
  { key: 'area', label: 'Area', icon: 'fa-vector-square' },
  { key: 'parking', label: 'Parking', icon: 'fa-square-parking' },
  { key: 'floor', label: 'Floor', icon: 'fa-layer-group' },
  { key: 'furnishing', label: 'Furnishing', icon: 'fa-couch' },
  { key: 'extraRoom', label: 'Extra Room', icon: 'fa-door-open' },
  { key: 'status', label: 'Possession', icon: 'fa-key' },
];

function GalleryModal({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') onPrev(); if (e.key === 'ArrowRight') onNext(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10">
        <i className="fa-solid fa-xmark text-xl" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10">
        <i className="fa-solid fa-chevron-left text-xl" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-10">
        <i className="fa-solid fa-chevron-right text-xl" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium z-10">
        {index + 1} / {images.length}
      </div>
      <img src={resolveImage(images[index])} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
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
    <div className="w-[190px] sm:w-[260px] lg:w-[280px] flex-shrink-0 snap-start">
      <div onClick={() => navigateTo(`/property/${property._id || property.id}`)}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {imgSrc && !imgError ? (
            <img src={imgSrc} alt={property.title} onError={() => setImgError(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <img src={FALLBACK_IMG} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {property.loanApproved && (
              <span className="rounded-md bg-emerald-500/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">Approved</span>
            )}
            {property.recentlyAdded && (
              <span className="rounded-md bg-blue-500/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">New</span>
            )}
          </div>
        </div>
        {/* Body */}
        <div className="p-3 flex flex-col flex-1 gap-1">
          <h4 className="text-sm font-bold text-brand-charcoal leading-snug line-clamp-1">{property.title}</h4>
          <p className="text-[11px] text-gray-500 flex items-center gap-1 truncate">
            <i className="fa-solid fa-location-dot text-brand-blue text-[9px]" /> {property.location}
          </p>
          <p className="text-sm font-bold text-brand-blue mt-auto">{property.price}</p>
          <div className="flex items-center gap-2 text-[11px] text-gray-600 flex-wrap">
            {property.bhk && <span className="bg-gray-100 rounded-md px-2 py-0.5">{property.bhk}</span>}
            {property.area && <span className="bg-gray-100 rounded-md px-2 py-0.5">{property.area}</span>}
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-gray-50 mt-1">
            <span className="flex-1 text-center rounded-lg bg-brand-blue/10 text-brand-blue text-[10px] font-semibold py-1.5 hover:bg-brand-blue hover:text-white transition-colors">
              View Details
            </span>
            <button onClick={(e) => { e.stopPropagation(); setFaved(!faved); }}
              className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <i className={`${faved ? 'fa-solid text-red-500' : 'fa-regular text-gray-400'} fa-heart text-sm`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyDetails() {
  const { properties, loading: listLoading } = useProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
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

  const similarProperties = property
    ? properties.filter((p) => p.city === property.city && (p._id || p.id) !== (property._id || property.id)).slice(0, 8)
    : [];

  useEffect(() => { window.scrollTo(0, 0); }, [propertySlug]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigateTo('/our-services/real-estate-property');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.title || 'OneVishwam Property';
    const text = `Check out this property: ${title}`;
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
      alert('Link copied to clipboard!');
    } catch (e) {
      prompt('Copy the link manually:', url);
    }
  };

  const loanCtaParams = property
    ? `?type=property&id=${property.id}&title=${encodeURIComponent(property.title)}&price=${encodeURIComponent(property.price)}`
    : '';

  const goPrev = useCallback(() => {
    if (!property) return;
    setCurrentImageIndex((i) => (i === 0 ? property.images.length - 1 : i - 1));
  }, [property]);
  const goNext = useCallback(() => {
    if (!property) return;
    setCurrentImageIndex((i) => (i === property.images.length - 1 ? 0 : i + 1));
  }, [property]);

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center gap-2 text-gray-400">
        <i className="fa-solid fa-spinner fa-spin text-lg" />
        <span className="text-sm">Loading property...</span>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-gray-400">Property not found</h1>
        <Link to="/our-services/real-estate-property" className="mt-4 inline-block text-brand-blue font-semibold">&larr; Back to Real Estate</Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(`Hi, I would like to enquire about ${property.title}.`)}`;

  const renderAmenityCard = (amenity) => {
    const icon = AMENITY_ICONS[amenity] || 'fa-star';
    return (
      <div key={amenity} className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
          <i className={`fa-solid ${icon === 'elevator' ? 'fa-elevator' : icon} text-brand-blue text-sm`} />
        </div>
        <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{amenity}</span>
      </div>
    );
  };

  const renderHighlightCard = (meta) => {
    const value = property[meta.key];
    if (!value || value === 'N/A' || value === '') return null;
    const displayValue = meta.key === 'status'
      ? (value === 'available' ? 'Ready to Move' : value === 'closed' ? 'Closed' : value)
      : value;
    return (
      <div key={meta.key} className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
          <i className={`fa-solid ${meta.icon} text-amber-600 text-sm`} />
        </div>
        <span className="text-xs text-gray-500 font-medium">{meta.label}</span>
        <span className="text-sm font-bold text-brand-charcoal">{displayValue}</span>
      </div>
    );
  };

  const amenities = (property.amenities?.length > 0 ? property.amenities : ['Swimming Pool', '24/7 Security', 'Gym', 'Power Backup', 'Club House', 'Park']).slice(0, 16);

  return (
    <div className="min-h-screen bg-gray-50">
      {galleryOpen && (
        <GalleryModal images={property.images} index={currentImageIndex} onClose={() => setGalleryOpen(false)} onPrev={goPrev} onNext={goNext} />
      )}

      {/* ─── HERO SECTION ─── */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pt-16 lg:pt-14">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <button onClick={goBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-blue transition-colors shrink-0">
              <i className="fa-solid fa-arrow-left" /> Back to Properties
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left — Gallery */}
            <div className="lg:col-span-7 space-y-3">
              <div className="relative h-[300px] sm:h-[420px] lg:h-[520px] overflow-hidden rounded-2xl bg-gray-100 shadow-sm group cursor-pointer" onClick={() => setGalleryOpen(true)}>
                <img
                  key={currentImageIndex}
                  src={resolveImage(property.images[currentImageIndex])}
                  alt={property.title}
                  className="gallery-fade h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <i className="fa-solid fa-chevron-left" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); goNext(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <i className="fa-solid fa-chevron-right" />
                </button>
                <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium">
                  <i className="fa-solid fa-image mr-1" /> {property.images.length} Photos
                </div>
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium">
                  <i className="fa-solid fa-magnifying-glass-plus mr-1" /> Click to view
                </div>
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {property.images.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                        idx === currentImageIndex
                          ? 'border-brand-blue ring-2 ring-brand-blue/25 shadow-md scale-[1.02]'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                      }`}>
                      <img src={resolveImage(img)} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right — Info Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-brand-blue/10 text-brand-blue text-[11px] font-bold px-3 py-0.5">{property.propertyType || 'Property'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-charcoal leading-tight">{property.title}</h1>
                {property.subtitle && <p className="mt-1 text-sm text-gray-500">{property.subtitle}</p>}
                <p className="mt-2 text-sm text-gray-500 flex items-center gap-1.5">
                  <i className="fa-solid fa-location-dot text-brand-blue text-xs" />
                  {property.location}{property.zone ? ` (${property.zone})` : ''}{property.pincode ? ` — ${property.pincode}` : ''}
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-brand-charcoal">{property.price}</span>
                {property.priceSuffix && <span className="text-gray-400 text-sm font-medium">{property.priceSuffix}</span>}
              </div>
              {property.priceNote && <p className="mt-1 text-[11px] text-gray-400">{property.priceNote}</p>}

              <div className="flex flex-wrap gap-2">
                {property.bhk && property.bhk !== 'N/A' && <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{property.bhk}</span>}
                {property.area && <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{property.area}</span>}
                {property.furnishing && property.furnishing !== 'N/A' && <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{property.furnishing}</span>}
                <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${property.status === 'available' ? 'bg-emerald-100 text-emerald-700' : property.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {property.status === 'available' ? (property.possession || '✓ Ready to Move') : property.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                <span><i className="fa-solid fa-hashtag mr-1 text-gray-300" /> ID: {property.id || property._id?.slice(-6)}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <i className="fa-regular fa-heart" /> Save
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <i className="fa-solid fa-share-nodes" /> Share
                </button>
              </div>

              {/* Primary CTAs */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setEnquiryOpen(true)} className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue text-white px-4 py-3 text-sm font-bold hover:bg-brand-navy transition-colors">
                    <i className="fa-solid fa-paper-plane" /> Enquire Now
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-3 text-sm font-bold hover:bg-emerald-700 transition-colors">
                    <i className="fa-brands fa-whatsapp" /> WhatsApp
                  </a>
                  <Link to="/contact-us/" className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 text-white px-4 py-3 text-sm font-bold hover:bg-amber-600 transition-colors">
                    <i className="fa-solid fa-headset" /> Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT (70/30) ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* LEFT — 70% */}
          <div className="lg:col-span-8 space-y-6">

            {/* Property Highlights */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
              <h2 className="text-base font-bold text-brand-charcoal mb-4 flex items-center gap-2">
                <i className="fa-solid fa-star text-amber-500 text-sm" /> Property Highlights
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PROPERTY_HIGHLIGHTS_META.map(renderHighlightCard)}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
                  <i className="fa-solid fa-info text-brand-blue text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Description</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                {showFullDesc || !property.description || property.description.length < 300
                  ? property.description
                  : property.description.slice(0, 300) + '...'}
              </p>
              {property.description && property.description.length > 300 && (
                <button onClick={() => setShowFullDesc(!showFullDesc)} className="mt-2 text-sm font-semibold text-brand-blue hover:text-brand-navy transition-colors">
                  {showFullDesc ? 'Read Less' : 'Read More'} <i className={`fa-solid fa-chevron-${showFullDesc ? 'up' : 'down'} text-xs ml-1`} />
                </button>
              )}
            </div>

            {/* Amenities */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <i className="fa-solid fa-star text-purple-600 text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Amenities & Features</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {amenities.map(renderAmenityCard)}
              </div>
            </div>

            {/* Property Facts */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <i className="fa-solid fa-table-list text-gray-600 text-xs" />
                </div>
                <h2 className="text-base font-bold text-brand-charcoal">Property Facts</h2>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  { label: 'Property Type', value: property.propertyType || property.bhk },
                  { label: 'Area', value: property.area },
                  { label: 'Size', value: property.sizeRange },
                  { label: 'Bedrooms', value: property.bhk },
                  { label: 'Unit Options', value: property.unitOptions?.join(', ') },
                  { label: 'EOI Options', value: property.eoiOptions?.join(', ') },
                  { label: 'Price Range', value: property.priceRange },
                  { label: 'Furnishing', value: property.furnishing },
                  { label: 'Possession', value: property.possession || (property.status === 'available' ? 'Ready to Move' : property.status) },
                  { label: 'Approval', value: property.approval },
                  { label: 'Pincode', value: property.pincode },
                ].filter(f => f.value && f.value !== 'N/A').map((f) => (
                  <div key={f.label} className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">{f.label}</span>
                    <span className="font-semibold text-brand-charcoal">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listed By */}
            {property.agent && (
              <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <i className="fa-solid fa-user-tie text-amber-600 text-xs" />
                  </div>
                  <h2 className="text-base font-bold text-brand-charcoal">Listed By</h2>
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={resolveImage(property.agent.avatar)} alt={property.agent.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] border-2 border-white">
                      <i className="fa-solid fa-check" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-brand-charcoal">{property.agent.name}</h3>
                      <span className="rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold px-2 py-0.5">{property.agent.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">5 years experience · English, Hindi, Kannada</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span><span className="font-bold text-brand-charcoal">{property.projectCount || 12}</span> Properties</span>
                      <span><span className="font-bold text-emerald-600">&lt; 5 min</span> Response</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => setEnquiryOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-brand-blue text-white px-4 py-2 text-xs font-semibold hover:bg-brand-navy transition-colors">
                        <i className="fa-solid fa-paper-plane" /> Enquire Now
                      </button>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white px-4 py-2 text-xs font-semibold hover:bg-emerald-700 transition-colors">
                        <i className="fa-brands fa-whatsapp" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brochure Download */}
            {property.brochure && (
              <a href={property.brochure} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <i className="fa-solid fa-file-pdf text-red-500 text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-charcoal">Download Brochure</p>
                  <p className="text-xs text-gray-500">Get detailed information about this property</p>
                </div>
                <i className="fa-solid fa-download text-brand-blue" />
              </a>
            )}

            {property.videoUrl && (
              <a href={property.videoUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <i className="fa-solid fa-circle-play text-red-500 text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-charcoal">Project Video</p>
                  <p className="text-xs text-gray-500">Watch the walkthrough of this property</p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-brand-blue" />
              </a>
            )}

            {/* Similar Properties */}
            {similarProperties.length > 0 && (
              <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
                    <i className="fa-solid fa-building text-brand-blue text-sm" /> Similar Properties
                  </h2>
                  <div className="flex gap-1">
                    <button onClick={() => { similarRef.current?.scrollBy({ left: -300, behavior: 'smooth' }); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <i className="fa-solid fa-chevron-left text-xs" />
                    </button>
                    <button onClick={() => { similarRef.current?.scrollBy({ left: 300, behavior: 'smooth' }); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                      <i className="fa-solid fa-chevron-right text-xs" />
                    </button>
                  </div>
                </div>
                <div ref={similarRef} className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 scrollbar-hide">
                  {similarProperties.map((sp) => (
                    <PropertyCard key={sp._id || sp.id} property={sp} />
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed */}
            <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-brand-charcoal flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-gray-400 text-sm" /> Recently Viewed
                </h2>
              </div>
              <div className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 scrollbar-hide">
                {[property, ...similarProperties.slice(0, 4)].filter(Boolean).map((sp, i) => (
                  <PropertyCard key={(sp._id || sp.id) + '-recent-' + i} property={sp} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Sticky Sidebar (30%) */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-brand-charcoal mb-1">Interested?</h3>
                <p className="text-xs text-gray-500 mb-4">Take the next step towards your dream property.</p>

                <div className="space-y-2">
                  <button onClick={() => setEnquiryOpen(true)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-blue text-white px-4 py-3 text-sm font-bold hover:bg-brand-navy transition-colors">
                    <i className="fa-solid fa-paper-plane" /> Enquire Now
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 text-sm font-bold hover:bg-emerald-700 transition-colors">
                    <i className="fa-brands fa-whatsapp" /> WhatsApp
                  </a>
                  <Link to="/contact-us/" className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-500 text-white px-4 py-3 text-sm font-bold hover:bg-amber-600 transition-colors">
                    <i className="fa-solid fa-headset" /> Contact Us
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <i className="fa-regular fa-heart" /> Save
                  </button>
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <i className="fa-solid fa-share-nodes" /> Share
                  </button>
                </div>
              </div>

              {/* Agent Mini Card */}
              {property.agent && (
                <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Listed By</h3>
                  <div className="flex items-center gap-3">
                    <img src={resolveImage(property.agent.avatar)} alt={property.agent.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm font-bold text-brand-charcoal">{property.agent.name}</p>
                      <p className="text-xs text-gray-500">{property.agent.type}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE STICKY BOTTOM BAR ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex items-center gap-2 px-4 py-3">
          <button onClick={() => setEnquiryOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue text-white py-3 text-xs font-bold">
            <i className="fa-solid fa-paper-plane" /> Enquire Now
          </button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white py-3 text-xs font-bold">
            <i className="fa-brands fa-whatsapp" /> WhatsApp
          </a>
          <Link to="/contact-us/" className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 text-white py-3 text-xs font-bold">
            <i className="fa-solid fa-headset" /> Contact Us
                  </Link>
          <button className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 px-4 text-xs font-semibold text-gray-600">
            <i className="fa-regular fa-heart" />
          </button>
          <button className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 px-4 text-xs font-semibold text-gray-600">
            <i className="fa-regular fa-heart" />
          </button>
          <button onClick={handleShare} className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3 px-4 text-xs font-semibold text-gray-600">
            <i className="fa-solid fa-share-nodes" />
          </button>
        </div>
      </div>

      {/* Remove mobile bottom padding since sticky bar overlaps */}
      <div className="h-20 lg:hidden" />

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} propertyTitle={property.title} />
    </div>
  );
}

export default PropertyDetails;
