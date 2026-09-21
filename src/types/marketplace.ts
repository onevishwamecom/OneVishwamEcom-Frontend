export interface KeyAttributeChip {
  label: string;
  value: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface SpecificationSection {
  title: string;
  items: SpecificationItem[];
}

export interface MarketplaceEntity {
  id: string;
  categorySlug: string;
  title: string;
  location: string;
  price: string;
  priceSuffix?: string;
  priceSubtext?: string;
  images: string[];
  badges: {
    label: string;
    variant: 'blue' | 'green' | 'amber' | 'slate';
  }[];
  // Strictly maintain the 3-pill middle row from the Real Estate card:
  // e.g. Real Estate: ['Flat', '3 & 4 BHK', '79,000 Sq Ft']
  // e.g. Automobile:   ['Petrol', 'Automatic', '14,200 KM']
  // e.g. Electronics:  ['65" OLED', 'Google TV', '120Hz']
  cardPills: [string, string, string];
  trustBannerText?: string; // e.g. "100% Pre-Approved Loan Available" or "150-Point Inspection Verified"
  description: string;
  overviewHighlights: KeyAttributeChip[];
  specifications: SpecificationSection[];
  seller: {
    name: string;
    type: string;
    phone: string;
    whatsapp?: string;
    verified: boolean;
  };
}

export interface FilterConfig {
  id: string;
  title: string;
  type: 'range' | 'checkbox';
  min?: number;
  max?: number;
  step?: number;
  unitPrefix?: string;
  unitSuffix?: string;
  options?: { id: string; label: string; count?: number }[];
}

