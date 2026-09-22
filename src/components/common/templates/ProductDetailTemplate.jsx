import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Share2,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

const FALLBACK_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="none"><rect width="800" height="600" fill="#f8fafc"/><path fill="#cbd5e1" d="M320 260h160v-20l-80-80-80 80v20zm-40 100h240v-120l-80-80-160 160v40z"/></svg>`
);

/**
 * Unified ProductDetailTemplate for Entity / Listing Detail Pages.
 * Displays:
 * 1. Visual gallery with active thumbnail selector.
 * 2. Overview badges grid based on keyAttributes.
 * 3. Description text block.
 * 4. Dynamic 2-column specifications breakdown mapped over `specs` (groupName + key-value rows).
 * 5. Sticky right-side panel with price, seller profile with verification badge, and inquiry CTA buttons (Call, WhatsApp/Chat).
 */
export default function ProductDetailTemplate({
  item,
  backLink = '/our-services/real-estate-property',
  backLabel = 'Back to Listings',
  onCall,
  onWhatsApp,
  onEnquire,
  extraSections,
  children,
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [faved, setFaved] = useState(false);
  const [shared, setShared] = useState(false);

  if (!item) {
    return (
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold text-slate-400">Listing not found</h1>
        <Link
          to={backLink}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
      </div>
    );
  }

  const images = item.images && item.images.length > 0 ? item.images : [FALLBACK_IMG];
  const activeImage = images[activeImageIndex] || images[0];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} on OneVishwam`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // Ignored
    }
  };

  const sellerPhone = item.seller?.phone || '8546996622';
  const sellerWhatsApp = item.seller?.whatsapp || sellerPhone;

  return (
    <div className="pb-24 pt-16 lg:pt-14 bg-slate-50/50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Top Bar: Back Link + Quick Actions ── */}
        <div className="flex items-center justify-between py-4">
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
              title="Share listing"
              aria-label="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFaved(!faved)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
              title="Save listing"
              aria-label="Save listing"
            >
              <Heart className={`w-4 h-4 ${faved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            {shared && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                Link copied!
              </span>
            )}
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* ════════════════════════════════════════════════════
              LEFT COLUMN: Media Gallery, Overview, Specs, Details
              ════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Visual Gallery with Active Thumbnail Selector */}
            <div className="space-y-3 bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={activeImage}
                  alt={item.title}
                  className="h-full w-full object-cover transition-all duration-300"
                />

                {/* Badges Overlay */}
                {item.badges && item.badges.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    {item.badges.map((b, i) => {
                      const label = typeof b === 'string' ? b : b.label;
                      const className = typeof b === 'string' ? 'bg-brand-blue text-white' : (b.className || 'bg-brand-blue text-white');
                      return (
                        <span
                          key={i}
                          className={`rounded-lg px-3 py-1 text-xs font-bold shadow-md backdrop-blur-xs ${className}`}
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold backdrop-blur-xs">
                  {activeImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnail Selector Carousel */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-16 sm:h-20 w-24 sm:w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-brand-blue ring-2 ring-brand-blue/30 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Overview Header & Badges Grid based on keyAttributes */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
                  {item.title}
                </h1>
                {item.location && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {item.location}
                      {item.pincode ? ` - ${item.pincode}` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Attributes Overview Grid */}
              {item.keyAttributes && item.keyAttributes.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                    <span>Key Highlights</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {item.keyAttributes.map((attr, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between gap-1"
                      >
                        <span className="text-xs text-slate-500 font-medium truncate">
                          {attr.label}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Description Text Block */}
              {item.description && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Description & Overview
                  </h3>
                  <div className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {item.description}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Dynamic 2-Column Specifications Breakdown (specs: groupName + key-value rows) */}
            {item.specs && item.specs.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Detailed Specifications
                </h2>

                <div className="space-y-6">
                  {item.specs.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                        {group.groupName}
                      </h4>

                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                        {group.items.map((spec, specIdx) => (
                          <div
                            key={specIdx}
                            className="flex items-baseline justify-between py-1.5 border-b border-slate-100/70 text-sm"
                          >
                            <span className="text-slate-500 font-medium text-xs sm:text-sm">
                              {spec.key}
                            </span>
                            <span className="text-slate-900 font-semibold text-right text-xs sm:text-sm">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Extensible Custom Sections (e.g. Video tour, Floor plan, Loan calculator) */}
            {extraSections}
            {children}
          </div>

          {/* ════════════════════════════════════════════════════
              RIGHT COLUMN: Sticky Price & Seller Inquiry Panel
              ════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            {/* Price & Primary CTA Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 space-y-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Listed Price
                </span>
                <div className="mt-1 flex items-baseline gap-2 flex-wrap">
                  <span className={item.price === 'This is negotiable' ? "text-xl sm:text-2xl font-normal text-slate-500" : "text-3xl font-extrabold text-slate-900 tracking-tight"}>
                    {item.price}
                  </span>
                  {item.priceSubtext && (
                    <span className="text-sm font-medium text-slate-500">
                      {item.priceSubtext}
                    </span>
                  )}
                </div>
              </div>

              {/* Seller Profile Block */}
              {item.seller && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-lg shrink-0">
                      {item.seller.avatar ? (
                        <img
                          src={item.seller.avatar}
                          alt={item.seller.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        item.seller.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.seller.name}
                        </h4>
                        {item.seller.verified && (
                          <CheckCircle2
                            className="w-4 h-4 text-brand-blue shrink-0"
                            title="Verified Partner"
                          />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {item.seller.type || 'Verified Partner'}
                      </p>
                    </div>
                  </div>

                  {item.seller.verified && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified & Trusted Partner</span>
                    </div>
                  )}
                </div>
              )}

              {/* Inquiry Action Buttons (Call, WhatsApp, Enquire) */}
              <div className="space-y-2.5 pt-1">
                {onEnquire ? (
                  <button
                    type="button"
                    onClick={onEnquire}
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Enquire Now</span>
                  </button>
                ) : (
                  <a
                    href={`tel:${sellerPhone}`}
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-blue hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Seller</span>
                  </a>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${sellerPhone}`}
                    onClick={onCall}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`https://wa.me/${sellerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hi, I am interested in ${item.title} on OneVishwam.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onWhatsApp}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Assurance Trust Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Verified Documentation
                </span>
                <span>Zero Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
