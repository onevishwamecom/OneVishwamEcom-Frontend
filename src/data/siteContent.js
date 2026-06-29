export const navLinks = [
  { label: 'Home', href: '/home', id: 'home' },
  {
    label: 'About Us',
    href: '/about-us/',
    id: 'about-us',
    // submenu: {
    //   type: 'simple',
    //   items: [
    //     { label: 'Overview', href: '/about-us/#about-overview' },
    //     { label: 'Mission', href: '/about-us/#mission' },
    //     { label: 'FAQ', href: '/about-us/#faq' },
    //     { label: 'Team Members', href: '/about-us/#team-members' },
    //   ],
    // },
  },
  {
    label: 'Our Services',
    href: '/our-services/',
    id: 'our-services',
    submenu: {
      type: 'mega',
      columns: [
        [
          { label: 'Loans & Money Help', href: '/our-services/finance-lending' },
          { label: 'Houses & Land', href: '/our-services/real-estate-property' },
          { label: 'Jewellery & Gold', href: '/our-services/jewellery-gold' },
        ],
        [
          { label: 'Vehicles', href: '/our-services/automobile' },
          { label: 'Investment & Business', href: '/our-services/investment-venture-capital' },
          { label: 'Clothes & Fashion', href: '/our-services/garments-fashion-lifestyle' },
        ],
        [
          { label: 'Building & Industry Supplies', href: '/our-services/industrial-infrastructure' },
          { label: 'Groceries & Daily Needs', href: '/our-services/consumer-marketplace' },
        ],
        [
          { label: 'Open Market', href: '/our-services/open-marketplace' },
          { label: 'Jobs & Staffing', href: '/our-services/hr-staffing' },
        ],
      ],
    },
  },
  // { label: 'Social Services', href: '/#social-services', id: 'social-services' },
  // { label: 'Privacy', href: '/#privacy', id: 'privacy' },
  // { label: 'Careers', href: '/careers/', id: 'careers' },
  { label: 'Contacts', href: '/contact-us/', id: 'contacts' },
];
