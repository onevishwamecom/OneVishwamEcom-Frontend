export interface KeyAttribute {
  label: string;
  value: string;
  icon?: string;
}

export interface SpecificationItem {
  key: string;
  value: string;
}

export interface SpecificationGroup {
  groupName: string;
  items: SpecificationItem[];
}

export interface SellerInfo {
  name: string;
  type: string;
  phone: string;
  whatsapp?: string;
  verified: boolean;
  avatar?: string;
  address?: string;
}

export interface EntityBadge {
  label: string;
  className?: string;
}

export interface EntityItem {
  id: string | number;
  title: string;
  price: string;
  priceSubtext?: string;
  location: string;
  pincode?: string;
  images: string[];
  badges: Array<string | EntityBadge>;
  keyAttributes: KeyAttribute[];
  description: string;
  specs: SpecificationGroup[];
  seller: SellerInfo;
  raw?: any;
}
