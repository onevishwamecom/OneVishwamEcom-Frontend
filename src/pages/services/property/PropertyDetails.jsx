import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperties, usePropertyById, useSimilarProperties } from '../../../hooks/useProperties';
import { MasterDetailPage } from '../shared';
import { withRupeeSymbol } from '../../../utils/priceUtils';
import { getPropertyStatusPill, getPropertyTypeLabel } from './propertyHelpers';
import PropertySpecsGrid from './components/PropertySpecsGrid';
import PropertyAmenitiesGrid from './components/PropertyAmenitiesGrid';
import PropertyDescriptionCard from './components/PropertyDescriptionCard';
import PropertyFactsCard from './components/PropertyFactsCard';
import PropertyActionsCard from './components/PropertyActionsCard';
import PropertyLoanCard from './components/PropertyLoanCard';
import PropertyGalleryModal from './components/PropertyGalleryModal';
import EnquiryModal from '../../../components/EnquiryModal';
import ListingCard from '../shared/cards/ListingCard';

const FALLBACK_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="none"><rect width="400" height="300" fill="#f3f4f6"/><path fill="#9ca3af" d="M160 130h80v-10l-40-40-40 40v10zm-20 50h120v-60l-40-40-80 80v20z"/></svg>`,
  );

/**
 * Real Estate Property Detail Page
 */
export default function PropertyDetails() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'OneVishwam Property', url });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn('Share failed:', err);
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (e) {
      prompt('Copy the link manually:', url);
    }
  };

  return (
    <MasterDetailPage
      sector="property"
      hooks={{
        useItems: useProperties,
        useItemById: usePropertyById,
      }}
      authTitle="Login to View Property Details"
      authMessage="Please log in or create an account to view full floor plans, pricing breakdowns, amenities, and owner contact details."
      backUrl="/our-services/real-estate-property"
      backLabel="Back to Properties"
      notFoundMessage="Property not found"
      customHero={({ item, normalized, images }) => {
        const title = item?.title || item?.name || normalized?.title || 'Property Listing';
        const overline = item?.subCategory || getPropertyTypeLabel(item || {}) || 'Flat';
        const location = (typeof item?.location === 'string' && item.location) || item?.location?.area || item?.area || item?.city || item?.zone || normalized?.location || '';
        const pincode = item?.pincode || item?.location?.pincode || '';
        const locationLine = pincode ? `${location} · ${pincode}` : location;
        const rawPrice = item?.price ?? item?.priceValue ?? item?.numericPrice ?? item?.rent ?? null;
        const price = rawPrice != null && rawPrice !== '' ? withRupeeSymbol(rawPrice) : '';
        const priceSuffix = item?.priceSuffix || '';
        const badges = Array.isArray(normalized?.badges) ? normalized.badges : [];
        const tags = Array.isArray(normalized?.tags) ? normalized.tags : [];
        const statusPill = getPropertyStatusPill(item || {});

        const displayPills = [
          ...(tags && tags.length > 0 ? tags.map((t) => ({ label: t, cls: 'bg-gray-100 text-gray-700' })) : []),
          ...(statusPill ? [{ label: statusPill.label, cls: statusPill.cls }] : []),
          ...badges.filter((b) => b.label !== statusPill?.label).map((b) => ({ label: b.label, cls: b.cls || b.className })),
        ];

        const imageList = Array.isArray(images) && images.length > 0 ? images : [FALLBACK_IMG];
        const currentImage = imageList[activeImg] || imageList[0] || FALLBACK_IMG;

        // Fetch similar properties
        const { similar = [] } = useSimilarProperties(item?.id || item?._id);
        const { data: allProperties = [] } = useProperties();
        const recentlyViewed = allProperties.slice(0, 3); // Mocking recently viewed

        return (
          <div className="flex flex-col w-full">
            {/* Top White Section */}
            <div className="bg-white border-b border-gray-100 py-6 sm:py-8">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-12 items-start">
                  
                  {/* Left: Gallery */}
                  <div className="lg:col-span-6 space-y-3">
                    <div
                      className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm relative group cursor-pointer"
                      onClick={() => {
                        if (imageList.length > 1) setGalleryOpen(true);
                      }}
                    >
                      <img
                        src={currentImage}
                        alt={title}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-2 opacity-90 transition-opacity">
                        <i className="fa-solid fa-magnifying-glass-plus" /> Click to view
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white flex items-center gap-2 opacity-90 transition-opacity">
                        <i className="fa-solid fa-image" /> {imageList.length || 1} Photos
                      </div>
                    </div>
                    {imageList.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 mt-3">
                        {imageList.slice(0, 6).map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImg(idx)}
                            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                              idx === activeImg
                                ? 'border-brand-blue ring-2 ring-brand-blue/20'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`${title} view ${idx + 1}`} className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Title, Price, Pills, ID, Actions */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="space-y-4">
                      {overline && (
                        <span className="inline-block rounded-full bg-blue-100 text-brand-blue px-3 py-1.5 text-[11px] font-bold tracking-wider">
                          {overline}
                        </span>
                      )}
                      <div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-brand-charcoal mb-1">
                          {title}
                        </h1>
                        <p className="text-sm font-medium text-gray-500">
                          {item?.subtitle || item?.builder || item?.category || 'Unique Prime City'}
                        </p>
                      </div>
                      
                      {locationLine && (
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <i className="fa-solid fa-location-dot text-brand-blue text-sm" />
                          {locationLine}
                        </p>
                      )}
                      
                      {price && (
                        <p className="text-4xl font-black text-brand-charcoal pt-2">
                          {price}
                          {priceSuffix && (
                            <span className="text-sm font-medium text-gray-500 ml-2">{priceSuffix}</span>
                          )}
                        </p>
                      )}
                      
                      {displayPills.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {displayPills.map((b, idx) => (
                            <span
                              key={idx}
                              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                                b.cls || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {b.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <PropertyActionsCard
                      property={item}
                      onEnquire={() => setEnquiryOpen(true)}
                      onShare={handleShare}
                      isSticky={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Gray Section */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
              <div className="grid gap-8 lg:grid-cols-12 items-start">
                
                {/* Left: Highlights, Description, Amenities, Similar */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Highlights */}
                  <div className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-brand-charcoal mb-6 flex items-center gap-3">
                      <i className="fa-solid fa-star text-amber-500 text-base" /> Property Highlights
                    </h2>
                    <PropertySpecsGrid property={item} />
                  </div>

                  {/* Description */}
                  <PropertyDescriptionCard description={item.description} />

                  {/* Amenities */}
                  <div className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <i className="fa-solid fa-star text-purple-600 text-sm" />
                      </div>
                      <h2 className="text-lg font-bold text-brand-charcoal">Amenities &amp; Features</h2>
                    </div>
                    <PropertyAmenitiesGrid amenities={item.amenities} />
                  </div>

                  {/* Property Facts */}
                  <PropertyFactsCard property={item} />

                  {/* Similar Properties */}
                  {similar && similar.length > 0 && (
                    <div className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
                      <h2 className="text-lg font-bold text-brand-charcoal mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-building text-blue-500 text-base" /> Similar Properties
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {similar.slice(0, 3).map((sim, idx) => (
                          <ListingCard key={idx} item={sim} sector="property" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recently Viewed (Mock) */}
                  {recentlyViewed && recentlyViewed.length > 0 && (
                    <div className="rounded-2xl bg-white border border-gray-100 p-6 sm:p-8 shadow-sm">
                      <h2 className="text-lg font-bold text-brand-charcoal mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-clock-rotate-left text-gray-500 text-base" /> Recently Viewed
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {recentlyViewed.map((rv, idx) => (
                          <ListingCard key={idx} item={rv} sector="property" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Sticky Sidebar */}
                <div className="lg:col-span-4 space-y-6 sticky top-24">
                  <PropertyActionsCard
                    property={item}
                    onEnquire={() => setEnquiryOpen(true)}
                    onShare={handleShare}
                    isSticky={true}
                  />
                  <PropertyLoanCard property={item} />
                </div>
              </div>
            </div>
          </div>
        );
      }}
      modalsSlot={({ item }) => {
        const images = Array.isArray(item.images) && item.images.length > 0
          ? item.images
          : item.image
            ? [item.image]
            : [];
        return (
          <>
            {galleryOpen && images.length > 0 && (
              <PropertyGalleryModal
                images={images}
                index={activeImg}
                onClose={() => setGalleryOpen(false)}
              />
            )}

            {enquiryOpen && (
              <EnquiryModal
                isOpen={enquiryOpen}
                onClose={() => setEnquiryOpen(false)}
                propertyTitle={item.title || item.name}
                propertyId={item.id || item._id}
              />
            )}
          </>
        );
      }}
    />
  );
}
