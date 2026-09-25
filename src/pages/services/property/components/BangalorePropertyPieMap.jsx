import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPropertyCoverImage, formatPropertyDisplayPrice, getBangaloreZone } from '../propertyHelpers';
import bangaloreBbmpMap from '../../../../assets/maps/bangalore_bbmp_map.jpg';

// 8 Official BBMP Administrative Zones with exact hotspot centers and bounding coordinates on 1024x982 map
export const BBMP_ZONES = {
  byatarayanapura: {
    id: 'byatarayanapura',
    name: 'Byatarayanapura',
    category: 'North',
    color: '#0284c7', // Sky Blue
    center: { x: 430, y: 190 },
    // Invisible interactive hotspot polygon matching the region boundary
    path: 'M 310 50 L 480 30 L 590 120 L 580 230 L 550 280 L 480 320 L 320 310 L 290 230 L 260 160 Z',
  },
  dasarahalli: {
    id: 'dasarahalli',
    name: 'Dasarahalli',
    category: 'West',
    color: '#8b5cf6', // Violet
    center: { x: 180, y: 250 },
    path: 'M 110 200 L 260 160 L 290 230 L 250 340 L 160 360 L 100 320 Z',
  },
  west: {
    id: 'west',
    name: 'West',
    category: 'West',
    color: '#6366f1', // Indigo
    center: { x: 290, y: 440 },
    path: 'M 250 340 L 290 230 L 320 310 L 410 370 L 380 480 L 350 540 L 250 530 L 200 450 Z',
  },
  east: {
    id: 'east',
    name: 'East',
    category: 'East',
    color: '#d97706', // Amber
    center: { x: 480, y: 440 },
    path: 'M 320 310 L 480 320 L 550 280 L 590 340 L 640 430 L 610 530 L 520 570 L 430 570 L 380 480 L 410 370 Z',
  },
  mahadevapura: {
    id: 'mahadevapura',
    name: 'Mahadevapura',
    category: 'East',
    color: '#10b981', // Emerald
    center: { x: 770, y: 530 },
    path: 'M 590 340 L 720 280 L 860 360 L 980 440 L 990 590 L 910 700 L 770 740 L 640 730 L 610 530 L 640 430 Z',
  },
  south: {
    id: 'south',
    name: 'South',
    category: 'South',
    color: '#f97316', // Orange
    center: { x: 370, y: 640 },
    path: 'M 250 530 L 350 540 L 380 480 L 430 570 L 520 570 L 510 680 L 450 760 L 330 770 L 250 740 L 240 630 Z',
  },
  bommanahalli: {
    id: 'bommanahalli',
    name: 'Bommanahalli',
    category: 'South',
    color: '#ec4899', // Pink
    center: { x: 490, y: 810 },
    path: 'M 520 570 L 610 530 L 640 730 L 680 830 L 590 940 L 420 960 L 330 890 L 330 770 L 450 760 L 510 680 Z',
  },
  rr_nagara: {
    id: 'rr_nagara',
    name: 'RR Nagara',
    category: 'West',
    color: '#06b6d4', // Cyan
    center: { x: 130, y: 620 },
    path: 'M 200 450 L 250 530 L 240 630 L 250 740 L 330 770 L 330 890 L 240 920 L 90 850 L 30 740 L 40 540 L 100 450 Z',
  },
};

export const ZONE_NAME_TO_ID = {
  Byatarayanapura: 'byatarayanapura',
  Dasarahalli: 'dasarahalli',
  West: 'west',
  East: 'east',
  Mahadevapura: 'mahadevapura',
  South: 'south',
  Bommanahalli: 'bommanahalli',
  'RR Nagara': 'rr_nagara',
};

// Precise Locality Coordinates placed on 1024 x 982 Map Coordinates
const LOCALITY_COORDINATES = [
  // ── Byatarayanapura (North Zone) ──
  { keywords: ['devanahalli', 'airport', 'kempegowda airport', 'chikkajala', 'siddlaghata', 'kaiwara', 'chikkaballapura'], x: 440, y: 100, zoneId: 'byatarayanapura' },
  { keywords: ['yelahanka', 'kogilu', 'attur', 'bagalur'], x: 390, y: 150, zoneId: 'byatarayanapura' },
  { keywords: ['byatarayanapura', 'sahakar nagar', 'amruthahalli', 'jakkur', 'hebbal'], x: 430, y: 220, zoneId: 'byatarayanapura' },
  { keywords: ['thanisandra', 'manyata', 'nagawara', 'hegde nagar', 'hennur', 'kothanur', 'horamavu'], x: 500, y: 240, zoneId: 'byatarayanapura' },

  // ── Dasarahalli (North-West Zone) ──
  { keywords: ['dasarahalli', 'peenya', 'jalahalli', 'tumkur road', 'tumkur', 'bagalagunte', 'chikkabanavara', 'nelamangala', 'dhabaspet', 'dobbaspet'], x: 170, y: 270, zoneId: 'dasarahalli' },
  { keywords: ['yeshwanthpur', 'mathikere', 'goraguntepalya'], x: 210, y: 300, zoneId: 'dasarahalli' },

  // ── West Zone ──
  { keywords: ['malleshwaram', 'sadashivanagar', 'sankey'], x: 290, y: 350, zoneId: 'west' },
  { keywords: ['mahalakshmi', 'nandini layout', 'kurubarahalli'], x: 255, y: 390, zoneId: 'west' },
  { keywords: ['rajaji nagar', 'rajajinagar', 'west of chord', 'manjunath nagar'], x: 285, y: 430, zoneId: 'west' },
  { keywords: ['govindraj', 'magadi road', 'magadi', 'vijay nagar', 'vijayanagar', 'rpc layout', 'attiguppe', 'chandra layout', 'hampi nagar'], x: 260, y: 480, zoneId: 'west' },
  { keywords: ['chamrajpet', 'shankarpuram', 'basavanagudi', 'gandhi bazaar', 'hanumanth nagar'], x: 320, y: 515, zoneId: 'west' },

  // ── East Zone (Central & Inner-East) ──
  { keywords: ['shivajinagar', 'commercial street', 'cantonment', 'cubbon', 'vasanth nagar', 'cunningham'], x: 420, y: 370, zoneId: 'east' },
  { keywords: ['gandhi nagar', 'majestic', 'city railway', 'seshadripuram', 'chickpet'], x: 370, y: 410, zoneId: 'east' },
  { keywords: ['mg road', 'brigade', 'richmond', 'residency', 'ashok nagar', 'church street'], x: 460, y: 430, zoneId: 'east' },
  { keywords: ['indiranagar', 'ulsoor', 'halasuru', 'domlur', 'cv raman', 'c.v. raman'], x: 520, y: 455, zoneId: 'east' },
  { keywords: ['koramangala', 'ejipura', 'tavarekere'], x: 490, y: 520, zoneId: 'east' },

  // ── Mahadevapura (East IT Corridor) ──
  { keywords: ['k.r. pura', 'kr puram', 'ramamurthy nagar', 'ramamurthy', 'tc palya', 'battarahalli', 'seegehalli'], x: 620, y: 370, zoneId: 'mahadevapura' },
  { keywords: ['old madras', 'budigere', 'hoskote', 'hosakote', 'avalapalli', 'kollathur', 'kolar road'], x: 750, y: 380, zoneId: 'mahadevapura' },
  { keywords: ['hoodi', 'itpl', 'whitefield', 'kadugodi', 'hope farm', 'chikkathirupathi', 'immadihalli'], x: 820, y: 460, zoneId: 'mahadevapura' },
  { keywords: ['brookefield', 'kundalahalli', 'bemasandra', 'aecs', 'mahadevapura', 'doddanekundi'], x: 680, y: 490, zoneId: 'mahadevapura' },
  { keywords: ['marathahalli', 'munnekollal', 'panathur', 'varthur', 'varthur road', 'gunjur', 'balagere'], x: 770, y: 550, zoneId: 'mahadevapura' },
  { keywords: ['sarjapur', 'dommasandra', 'kasavanahalli', 'mullur', 'kodathi', 'carmelaram'], x: 720, y: 640, zoneId: 'mahadevapura' },

  // ── South Zone ──
  { keywords: ['jayanagar', 'tilak nagar', 'byrasandra', 'ashoka pillar'], x: 360, y: 580, zoneId: 'south' },
  { keywords: ['jp nagar', 'sarakki', 'puttenahalli', 'rose garden', 'b.t.m', 'btm', 'btm layout', 'mico layout'], x: 390, y: 640, zoneId: 'south' },
  { keywords: ['banashankari', 'isro layout', 'kumaraswamy layout', 'bikashipura', 'padmanaba', 'padmanabhanagar'], x: 300, y: 620, zoneId: 'south' },
  { keywords: ['kanakapura', 'thalaghattapura', 'konanakunte', 'harohalli', 'sathanur', 'kaggalipura', 'tataguni'], x: 320, y: 700, zoneId: 'south' },

  // ── Bommanahalli (South-East Zone) ──
  { keywords: ['bommanahalli', 'hongasandra', 'roopena agrahara', 'garvebhavipalya', 'madiwala'], x: 450, y: 730, zoneId: 'bommanahalli' },
  { keywords: ['hsr', 'hsr layout', 'sector 1', 'sector 2', 'sector 3', 'sector 4', 'sector 5', 'sector 6', 'sector 7', 'haralur', 'bellandur'], x: 530, y: 680, zoneId: 'bommanahalli' },
  { keywords: ['begur', 'kudlu', 'singasandra', 'hosa road', 'nobel residency'], x: 500, y: 760, zoneId: 'bommanahalli' },
  { keywords: ['electronic city', 'e-city', 'neotown', 'bommasandra', 'chandapura'], x: 570, y: 810, zoneId: 'bommanahalli' },
  { keywords: ['bannerghatta', 'gottigere', 'hulimavu', 'arekere', 'jigani', 'anekal', 'bangalore south', 'vedant'], x: 420, y: 830, zoneId: 'bommanahalli' },

  // ── RR Nagara (South-West Zone) ──
  { keywords: ['rajarajeshwari', 'rr nagar', 'ideal homes', 'kenchenahalli'], x: 140, y: 630, zoneId: 'rr_nagara' },
  { keywords: ['nagarbhavi', 'ullal', 'mallathahalli', 'jnana bharathi'], x: 160, y: 530, zoneId: 'rr_nagara' },
  { keywords: ['kengeri', 'mysore road', 'chikkanahalli', 'kumbalgodu', 'bidadi', 'kamanagata', 'ramnagar', 'kempegowda layout', 'nada prabhu', 'ags layout', 'nandakumar'], x: 110, y: 730, zoneId: 'rr_nagara' },
];

function getAccurateCoordinates(property, index) {
  const zoneName = getBangaloreZone(property);
  const zoneId = ZONE_NAME_TO_ID[zoneName] || 'south';
  const meta = BBMP_ZONES[zoneId] || BBMP_ZONES.south;

  const str = String(
    (property.locality || '') + ' ' +
    (property.location || '') + ' ' +
    (property.address || '') + ' ' +
    (property.title || '')
  ).toLowerCase();

  const matched = LOCALITY_COORDINATES.find((loc) =>
    loc.keywords.some((kw) => str.includes(kw))
  );

  let baseX, baseY;
  if (matched) {
    baseX = matched.x;
    baseY = matched.y;
  } else {
    const hash = Math.abs(String(property.id || property.title || index).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
    const angle = (hash % 360) * (Math.PI / 180);
    const dist = 15 + (hash % 35);
    baseX = meta.center.x + Math.cos(angle) * dist;
    baseY = meta.center.y + Math.sin(angle) * dist;
  }

  // Micro-jitter to prevent marker overlap
  const idNum = Number(property.id) || index || 1;
  const jitterAngle = (idNum * 137.5) * (Math.PI / 180);
  const jitterRadius = (idNum % 4) * 8;

  return {
    x: Math.round(baseX + Math.cos(jitterAngle) * jitterRadius),
    y: Math.round(baseY + Math.sin(jitterAngle) * jitterRadius),
    zoneId: zoneId,
    zoneName: zoneName,
  };
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describePieSlice(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', x, y,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z',
  ].join(' ');
}

export default function BangalorePropertyPieMap({ properties = [], activeZone, onSelectZone }) {
  const navigate = useNavigate();
  const [hoveredZone, setHoveredZone] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  // Group properties into the 8 authentic BBMP zones
  const zoneGroups = useMemo(() => {
    const groups = {};
    Object.keys(BBMP_ZONES).forEach((k) => { groups[k] = []; });

    properties.forEach((p, idx) => {
      const coords = getAccurateCoordinates(p, idx);
      if (groups[coords.zoneId]) {
        groups[coords.zoneId].push(p);
      } else {
        groups.south.push(p);
      }
    });
    return groups;
  }, [properties]);

  // Calculate synchronized pie chart slices (8 BBMP zones)
  const pieSlices = useMemo(() => {
    const total = properties.length || 1;
    let currentAngle = 0;
    const zoneKeys = Object.keys(BBMP_ZONES);

    const rawRatios = zoneKeys.map((key) => {
      const count = (zoneGroups[key] || []).length;
      return { key, count, ratio: count / total };
    });

    return rawRatios.map(({ key, count, ratio }) => {
      const meta = BBMP_ZONES[key];
      const angleSpan = Math.max(ratio * 360, 18);
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSpan;
      currentAngle = endAngle;

      const percent = Math.round((count / total) * 100);
      const d = describePieSlice(150, 150, 138, startAngle, endAngle);

      return {
        key,
        name: meta.name,
        count,
        percent,
        color: meta.color,
        d,
      };
    });
  }, [properties, zoneGroups]);

  // Generate accurately plotted property markers
  const propertyPins = useMemo(() => {
    return properties.map((item, index) => {
      const coords = getAccurateCoordinates(item, index);
      return {
        x: coords.x,
        y: coords.y,
        item,
        zoneId: coords.zoneId,
      };
    });
  }, [properties]);

  return (
    <div className="rounded-3xl border border-gray-200/90 bg-white p-5 sm:p-7 shadow-sm mb-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-brand-blue/10 text-brand-blue text-sm font-bold shadow-2xs">
              <i className="fa-solid fa-map-location-dot" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-brand-charcoal">
              Bangalore Property Map & Regional Distribution
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Explore properties plotted across <strong>Byatarayanapura, Dasarahalli, West, East, Mahadevapura, South, Bommanahalli, and RR Nagara</strong>.
          </p>
        </div>

        {activeZone && activeZone !== 'All' && (
          <button
            onClick={() => onSelectZone?.('All')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 hover:bg-brand-blue hover:text-white px-3.5 py-1.5 text-xs font-bold text-gray-700 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
          >
            <i className="fa-solid fa-rotate-left text-[10px]" /> Show All Bangalore ({properties.length})
          </button>
        )}
      </div>

      {/* ── Geographic Map (Left) + Pie Chart (Right) Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12 items-center">
        
        {/* ── Geographic BBMP Map Display (Left 7 Cols) ── */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[560px] aspect-[1024/982] bg-white rounded-3xl p-2 border border-slate-200 shadow-sm overflow-hidden select-none">
            
            {/* Map Background Graphic directly rendering bangalore_bbmp_map.jpg */}
            <img
              src={bangaloreBbmpMap}
              alt="Bangalore BBMP Map"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            />

            {/* Interactive SVG Overlay for Invisible Hitboxes & Pin Plotting (viewBox: 1024 x 982) */}
            <svg viewBox="0 0 1024 982" className="relative z-10 w-full h-full drop-shadow-sm">
              <defs>
                <filter id="pinGlow" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* ── Invisible Interactive Zone Hitboxes (NO hover effect on map; triggers pie chart highlight) ── */}
              {Object.keys(BBMP_ZONES).map((key) => {
                const zone = BBMP_ZONES[key];
                const isSelected = activeZone === key || activeZone === zone.name;

                return (
                  <path
                    key={zone.id}
                    d={zone.path}
                    fill="transparent"
                    stroke="transparent"
                    strokeWidth={0}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredZone(key)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={() => onSelectZone?.(isSelected ? 'All' : zone.name)}
                  />
                );
              })}

              {/* ── Interactive Property Pins Plotted Accurately by Address ── */}
              {propertyPins.map((pin, i) => {
                const isPinHovered = hoveredProperty?.id === pin.item.id;
                const meta = BBMP_ZONES[pin.zoneId] || BBMP_ZONES.south;

                return (
                  <g
                    key={`pin-${pin.item.id || i}`}
                    transform={`translate(${pin.x}, ${pin.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredProperty(pin.item);
                      setHoveredZone(pin.zoneId);
                    }}
                    onMouseLeave={() => {
                      setHoveredProperty(null);
                      setHoveredZone(null);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/property/${pin.item.id}`);
                    }}
                  >
                    {isPinHovered && (
                      <circle r="16" fill={meta.color} opacity="0.4" className="animate-ping" />
                    )}
                    <circle r="8.5" fill="#ffffff" stroke={meta.color} strokeWidth="3" filter="url(#pinGlow)" />
                    <circle r="4" fill={meta.color} />
                  </g>
                );
              })}
            </svg>

            {/* Hovered Property Tooltip Card */}
            {hoveredProperty && (
              <div className="absolute top-3 left-3 z-40 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-3 pointer-events-none animate-fade-in">
                <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img
                    src={getPropertyCoverImage(hoveredProperty)}
                    alt={hoveredProperty.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">
                    {hoveredProperty.bhk || hoveredProperty.propertyType || 'Property'}
                  </span>
                  <span className="text-xs font-extrabold text-brand-blue">
                    {formatPropertyDisplayPrice(hoveredProperty).price} {formatPropertyDisplayPrice(hoveredProperty).priceSuffix}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-brand-charcoal truncate mt-1">
                  {hoveredProperty.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate">
                  <i className="fa-solid fa-location-dot text-brand-blue mr-1" />
                  {hoveredProperty.locality || hoveredProperty.location}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Synchronized Pie Chart Panel (Right 5 Cols) ── */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2 sm:p-4">
          
          <div className="w-full flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                BBMP ZONAL PROPERTY SHARE
              </span>
              <p className="text-[11px] text-gray-500">
                Click any zone to filter properties
              </p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              {properties.length} Total Verified
            </span>
          </div>

          {/* Clean Pie Chart */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] my-3 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-md overflow-visible">
              <g transform="rotate(-90 150 150)">
                {pieSlices.map((slice) => {
                  const isSelected = activeZone === slice.key || activeZone === slice.name;
                  const isHovered = hoveredZone === slice.key;

                  return (
                    <path
                      key={slice.key}
                      d={slice.d}
                      fill={slice.color}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-300 hover:opacity-95 origin-center"
                      style={{
                        transform: isHovered || isSelected ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: '150px 150px',
                        filter: isHovered || isSelected ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))' : 'none',
                      }}
                      onMouseEnter={() => setHoveredZone(slice.key)}
                      onMouseLeave={() => setHoveredZone(null)}
                      onClick={() => onSelectZone?.(isSelected ? 'All' : slice.name)}
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* 8 Slices Legend Grid */}
          <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-gray-100 text-xs max-h-[160px] overflow-y-auto">
            {pieSlices.map((slice) => {
              const isSelected = activeZone === slice.key || activeZone === slice.name;
              const isHovered = hoveredZone === slice.key;

              return (
                <div
                  key={slice.key}
                  onClick={() => onSelectZone?.(isSelected ? 'All' : slice.name)}
                  onMouseEnter={() => setHoveredZone(slice.key)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-brand-blue/10 border-brand-blue/40 ring-1 ring-brand-blue/30 font-bold text-brand-charcoal'
                      : isHovered
                      ? 'bg-gray-50 border-gray-300 shadow-2xs text-brand-charcoal'
                      : 'bg-white border-gray-150 hover:bg-gray-50/80 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-[11.5px] font-bold text-brand-charcoal truncate">
                      {slice.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold text-gray-500 ml-1 shrink-0">
                    {slice.count}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
