import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../../store/authSlice';
import AuthRequiredView from '../../../../components/auth/AuthRequiredView';
import { LoadingSpinner, ErrorState } from '../LoadingError';
import DetailGallery from './DetailGallery';
import DetailHeader from './DetailHeader';
import RelatedListings from './RelatedListings';
import { normalizeListing } from '../cards/normalizeListing';

/**
 * Universal Master Detail Page Engine
 * Powers detail views across all OneVishwam sectors.
 */
export default function MasterDetailPage({
  sector = 'property',
  config = {},
  hooks = {},
  authTitle = 'Login to View Details',
  authMessage = 'Please log in to view complete details, specifications, and contact info.',
  backUrl = '/our-services',
  backLabel = 'Back to Listings',
  notFoundMessage = 'Item not found',
  customHero,
  specsSlot,
  sidebarSlot,
  floatingBarSlot,
  modalsSlot,
  renderSimilarCard,
  children,
}) {
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Extract ID from pathname: /property/:id, /vehicle/:id, /grocery/:id, etc.
  const pathParts = pathname.split('/').filter(Boolean);
  const itemId = pathParts.length > 1 ? pathParts[1] : null;

  // Execute hooks
  const { items: listItems, loading: listLoading } = hooks.useItems ? hooks.useItems() : { items: [], loading: false };
  const { item: directItem, loading: directLoading, error: directError } = hooks.useItemById ? hooks.useItemById(itemId) : { item: null, loading: false, error: null };
  const { similar: relatedItems } = hooks.useSimilarItems ? hooks.useSimilarItems(itemId) : { similar: [] };

  // Resolve item (direct API response or fallback from list)
  const foundFromList = (listItems || []).find(
    (it) => String(it._id) === String(itemId) || String(it.id) === String(itemId)
  ) || null;

  const rawItem = (directItem?.item || directItem) || (foundFromList?.item || foundFromList);
  const loading = !rawItem && (listLoading || directLoading);
  const error = !rawItem && !listLoading && !directLoading ? (directError || notFoundMessage) : null;

  // Auth Protection Gate
  if (!isLoggedIn) {
    return (
      <AuthRequiredView
        title={authTitle}
        message={authMessage}
        backUrl={backUrl}
      />
    );
  }

  // Loading View
  if (loading) {
    return <LoadingSpinner text="Loading details..." className="py-32" />;
  }

  // Error / 404 View
  if (error || !rawItem) {
    return (
      <div className="py-32 text-center">
        <ErrorState
          error={error || notFoundMessage}
          title={error ? 'Unable to load details' : notFoundMessage}
        />
        {backUrl && (
          <Link
            to={backUrl}
            className="mt-4 inline-block text-brand-blue font-semibold hover:underline text-sm"
          >
            &larr; {backLabel}
          </Link>
        )}
      </div>
    );
  }

  // Normalized data for standard header & gallery
  const normalized = normalizeListing(rawItem, sector);
  const images = Array.isArray(rawItem.images) && rawItem.images.length > 0
    ? rawItem.images
    : normalized.image
      ? [normalized.image]
      : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-32 relative">
      {/* Back Navigation Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 pt-16 lg:pt-14 flex items-center justify-between">
          <Link
            to={backUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-blue transition-colors"
          >
            <i className="fa-solid fa-arrow-left" /> {backLabel}
          </Link>
        </div>
      </div>

      {/* Hero Section: Custom or Standard 2-Column */}
      {customHero ? (
        customHero({ item: rawItem, normalized, images })
      ) : (
        <div className="bg-white border-b border-gray-100 py-6 sm:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Media Gallery */}
              <div className="lg:col-span-7">
                <DetailGallery images={images} title={normalized.title} />
              </div>

              {/* Core Information Header & Primary Actions */}
              <div className="lg:col-span-5 space-y-6">
                <DetailHeader
                  overline={normalized.overline}
                  title={normalized.title}
                  subtitle={normalized.location}
                  price={normalized.price}
                  priceSuffix={normalized.priceSuffix}
                  originalPrice={rawItem.originalPrice}
                  discount={rawItem.discount}
                  badges={normalized.badges}
                  tags={normalized.tags}
                />

                {/* Primary Action / Sidebar Slot (e.g. Purchase card, Booking form) */}
                {sidebarSlot && sidebarSlot({ item: rawItem, normalized })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Details Body */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Left Content */}
          <div className={`${sidebarSlot && customHero ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-8`}>
            {/* Specs Grid */}
            {specsSlot && specsSlot({ item: rawItem, normalized })}

            {/* Custom Domain Children / Sections */}
            {children}
          </div>

          {/* Side Content if in custom hero mode */}
          {sidebarSlot && customHero && (
            <div className="lg:col-span-4 space-y-6">
              {sidebarSlot({ item: rawItem, normalized })}
            </div>
          )}
        </div>
      </div>

      {/* Related Listings Carousel / Grid */}
      <RelatedListings
        items={relatedItems}
        sector={sector}
        renderCard={renderSimilarCard}
      />

      {/* Sticky Mobile Floating Action Bar */}
      {floatingBarSlot && floatingBarSlot({ item: rawItem, normalized })}

      {/* Modals Slot */}
      {modalsSlot && modalsSlot({ item: rawItem, normalized })}
    </div>
  );
}
