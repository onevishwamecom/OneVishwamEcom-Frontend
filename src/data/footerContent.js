export const footerBrandName = 'OneVishwam';

export const footerSummary =
  'A massive multi-service ecosystem spanning finance, property, marketplace, and enterprise solutions.';

export const footerQuickLinks = [
  { label: 'Home', href: '/home' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contact Us', href: '/contact-us/' },
  { label: 'Careers', href: '/careers/' },
  { label: 'Post Requirement', href: '/post-requirement' },
];

export const footerServiceLinks = [
  { label: 'Properties & Real Estate', href: '/our-services/real-estate-property' },
  { label: 'Home Loans & Finance', href: '/our-services/finance-lending' },
  { label: 'Vehicles & Automobiles', href: '/our-services/automobile' },
  { label: 'Jewellery & Gold', href: '/our-services/jewellery-gold' },
  { label: 'Garments & Lifestyle', href: '/our-services/garments-fashion-lifestyle' },
];

export const footerSocialLinks = [
  { label: 'X (Twitter)', icon: 'fa-brands fa-x-twitter', href: 'https://twitter.com' },
  { label: 'Facebook', icon: 'fa-brands fa-facebook-f', href: 'https://www.facebook.com/profile.php?id=61593017245527' },
  { label: 'Instagram', icon: 'fa-brands fa-instagram', href: 'https://www.instagram.com/onevishwam/' },
  { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: 'https://www.linkedin.com' },
];

export const footerLocations = [
  { label: 'Address', value: 'Basavanagudi, Bangalore - 560 004', primary: true },
  { label: 'Phone', value: '+91 85469 96622' },
  { label: 'Email', value: 'ceo@onevishwam.com' },
];

export const contactInfo = {
  brandName: 'OneVishwam',
  phoneDisplay: '+91 85469 96622',
  phoneRaw: '8546996622',
  phoneTel: '+918546996622',
  whatsapp: '918546996622',
  email: 'ceo@onevishwam.com',
};

export const contactInfoGroupB = {
  brandName: 'OneVishwam',
  phoneDisplay: '+91 85469 96622',
  phoneRaw: '8546996622',
  phoneTel: '+918546996622',
  whatsapp: '918546996622',
  email: 'ceo@onevishwam.com',
};

export const contactInfoVedantSuraksha = {
  brandName: 'OneVishwam',
  phoneDisplay: '+91 85469 96622',
  phoneRaw: '8546996622',
  phoneTel: '+918546996622',
  whatsapp: '918546996622',
  email: 'ceo@onevishwam.com',
};

export const GROUP_B_PROPERTY_TITLES = [
  'Nexon Travenza',
  'Zen Indraprastha',
  'Ramky Fortuna',
  'Purva Northern Lights',
  'Purvankar Northern Lights',
  'Vasundhanra Farms',
  'Vasundhara Farms',
  'Nexon',
  'TRU Aquapolis',
  'North East Properties',
  'SWASTHIK VENTURES',
  'Royal Kadhambas',
  'Golden City',
  'Nambiar District 25',
  'DS-MAX Samyak',
  'DS MAX Skysisira',
  'The Urban Forest',
  'Sindhoor Nature Pearl',
  'Vasudha',
  'Unique Enclave',
  'Vinra Alora',
  'Green Valley',
  'Elite Gardenia',
  'Giri Green Park Phase II',
  'Pavani Park West',
  'SLV Lakeview Apartment',
  'Nandi Meadows',
  'Shubha Shanthi Greens',
];

export function getPropertyContactInfo(item) {
  if (!item) return contactInfo;

  const propObj = typeof item === 'object' && item !== null ? item : null;
  const title = typeof item === 'string' ? item : (item && (item.title || item.name)) || '';
  const tLower = title.toLowerCase().trim();

  // 1. Channel Partner Override (Highest Priority)
  const cp = propObj
    ? (Array.isArray(propObj.channelPartner)
        ? propObj.channelPartner[0]
        : (propObj.channelPartner ||
           (Array.isArray(propObj.channelPartners)
             ? propObj.channelPartners[0]
             : propObj.channelPartners)))
    : null;

  if (cp && (cp.phone || cp.email || cp.name)) {
    const rawPhone = String(cp.phone || cp.contact || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;
    const formattedPhone = cleanPhone
      ? '+91 ' + cleanPhone.slice(0, 5) + ' ' + cleanPhone.slice(5)
      : contactInfo.phoneDisplay;

    return {
      brandName: cp.name || (propObj && propObj.vendorName) || contactInfo.brandName,
      phoneDisplay: formattedPhone,
      phoneRaw: cleanPhone || contactInfo.phoneRaw,
      phoneTel: cleanPhone ? '+91' + cleanPhone : contactInfo.phoneTel,
      whatsapp: cleanPhone ? '91' + cleanPhone : contactInfo.whatsapp,
      email: cp.email || contactInfo.email,
    };
  }

  // 2. Property-level contact/email override
  if (propObj && (propObj.contact || propObj.email)) {
    const rawPhone = String(propObj.contact || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;
    const formattedPhone = cleanPhone
      ? '+91 ' + cleanPhone.slice(0, 5) + ' ' + cleanPhone.slice(5)
      : contactInfo.phoneDisplay;

    return {
      brandName: (propObj && propObj.vendorName) || contactInfo.brandName,
      phoneDisplay: cleanPhone ? formattedPhone : contactInfo.phoneDisplay,
      phoneRaw: cleanPhone || contactInfo.phoneRaw,
      phoneTel: cleanPhone ? '+91' + cleanPhone : contactInfo.phoneTel,
      whatsapp: cleanPhone ? '91' + cleanPhone : contactInfo.whatsapp,
      email: (propObj && propObj.email) || contactInfo.email,
    };
  }

  // 3. VEDANT SURAKSHA Rule
  if (tLower.includes('vedant suraksha') || tLower.includes('vedantsuraksha')) {
    return contactInfoVedantSuraksha;
  }

  // 4. Group B Rule
  const isGroupB = GROUP_B_PROPERTY_TITLES.some((gt) => {
    const gLower = gt.toLowerCase();
    return tLower.includes(gLower) || gLower.includes(tLower);
  });
  return isGroupB ? contactInfoGroupB : contactInfo;
}

export const getContactForProperty = getPropertyContactInfo;

export function isGroupBProperty(propertyOrTitle) {
  if (!propertyOrTitle) return false;
  const title = typeof propertyOrTitle === 'string'
    ? propertyOrTitle
    : (propertyOrTitle ? (propertyOrTitle.title || propertyOrTitle.name || '') : '');

  const norm = title.trim().toLowerCase();
  return GROUP_B_PROPERTY_TITLES.some((t) => t.trim().toLowerCase() === norm);
}

export function isVedantSuraksha(propertyOrTitle) {
  if (!propertyOrTitle) return false;
  const title = typeof propertyOrTitle === 'string'
    ? propertyOrTitle
    : (propertyOrTitle ? (propertyOrTitle.title || propertyOrTitle.name || '') : '');

  const norm = title.trim().toLowerCase();
  return norm.includes('vedant suraksha');
}
