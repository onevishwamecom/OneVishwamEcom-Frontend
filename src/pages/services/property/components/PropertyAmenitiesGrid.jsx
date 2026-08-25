import React from 'react';

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
  'Jogging Track': 'fa-person-running',
  'Visitor Parking': 'fa-square-parking',
  'Covered Parking': 'fa-square-parking',
  CCTV: 'fa-video',
  Lift: 'elevator',
  'Indoor Games': 'fa-gamepad',
  'Community Hall': 'fa-people-group',
  'Rain Water Harvesting': 'fa-cloud-rain',
  'Fire Safety': 'fa-fire-extinguisher',
  'EV Charging': 'fa-charging-station',
  'Solar Power': 'fa-solar-panel',
  Intercom: 'fa-phone',
  'Central AC': 'fa-snowflake',
  'Open Parking': 'fa-square-parking',
  'Attached Market': 'fa-store',
  'Wi-Fi': 'fa-wifi',
};

export default function PropertyAmenitiesGrid({ amenities = [] }) {
  const items = amenities.length > 0
    ? amenities
    : ['Swimming Pool', '24/7 Security', 'Gym', 'Power Backup', 'Club House', 'Park'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.slice(0, 16).map((amenity) => {
        const icon = AMENITY_ICONS[amenity] || 'fa-star';
        return (
          <div
            key={amenity}
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
              <i className={`fa-solid ${icon === 'elevator' ? 'fa-elevator' : icon} text-brand-blue text-sm`} />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
              {amenity}
            </span>
          </div>
        );
      })}
    </div>
  );
}
