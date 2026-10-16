import React, { useMemo, useState, useEffect } from 'react';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

export default function BeddingDetails({ item = null, similarItems = [] }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Reset selected variant whenever item changes
  useEffect(() => {
    setSelectedVariantIndex(0);
  }, [item?.id]);

  const variants = item?.variants || [];
  const currentVariant = variants[selectedVariantIndex] || variants[0] || null;

  // Dynamically update product data based on selected variant
  const displayedItem = useMemo(() => {
    if (!item) return null;
    if (!currentVariant || variants.length <= 1) return item;

    // Enhanced keyAttributes reflecting chosen variant
    const keyAttributes = [
      ...(item.keyAttributes || []).filter(
        (a) => a.label !== 'Selected Size' && a.label !== 'Selected Size / Variant' && a.label !== 'Dimensions'
      ),
      {
        label: 'Selected Size / Variant',
        value: currentVariant.name,
      },
    ];

    if (currentVariant.dimension) {
      keyAttributes.push({
        label: 'Dimensions',
        value: currentVariant.dimension,
      });
    }

    if (currentVariant.thickness) {
      keyAttributes.push({
        label: 'Thickness / Loft',
        value: currentVariant.thickness,
      });
    }

    // Dynamic overview highlights
    const overviewHighlights = [
      {
        label: 'Selected Size',
        value: currentVariant.name,
        icon: 'fa-bed',
        color: 'text-blue-600 bg-blue-50',
      },
      {
        label: 'Special Offer Price',
        value: currentVariant.price,
        icon: 'fa-tag',
        color: 'text-emerald-600 bg-emerald-50',
      },
      ...(item.overviewHighlights || []).slice(0, 2),
    ];

    return {
      ...item,
      price: currentVariant.price,
      priceSuffix: `(MRP ${currentVariant.mrp} · ${currentVariant.discount || '15% Off'})`,
      priceNote: `Selected Size: ${currentVariant.name} · Direct Manufacturer Warranty · Free Delivery`,
      keyAttributes,
      overviewHighlights,
    };
  }, [item, currentVariant, variants.length]);

  // Header Dropdown for instant variant switching
  const headerVariantDropdown = variants.length > 1 && (
    <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5 max-w-2xl">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="variant-select-bedding"
          className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
        >
          <i className="fa-solid fa-bed text-brand-blue" />
          <span>Select Size / Variant ({variants.length} Sizes Available):</span>
        </label>
        {currentVariant && (
          <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/70 border border-emerald-300/80 px-2.5 py-0.5 rounded-full">
            Offer: {currentVariant.price}
          </span>
        )}
      </div>

      <div className="relative">
        <select
          id="variant-select-bedding"
          value={selectedVariantIndex}
          onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
          className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm font-bold text-brand-charcoal focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all cursor-pointer shadow-2xs"
        >
          {variants.map((v, idx) => (
            <option key={idx} value={idx}>
              {v.name} — {v.price} (MRP: {v.mrp})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
          <i className="fa-solid fa-chevron-down text-xs" />
        </div>
      </div>

      {currentVariant && (
        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-gray-500">
          {currentVariant.dimension && (
            <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
              <i className="fa-solid fa-ruler-combined text-brand-blue text-[10px]" />
              {currentVariant.dimension}
            </span>
          )}
          {currentVariant.thickness && (
            <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
              <i className="fa-solid fa-layer-group text-emerald-600 text-[10px]" />
              {currentVariant.thickness}
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
            <i className="fa-solid fa-percent text-indigo-600 text-[10px]" />
            {currentVariant.discount || 'Special Discount'}
          </span>
        </div>
      )}
    </div>
  );

  // Dedicated Variant Lineup & Pricing Table Card
  const variantDashboard = variants.length > 1 && currentVariant && (
    <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center text-base">
            <i className="fa-solid fa-tag" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-brand-charcoal">
              Available Sizes & Price Schedule
            </h2>
            <p className="text-xs text-gray-500">
              Official Bedding Lineup & Size Configurations
            </p>
          </div>
        </div>

        {/* Dropdown Selector in Module */}
        <div className="relative min-w-[260px] sm:w-auto">
          <select
            value={selectedVariantIndex}
            onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
            className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50/80 px-3.5 py-2 pr-9 text-xs font-bold text-brand-charcoal hover:bg-white focus:bg-white focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all cursor-pointer shadow-2xs"
          >
            {variants.map((v, idx) => (
              <option key={idx} value={idx}>
                {v.name} ({v.price})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <i className="fa-solid fa-chevron-down text-[10px]" />
          </div>
        </div>
      </div>

      {/* Selected Variant Highlight Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-blue">
            Selected Size & Configuration
          </span>
          <h3 className="text-base sm:text-lg font-black text-brand-charcoal mt-0.5">
            {currentVariant.name}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {currentVariant.dimension && (
              <span className="rounded-full bg-blue-100/70 text-blue-800 text-xs font-bold px-3 py-1">
                Dimension: {currentVariant.dimension}
              </span>
            )}
            {currentVariant.thickness && (
              <span className="rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold px-3 py-1">
                Thickness: {currentVariant.thickness}
              </span>
            )}
            <span className="rounded-full bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1">
              Direct Factory Warranty
            </span>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-semibold text-gray-500 line-through block">
            MRP {currentVariant.mrp}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-brand-charcoal tracking-tight">
            {currentVariant.price}
          </span>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md inline-block mt-1">
            {currentVariant.discount || 'Special Offer'}
          </span>
        </div>
      </div>

      {/* Responsive Size Comparison Table */}
      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
          <i className="fa-solid fa-list-check text-brand-blue" />
          Compare All {variants.length} Sizes for {item.title}
        </h4>

        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Size Option</th>
                <th className="py-3 px-3">Dimensions</th>
                <th className="py-3 px-3">Thickness / Fit</th>
                <th className="py-3 px-3 text-gray-400">MRP</th>
                <th className="py-3 px-4 text-brand-charcoal">Special Price</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {variants.map((v, idx) => {
                const isSelected = idx === selectedVariantIndex;

                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 font-bold text-brand-blue'
                        : 'hover:bg-gray-50/80 text-brand-charcoal'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <i className="fa-solid fa-circle-check text-brand-blue text-xs" />
                        )}
                        <span>{v.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-600">{v.dimension || '—'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-600">{v.thickness || '—'}</span>
                    </td>
                    <td className="py-3 px-3 line-through text-gray-400">{v.mrp}</td>
                    <td className="py-3 px-4 font-extrabold text-brand-charcoal">{v.price}</td>
                    <td className="py-3 px-3 text-right">
                      {isSelected ? (
                        <span className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-[10px] font-extrabold inline-flex items-center gap-1 shadow-2xs">
                          <i className="fa-solid fa-check text-[9px]" /> Selected
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-brand-blue hover:text-brand-blue px-2.5 py-1 text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );

  return (
    <MasterDetailPage
      item={displayedItem}
      categoryName="Bedding & Comfort"
      categoryLink="/our-services/bedding-comfort"
      similarItems={similarItems}
      itemLinkPrefix="/bedding/"
      bentoTitle="Product Key Specifications & Mattress Dimensions"
      featuresTitle="Certified Standards & Comfort Features"
      headerExtra={headerVariantDropdown}
    >
      {variantDashboard}
    </MasterDetailPage>
  );
}
