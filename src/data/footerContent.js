export const footerBrandName = 'Vishwam';

export const footerSummary =
  'A massive multi-service ecosystem spanning finance, property, marketplace, and enterprise solutions.';

export const footerQuickLinks = [
  { label: 'Home', href: '/home' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Contact Us', href: '/contact-us/' },
  { label: 'Careers', href: '/careers/' },
];

export const footerServiceLinks = [
  { label: 'Properties', href: '/our-services/real-estate-property' },
  { label: 'Automobiles', href: '/our-services/automobile' },
];

export const footerSocialLinks = [
  { label: 'Instagram', icon: 'fa-brands fa-instagram', href: 'https://www.instagram.com/onevishwam/' },
  { label: 'Facebook', icon: 'fa-brands fa-facebook-f', href: 'https://www.facebook.com/profile.php?id=61593017245527' },
  { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', href: 'https://www.linkedin.com/in/onevishwam' },
];

export const footerLocations = [
  { label: 'Address', value: 'Bangalore - 560 004', primary: true },
  { label: 'Phone', value: '85469 96622' },
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
  'Axis Niran',
  'Axis Ektava',
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
  'North East Properties',
  'Green Valley',
  'Elite Gardenia',
  'Giri Green Park Phase II',
  'Pavani Park West',
  'SLV Lakeview Apartment',
  'Nandi Meadows',
  'Shubha Shanthi Greens',
  'Vasundhanra Farms',
];

export function isGroupBProperty(propertyOrTitle) {
  if (!propertyOrTitle) return false;
  const title = typeof propertyOrTitle === 'string'
    ? propertyOrTitle
    : (propertyOrTitle.title || propertyOrTitle.name || '');

  const norm = title.trim().toLowerCase();
  return GROUP_B_PROPERTY_TITLES.some((t) => t.trim().toLowerCase() === norm);
}

export function isVedantSuraksha(propertyOrTitle) {
  if (!propertyOrTitle) return false;
  const title = typeof propertyOrTitle === 'string'
    ? propertyOrTitle
    : (propertyOrTitle.title || propertyOrTitle.name || '');

  const norm = title.trim().toLowerCase();
  return norm.includes('vedant suraksha');
}

export function getContactForProperty(propertyOrTitle) {
  if (isVedantSuraksha(propertyOrTitle)) {
    return contactInfoVedantSuraksha;
  }
  if (isGroupBProperty(propertyOrTitle)) {
    return contactInfoGroupB;
  }
  return contactInfo;
}
