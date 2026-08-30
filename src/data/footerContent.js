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
  // { label: 'Automobiles', href: '/our-services/automobile' },
  // { label: 'Finance & Lending', href: '/our-services/finance-lending' },
  // { label: 'Groceries & Daily Needs', href: '/our-services/consumer-marketplace' },
  // { label: 'Garments & Fashion', href: '/our-services/garments-fashion-lifestyle' },
  // { label: 'Jewellery & Gold', href: '/our-services/jewellery-gold' },
  // { label: 'Open Marketplace', href: '/our-services/open-marketplace' },
  // { label: 'HR & Staffing', href: '/our-services/hr-staffing' },
  // { label: 'Investment & Business', href: '/our-services/investment-venture-capital' },
];

export const footerSocialLinks = [
  { label: 'X', icon: 'fa-brands fa-x-twitter' },
  { label: 'Facebook', icon: 'fa-brands fa-facebook-f' },
  { label: 'Instagram', icon: 'fa-brands fa-instagram' },
  { label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in' },
];

export const footerLocations = [
  { label: 'Address', value: 'Basavanagudi Bangalore - 560 004', primary: true },
  { label: 'Phone', value: '8546996611' },
  { label: 'Email', value: 'ceo@onevishwam.com' },
];

export const contactInfo = {
  brandName: 'One Vishwam',
  phoneDisplay: '+91 85469 96655',
  phoneRaw: '8546996655',
  phoneTel: '+918546996655',
  whatsapp: '918546996655',
  email: 'sinchana@spwebtechnologies.in',
};

export const contactInfoGroupB = {
  brandName: 'One Vishwam',
  phoneDisplay: '+91 85469 96655',
  phoneRaw: '8546996655',
  phoneTel: '+918546996655',
  whatsapp: '918546996655',
  email: 'Kj.culturecraft@gmail.com',
};

export const GROUP_B_PROPERTY_TITLES = [
  'Nexon Travenza',
  'Axis Niran',
  'Axis Ektava',
  'Zen Indraprastha',
  'Ramky Fortuna',
  'Purva Northern Lights',
  'Purvankar Northern Lights',
  'Vasundhanra Farms',
  'Vasundhara Farms',
  'Nexon',
  'TRU Aquapolis',
  'North East Properties',
  'Swastik Ventures',
];

export function getPropertyContactInfo(item) {
  if (!item) return contactInfo;
  const title = typeof item === 'string' ? item : (item.title || item.name || '');
  const tLower = title.toLowerCase().trim();
  const isGroupB = GROUP_B_PROPERTY_TITLES.some((gt) => {
    const gLower = gt.toLowerCase();
    return tLower.includes(gLower) || gLower.includes(tLower);
  });
  return isGroupB ? contactInfoGroupB : contactInfo;
}
