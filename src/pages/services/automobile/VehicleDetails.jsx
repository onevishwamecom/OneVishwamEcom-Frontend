import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { dummyAutomobiles } from '../../../data/dummyAutomobiles';
import MasterDetailPage from '../../../components/common/templates/MasterDetailPage';

function isAutoVariant(name = '') {
  const upper = name.toUpperCase();
  return upper.includes('AGS') || upper.includes(' 6AT') || upper.includes(' AT') || upper.includes('AUTOMATIC');
}

function isCngVariant(name = '') {
  return name.toUpperCase().includes('CNG');
}

export default function VehicleDetails() {
  const { pathname } = useLocation();
  const pathParts = pathname.split('/').filter(Boolean);
  const vehicleId = pathParts.length > 1 ? pathParts[1] : null;

  const vehicle = useMemo(() => {
    if (!vehicleId) return null;
    return dummyAutomobiles.find((v) => String(v.id) === String(vehicleId)) || null;
  }, [vehicleId]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [filterType, setFilterType] = useState('ALL');

  // Reset selected variant whenever car changes
  useEffect(() => {
    setSelectedVariantIndex(0);
    setFilterType('ALL');
  }, [vehicleId]);

  const variants = vehicle?.variants || [];
  const currentVariant = variants[selectedVariantIndex] || variants[0] || null;

  // Filtered variant list for comparison table
  const filteredVariants = useMemo(() => {
    if (!variants.length) return [];
    if (filterType === 'PETROL') return variants.filter((v) => !isCngVariant(v.variant));
    if (filterType === 'CNG') return variants.filter((v) => isCngVariant(v.variant));
    if (filterType === 'MANUAL') return variants.filter((v) => !isAutoVariant(v.variant));
    if (filterType === 'AUTOMATIC') return variants.filter((v) => isAutoVariant(v.variant));
    return variants;
  }, [variants, filterType]);

  const counts = useMemo(() => {
    return {
      all: variants.length,
      petrol: variants.filter((v) => !isCngVariant(v.variant)).length,
      cng: variants.filter((v) => isCngVariant(v.variant)).length,
      manual: variants.filter((v) => !isAutoVariant(v.variant)).length,
      automatic: variants.filter((v) => isAutoVariant(v.variant)).length,
    };
  }, [variants]);

  // Dynamically update vehicle data based on the chosen variant
  const displayedVehicle = useMemo(() => {
    if (!vehicle) return null;
    if (!currentVariant) return vehicle;

    const isAuto = isAutoVariant(currentVariant.variant);
    const isCNG = isCngVariant(currentVariant.variant);
    const transmissionText = isAuto
      ? currentVariant.variant.toUpperCase().includes('6AT')
        ? 'Automatic (6AT)'
        : 'Automatic (AGS)'
      : '5-Speed Manual';
    const fuelText = isCNG ? 'Factory S-CNG' : 'Petrol';

    return {
      ...vehicle,
      subtitle: `${currentVariant.variant} · ${transmissionText} · ${fuelText} · Kalyani Motors Bangalore`,
      price: 'This is negotiable',
      priceSuffix: '',
      priceNote: '',
      fuelType: fuelText,
      transmission: transmissionText,
      statusBadges: [
        { label: 'Brand New', variant: 'green' },
        { label: transmissionText, variant: 'blue' },
        { label: fuelText, variant: 'amber' },
        { label: 'Kalyani Motors', variant: 'blue' },
      ],
      cardPills: [transmissionText, fuelText],
      keyAttributes: [
        { label: 'Selected Variant', value: currentVariant.variant },
        { label: 'Transmission', value: transmissionText },
        { label: 'Fuel System', value: isCNG ? 'Bi-Fuel S-CNG & Petrol' : 'Petrol' },
        { label: 'Dealership', value: 'Kalyani Motors, Bangalore' },
      ],
      overviewHighlights: [
        { label: 'Selected Variant', value: currentVariant.variant, icon: 'fa-car-side', color: 'text-blue-600 bg-blue-50' },
        { label: 'Powertrain & Gearbox', value: `${fuelText} · ${transmissionText}`, icon: 'fa-gear', color: 'text-cyan-600 bg-cyan-50' },
        { label: 'Standard Safety', value: '6 Airbags Standard Across All Variants', icon: 'fa-shield-halved', color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Authorized Dealership', value: 'Kalyani Motors Pvt Ltd, Bangalore', icon: 'fa-building', color: 'text-teal-600 bg-teal-50' },
      ],
      specifications: [
        {
          title: `Selected Variant Details (${currentVariant.variant})`,
          items: [
            { label: 'Car Model', value: vehicle.title },
            { label: 'Exact Variant Name', value: currentVariant.variant },
            { label: 'Fuel System', value: isCNG ? 'Bi-Fuel (Petrol + Factory S-CNG)' : 'Direct Petrol' },
            { label: 'Transmission', value: transmissionText },
            { label: 'Dealer Support', value: 'Kalyani Motors Nayandahalli Bangalore' },
          ],
        },
        {
          title: 'Standard Factory Safety & Security Equipment',
          items: [
            { label: 'Airbags', value: '6 Airbags Standard Across All Variants' },
            { label: 'Braking System', value: 'ABS with Electronic Brakeforce Distribution (EBD)' },
            { label: 'Electronic Stability', value: 'ESP (Electronic Stability Program) Standard' },
            { label: 'Hill Assist', value: 'Hill Hold Assist' },
            { label: 'Seatbelts', value: '3-Point ELR Seatbelts for All Seats with Reminder Buzzer' },
            { label: 'Child Safety', value: 'ISOFIX Child Seat Anchorages' },
          ],
        },
        {
          title: 'Authorized Showroom & Warranty Information',
          items: [
            { label: 'Authorized Dealer', value: 'Kalyani Motors Pvt Ltd' },
            { label: 'Showroom Location', value: 'Near Nayandahalli Signal, Mysore Road Junction, Bangalore - 560039' },
            { label: 'Manufacturer Warranty', value: 'Standard 2 Years / 40,000 km (Extendable up to 5 Years)' },
            { label: 'Roadside Assistance', value: '24×7 Maruti Suzuki Emergency Roadside Support' },
            { label: 'Pre-Delivery Deliverables', value: 'Pre-activated FASTag, Registration & Number Plates' },
          ],
        },
      ],
    };
  }, [vehicle, currentVariant]);

  const similarVehicles = useMemo(() => {
    if (!vehicle) return [];
    return dummyAutomobiles
      .filter((v) => String(v.id) !== String(vehicle.id))
      .slice(0, 6);
  }, [vehicle]);

  if (!vehicle) {
    return (
      <MasterDetailPage
        item={null}
        categoryName="Vehicles"
        categoryLink="/our-services/automobile"
      />
    );
  }

  // Header Dropdown Component
  const headerVariantDropdown = variants.length > 0 && currentVariant && (
    <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Dropdown Selector Column */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="variant-select-header" className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-car-side text-brand-blue" />
              <span>Select Variant ({variants.length} Trims Available):</span>
            </label>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <i className="fa-solid fa-circle-check text-[10px]" /> Verified Dealership Stock
            </span>
          </div>

          <div className="relative">
            <select
              id="variant-select-header"
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-xs sm:text-sm font-bold text-brand-charcoal focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all cursor-pointer shadow-2xs"
            >
              {variants.map((v, idx) => (
                <option key={idx} value={idx}>
                  {v.variant}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <i className="fa-solid fa-chevron-down text-xs" />
            </div>
          </div>
        </div>

        {/* Selected Variant Quick Highlights Column */}
        <div className="lg:col-span-5 flex flex-wrap lg:flex-nowrap items-center justify-start lg:justify-end gap-2 pt-1 lg:pt-0">
          <div className="bg-white border border-gray-200/90 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs flex-1 lg:flex-initial">
            <i className="fa-solid fa-gear text-brand-blue text-sm shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase block leading-none">Transmission</span>
              <span className="text-xs font-bold text-slate-800">{isAutoVariant(currentVariant.variant) ? 'Automatic (AGS/AT)' : '5-Speed Manual'}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs flex-1 lg:flex-initial">
            <i className="fa-solid fa-gas-pump text-emerald-600 text-sm shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase block leading-none">Fuel System</span>
              <span className="text-xs font-bold text-slate-800">{isCngVariant(currentVariant.variant) ? 'Factory S-CNG' : 'Direct Petrol'}</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200/90 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs flex-1 lg:flex-initial">
            <i className="fa-solid fa-shield-halved text-indigo-600 text-sm shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase block leading-none">Safety</span>
              <span className="text-xs font-bold text-slate-800">6 Airbags</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dedicated Variant Dashboard & Pricing Table
  const variantDashboard = variants.length > 0 && currentVariant && (
    <section className="rounded-3xl bg-white border border-gray-200/70 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center text-base">
            <i className="fa-solid fa-car-side" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-brand-charcoal">
              Variant Lineup & Specifications
            </h2>
            <p className="text-xs text-gray-500">
              Official Kalyani Motors Bangalore Lineup & Trims
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
                {v.variant}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <i className="fa-solid fa-chevron-down text-[10px]" />
          </div>
        </div>
      </div>

      {/* Selected Variant Highlight Card */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-brand-navy rounded-2xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/20 border border-amber-400/40 px-2.5 py-0.5 rounded-md">
              Active Selection
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded-md">
              Kalyani Motors Authorized
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {currentVariant.variant}
          </h3>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded-lg bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 flex items-center gap-1.5 border border-white/10">
              <i className="fa-solid fa-gear text-amber-400 text-xs" />
              {isAutoVariant(currentVariant.variant) ? 'Automatic (AGS / AT)' : '5-Speed Manual'}
            </span>
            <span className="rounded-lg bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 flex items-center gap-1.5 border border-white/10">
              <i className="fa-solid fa-gas-pump text-emerald-400 text-xs" />
              {isCngVariant(currentVariant.variant) ? 'Factory S-CNG' : 'Petrol Engine'}
            </span>
            <span className="rounded-lg bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 flex items-center gap-1.5 border border-white/10">
              <i className="fa-solid fa-shield-halved text-cyan-400 text-xs" />
              6 Airbags Standard
            </span>
            <span className="rounded-lg bg-white/15 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 flex items-center gap-1.5 border border-white/10">
              <i className="fa-solid fa-award text-yellow-400 text-xs" />
              2-Yr Warranty
            </span>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
          <div className="text-left md:text-right">
            <span className="text-[11px] font-semibold text-gray-300 block">Showroom Status</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              In Stock & Ready
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('onevishwam:open_enquiry_modal', { detail: { title: `${vehicle?.title} - ${currentVariant.variant}` } }))}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 px-4 py-2 text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <i className="fa-solid fa-calendar-check" />
            <span>Book Showroom Visit</span>
          </button>
        </div>
      </div>

      {/* Variant Filter Tabs & Table */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
            <i className="fa-solid fa-list-check text-brand-blue" />
            All {variants.length} Variants for {vehicle.title}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterType('ALL')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-brand-blue text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({counts.all})
            </button>
            {counts.petrol > 0 && (
              <button
                onClick={() => setFilterType('PETROL')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'PETROL'
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Petrol ({counts.petrol})
              </button>
            )}
            {counts.cng > 0 && (
              <button
                onClick={() => setFilterType('CNG')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'CNG'
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                S-CNG ({counts.cng})
              </button>
            )}
            {counts.manual > 0 && (
              <button
                onClick={() => setFilterType('MANUAL')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'MANUAL'
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Manual ({counts.manual})
              </button>
            )}
            {counts.automatic > 0 && (
              <button
                onClick={() => setFilterType('AUTOMATIC')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filterType === 'AUTOMATIC'
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Automatic ({counts.automatic})
              </button>
            )}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Variant Name</th>
                <th className="py-3 px-3">Fuel</th>
                <th className="py-3 px-3">Transmission</th>
                <th className="py-3 px-4 text-brand-charcoal">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredVariants.map((item) => {
                const originalIndex = variants.findIndex((v) => v.variant === item.variant);
                const isSelected = originalIndex === selectedVariantIndex;

                return (
                  <tr
                    key={item.variant}
                    onClick={() => setSelectedVariantIndex(originalIndex)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 font-bold text-brand-blue'
                        : 'hover:bg-gray-50/80 text-brand-charcoal'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">
                      <div className="flex items-center gap-2">
                        {isSelected && <i className="fa-solid fa-circle-check text-brand-blue text-xs" />}
                        <span>{item.variant}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isCngVariant(item.variant) ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {isCngVariant(item.variant) ? 'S-CNG' : 'Petrol'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-gray-600">
                        {isAutoVariant(item.variant) ? 'Automatic' : 'Manual'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">Available at Showroom</td>
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
      item={displayedVehicle}
      categoryName="Vehicles"
      categoryLink="/our-services/automobile"
      similarItems={similarVehicles}
      itemLinkPrefix="/vehicle/"
      bentoTitle="Vehicle Key Specifications & Verified Details"
      featuresTitle="Factory Installed Equipment & Features"
      headerExtra={headerVariantDropdown}
    >
      {variantDashboard}
    </MasterDetailPage>
  );
}