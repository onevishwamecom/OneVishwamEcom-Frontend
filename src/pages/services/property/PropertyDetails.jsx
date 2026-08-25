import React, { useState } from 'react';
import { useProperties, usePropertyById } from '../../../hooks/useProperties';
import { MasterDetailPage } from '../shared';
import PropertySpecsGrid from './components/PropertySpecsGrid';
import PropertyAmenitiesGrid from './components/PropertyAmenitiesGrid';
import PropertyDescriptionCard from './components/PropertyDescriptionCard';
import PropertyFactsCard from './components/PropertyFactsCard';
import PropertyActionsCard from './components/PropertyActionsCard';
import PropertyLoanCard from './components/PropertyLoanCard';
import PropertyGalleryModal from './components/PropertyGalleryModal';
import EnquiryModal from '../../../components/EnquiryModal';

/**
 * Real Estate Property Detail Page
 * Thin declarative wrapper powered by MasterDetailPage.
 */
export default function PropertyDetails() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

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
      sidebarSlot={({ item }) => (
        <div className="space-y-6">
          <PropertyActionsCard
            property={item}
            onEnquire={() => setEnquiryOpen(true)}
            onShare={handleShare}
          />
          <PropertyLoanCard property={item} />
        </div>
      )}
      specsSlot={({ item }) => (
        <div className="space-y-6">
          {/* Highlights */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-charcoal mb-4 flex items-center gap-2">
              <i className="fa-solid fa-star text-amber-500 text-sm" /> Property Highlights
            </h2>
            <PropertySpecsGrid property={item} />
          </div>

          {/* Description */}
          <PropertyDescriptionCard description={item.description} />

          {/* Amenities */}
          <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <i className="fa-solid fa-star text-purple-600 text-xs" />
              </div>
              <h2 className="text-base font-bold text-brand-charcoal">Amenities &amp; Features</h2>
            </div>
            <PropertyAmenitiesGrid amenities={item.amenities} />
          </div>

          {/* Property Facts */}
          <PropertyFactsCard property={item} />
        </div>
      )}
      modalsSlot={({ item }) => (
        <>
          {galleryOpen && Array.isArray(item.images) && item.images.length > 0 && (
            <PropertyGalleryModal
              images={item.images}
              index={0}
              onClose={() => setGalleryOpen(false)}
            />
          )}

          {enquiryOpen && (
            <EnquiryModal
              isOpen={enquiryOpen}
              onClose={() => setEnquiryOpen(false)}
              propertyTitle={item.title}
              propertyId={item.id || item._id}
            />
          )}
        </>
      )}
    />
  );
}
