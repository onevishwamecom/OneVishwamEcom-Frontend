import React from 'react';
import { useLocation } from '../store/locationSlice';
import { cities, getCityLabel } from '../data/locations';
import { detectCurrentLocation } from '../utils/detectLocation';

export default function GalleryLocationBar({
  selectedArea,
  onAreaChange,
  className = '',
}) {
  const { selectedCity, selectCity, selectArea, detectStatus, setDetectStatus } = useLocation();

  const handleDetect = async () => {
    setDetectStatus('detecting');
    try {
      const result = await detectCurrentLocation();
      if (result) {
        selectArea({ city: result.cityId, area: result.area });
        if (onAreaChange) onAreaChange(result.area);
        setDetectStatus('idle');
      } else {
        setDetectStatus('unsupported');
      }
    } catch {
      setDetectStatus('error');
    }
  };

  const currentAreaValue = selectedArea !== undefined ? selectedArea : '';

  return (
    <div className={`flex flex-wrap items-center justify-between gap-2.5 bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200/90 shadow-2xs ${className}`}>
      <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
          <i className="fa-solid fa-location-dot text-brand-blue text-sm" />
          <span>Location:</span>
        </div>

        {/* City Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs font-bold text-brand-charcoal">
          <i className="fa-solid fa-city text-brand-blue text-xs" />
          <select
            value={selectedCity || 'bengaluru'}
            onChange={(e) => {
              selectCity(e.target.value);
              if (onAreaChange) onAreaChange('');
            }}
            className="bg-transparent text-xs font-bold text-brand-charcoal outline-none cursor-pointer"
          >
            {Object.entries(cities).map(([id, c]) => (
              <option key={id} value={id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Locality / Area Dropdown */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200/80 text-xs font-bold text-brand-charcoal min-w-[160px] flex-1 sm:flex-none">
          <i className="fa-solid fa-map-pin text-brand-blue text-xs" />
          <select
            value={currentAreaValue}
            onChange={(e) => {
              const val = e.target.value;
              selectArea({ city: selectedCity, area: val });
              if (onAreaChange) onAreaChange(val);
            }}
            className="bg-transparent text-xs font-bold text-brand-charcoal outline-none cursor-pointer w-full"
          >
            <option value="">All Localities in {getCityLabel(selectedCity)}</option>
            {(cities[selectedCity]?.areas || []).map((areaName) => (
              <option key={areaName} value={areaName}>{areaName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Detect Location Button */}
      <button
        type="button"
        onClick={handleDetect}
        disabled={detectStatus === 'detecting'}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue/5 hover:bg-brand-blue/10 text-brand-blue text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shrink-0"
      >
        {detectStatus === 'detecting' ? (
          <i className="fa-solid fa-spinner animate-spin text-xs" />
        ) : (
          <i className="fa-solid fa-crosshairs text-xs" />
        )}
        <span>{detectStatus === 'detecting' ? 'Detecting...' : 'Detect Location'}</span>
      </button>
    </div>
  );
}
