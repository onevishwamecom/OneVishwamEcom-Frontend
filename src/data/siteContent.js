export const navLinks = [
  { label: 'Home', href: '/home', id: 'home' },
  { label: 'Housing', href: '/our-services/real-estate-property', id: 'housing' },
  { label: 'Automobiles', href: '/our-services/automobile', id: 'automobiles' },
  { label: 'Finance', href: '/our-services/finance-lending', id: 'finance' },
  { label: 'Groceries', href: '/our-services/consumer-marketplace', id: 'groceries' },
  { label: 'Garments', href: '/our-services/garments-fashion-lifestyle', id: 'garments' },
  {
    label: 'More',
    href: '#',
    id: 'more',
    submenu: {
      columns: [
        [
          { label: 'Jewellery & Gold', href: '/our-services/jewellery-gold' },
          { label: 'Investment & Business', href: '/our-services/investment-venture-capital' },
          { label: 'Building & Industry Supplies', href: '/our-services/industrial-infrastructure' },
          { label: 'Open Market', href: '/our-services/open-marketplace' },
          { label: 'Jobs & Staffing', href: '/our-services/hr-staffing' },
        ],
      ],
    },
  },
];
