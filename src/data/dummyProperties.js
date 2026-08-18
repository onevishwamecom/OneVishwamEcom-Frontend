import nexonTravenza1 from '../assets/NexonTravenza/1.png';
import nexonTravenza2 from '../assets/NexonTravenza/2.png';
import nexonTravenza3 from '../assets/NexonTravenza/3.png';
import nexonTravenza4 from '../assets/NexonTravenza/4.png';
import nexonTravenza5 from '../assets/NexonTravenza/5.png';
import nexonTravenza6 from '../assets/NexonTravenza/6.png';
import nexonTravenza7 from '../assets/NexonTravenza/7.png';
import nexonTravenza8 from '../assets/NexonTravenza/8.png';
import axisNiran1 from '../assets/Axis Niran/1.png';
import axisNiran2 from '../assets/Axis Niran/2.png';
import axisNiran3 from '../assets/Axis Niran/3.png';
import axisNiran4 from '../assets/Axis Niran/4.png';
import axisEktava1 from '../assets/Axis Ektava/1.png';
import axisEktava2 from '../assets/Axis Ektava/2.png';
import axisEktava3 from '../assets/Axis Ektava/3.png';
import axisEktava4 from '../assets/Axis Ektava/4.png';
import axisEktava5 from '../assets/Axis Ektava/5.png';
import axisEktava6 from '../assets/Axis Ektava/6.png';
import axisEktava7 from '../assets/Axis Ektava/7.png';
import axisEktava8 from '../assets/Axis Ektava/8.png';
import zenIndraprastha1 from '../assets/Zen Indraprastha/1.jpg';
import zenIndraprastha2 from '../assets/Zen Indraprastha/2.jpg';
import zenIndraprastha3 from '../assets/Zen Indraprastha/3.jpg';
import zenIndraprastha4 from '../assets/Zen Indraprastha/4.jpg';
import zenIndraprastha5 from '../assets/Zen Indraprastha/5.jpg';
import zenIndraprastha6 from '../assets/Zen Indraprastha/6.jpg';
import zenIndraprastha7 from '../assets/Zen Indraprastha/7.jpg';
import royalKadhambas1 from '../assets/Royal Kadhambas/1.png';
import royalKadhambas2 from '../assets/Royal Kadhambas/2.png';
import royalKadhambas3 from '../assets/Royal Kadhambas/3.png';
import royalKadhambas4 from '../assets/Royal Kadhambas/4.png';
import royalKadhambas5 from '../assets/Royal Kadhambas/5.png';
import royalKadhambas6 from '../assets/Royal Kadhambas/6.png';
import goldenCity1 from '../assets/Golden City/1.png';
import goldenCity2 from '../assets/Golden City/2.png';
import goldenCity3 from '../assets/Golden City/3.png';
import nambiar1 from '../assets/Nambiar District 25/1.png';
import nambiar2 from '../assets/Nambiar District 25/2.png';
import nambiar3 from '../assets/Nambiar District 25/3.png';
import nambiar4 from '../assets/Nambiar District 25/4.png';
import dsMaxSamyak1 from '../assets/DS-MAX Samyak/1.png';
import dsMaxSamyak2 from '../assets/DS-MAX Samyak/2.png';
import dsMaxSamyak3 from '../assets/DS-MAX Samyak/3.png';
import dsMaxSamyak4 from '../assets/DS-MAX Samyak/4.png';
import urbanForest1 from '../assets/The Urban Forest/1.png';
import urbanForest2 from '../assets/The Urban Forest/2.png';
import urbanForest3 from '../assets/The Urban Forest/3.png';
import urbanForest4 from '../assets/The Urban Forest/4.png';

export const NEXON_TRAVENZA_IMAGES = [
  nexonTravenza1,
  nexonTravenza2,
  nexonTravenza3,
  nexonTravenza4,
  nexonTravenza5,
  nexonTravenza6,
  nexonTravenza7,
  nexonTravenza8,
];

export const AXIS_NIRAN_IMAGES = [
  axisNiran1,
  axisNiran2,
  axisNiran3,
  axisNiran4,
];

export const AXIS_EKTAVA_IMAGES = [
  axisEktava1,
  axisEktava2,
  axisEktava3,
  axisEktava4,
  axisEktava5,
  axisEktava6,
  axisEktava7,
  axisEktava8,
];

export const ZEN_INDRAPRASTHA_IMAGES = [
  zenIndraprastha1,
  zenIndraprastha2,
  zenIndraprastha3,
  zenIndraprastha4,
  zenIndraprastha5,
  zenIndraprastha6,
  zenIndraprastha7,
];

export const ROYAL_KADHAMBAS_IMAGES = [
  royalKadhambas1,
  royalKadhambas2,
  royalKadhambas3,
  royalKadhambas4,
  royalKadhambas5,
  royalKadhambas6,
];

export const GOLDEN_CITY_IMAGES = [
  goldenCity1,
  goldenCity2,
  goldenCity3,
];

export const NAMBIAR_IMAGES = [
  nambiar1,
  nambiar2,
  nambiar3,
  nambiar4,
];

export const DS_MAX_SAMYAK_IMAGES = [
  dsMaxSamyak1,
  dsMaxSamyak2,
  dsMaxSamyak3,
  dsMaxSamyak4,
];

export const URBAN_FOREST_IMAGES = [
  urbanForest1,
  urbanForest2,
  urbanForest3,
  urbanForest4,
];

const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="none"><rect width="800" height="600" fill="#f3f4f6"/><path fill="#9ca3af" d="M300 260h200v-30l-100-100-100 100v30zm-50 130h300v-150l-100-100-200 200v50z"/></svg>`
);

export const dummyProperties = [
  {
    id: 1,
    title: 'Vasundhanra Farms',
    subtitle: 'Farm Plots',
    propertyType: 'Farm Plot',
    price: '₹ 1800/Sq.ft',
    location: 'Ramnagar, Bangalore',
    city: 'bengaluru',
    area: '40 Acres',
    bhk: '5 & 10 Guntas',
    possession: 'Immediate',
    approval: 'Farm Approval',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 2,
    title: 'Nexon Travenza',
    subtitle: 'Villa',
    propertyType: 'Villa',
    price: '₹ 9010/Sq.ft',
    location: 'Hoskote, Bangalore',
    city: 'bengaluru',
    area: '102 Units',
    bhk: '3 & 4 BHK',
    possession: 'Handover by 2028 Dec',
    approval: 'RERA',
    videoUrl: 'https://youtu.be/QWm0C_BkEcE?si=M_6GfcHrjVSJLotY',
    status: 'available',
    images: NEXON_TRAVENZA_IMAGES,
    loanApproved: false,
  },
  {
    id: 3,
    title: 'Ramky Fortuna',
    subtitle: 'Apartment',
    propertyType: 'Apartment',
    price: '₹ 12000/Sq.ft',
    location: 'Whitefield, Bangalore',
    city: 'bengaluru',
    area: '150 Units',
    bhk: '1, 2, 3, 4 BHK',
    possession: 'Handover by 2029-2030',
    approval: 'RERA',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 4,
    title: 'TRU Aquapolis',
    subtitle: 'Apartment',
    propertyType: 'Apartment',
    price: '₹ 11000/Sq.ft',
    location: 'Varthur, Bangalore',
    city: 'bengaluru',
    area: '400 Units',
    bhk: '2, 3, 4 BHK',
    possession: 'Handover by 2029',
    approval: 'RERA',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 5,
    title: 'Axis Ektava',
    subtitle: 'Studio Apartment',
    propertyType: 'Studio Apartment',
    price: '₹ 14500/Sq.ft',
    location: 'Kadugodi, Bangalore',
    city: 'bengaluru',
    area: '200 Units',
    bhk: '300-500 Sq.ft',
    possession: 'Handover by 2029 May',
    approval: 'RERA',
    videoUrl: 'WhatsApp Video 2026-08-11 at 12.48.29.mp4',
    status: 'available',
    images: AXIS_EKTAVA_IMAGES,
    loanApproved: false,
  },
  {
    id: 6,
    title: 'North East Properties',
    subtitle: 'Plots',
    propertyType: 'Plot',
    price: '₹ 1750/Sq.ft',
    location: 'Devanahalli, Bangalore',
    city: 'bengaluru',
    area: '70 Sites',
    bhk: '30x40, odd',
    possession: 'Immediate position',
    approval: 'DTCP',
    videoUrl: 'WhatsApp Video 2026-08-12 at 16.26.49.mp4',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 7,
    title: 'Swastik Ventures',
    subtitle: 'Plots',
    propertyType: 'Plot',
    price: '₹ 2200/Sq.ft',
    location: 'Near Siddlaghata, Bangalore',
    city: 'bengaluru',
    area: '75 Sites',
    bhk: '1200-1800 Sq.ft',
    possession: 'Immediate position',
    approval: 'DTCP',
    videoUrl: 'WhatsApp Video 2026-08-12 at 16.03.51.mp4',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 8,
    title: 'Nexon',
    subtitle: 'Plot (EOI)',
    propertyType: 'Plot',
    price: '₹ 4500/Sq.ft',
    location: 'Hoskote, Bangalore',
    city: 'bengaluru',
    area: '4+4 Acres',
    bhk: 'EOI',
    possession: 'EOI looking for investors',
    approval: 'EOI',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 9,
    title: 'Axis Niran',
    subtitle: 'Apartment',
    propertyType: 'Apartment',
    price: '₹ 10500/Sq.ft',
    location: 'Sarjapur, Bangalore',
    city: 'bengaluru',
    area: '49 Units',
    bhk: '2-3 BHK',
    possession: 'Handover by 2028',
    approval: 'RERA',
    videoUrl: 'WhatsApp Video 2026-08-13 at 10.38.32.mp4',
    status: 'available',
    images: AXIS_NIRAN_IMAGES,
    loanApproved: false,
  },
  {
    id: 10,
    title: 'Purva Northern Lights',
    subtitle: 'New 1 BHK Launch',
    propertyType: 'Apartment',
    price: '₹ 10250/Sq.ft',
    location: 'Sarjapur, Bangalore',
    city: 'bengaluru',
    area: '392 Units',
    bhk: '1 BHK',
    sizeRange: '622 – 678 Sq. Ft.',
    unitOptions: ['1 BHK with Car Park', '1 BHK without Car Park'],
    eoiOptions: ['₹ 1 Lakh – Standard EOI', '₹ 5 Lakhs – Preferential EOI'],
    priceRange: '₹ 75 Lakhs – ₹ 90 Lakhs',
    priceNote: 'Price is excluding maintenance, GST, legal charges and applicable statutory charges.',
    possession: 'Handover by 2029 May',
    approval: 'EOI',
    status: 'available',
    images: [PLACEHOLDER_IMG],
    loanApproved: false,
  },
  {
    id: 11,
    title: 'Zen Indraprastha',
    subtitle: 'Apartment',
    propertyType: 'Apartment',
    price: '₹ 15000/Sq.ft',
    location: 'Mahalakshmi (Yeshwanthpur), Bangalore',
    city: 'bengaluru',
    area: '40 Units',
    bhk: '2-3 BHK',
    possession: 'Handover by 2027',
    approval: 'RERA',
    videoUrl: 'WhatsApp Video 2026-08-16 at 14.41.25.mp4',
    status: 'available',
    images: ZEN_INDRAPRASTHA_IMAGES,
    loanApproved: false,
  },
  {
    id: 12,
    title: 'The Urban Forest',
    subtitle: 'Keya Homes',
    propertyType: 'Apartment',
    price: 'On Request',
    location: 'Kasavanahalli Main Road, Bangalore',
    city: 'bengaluru',
    area: '8.15 Acres · 727 Units',
    bhk: '2, 3 & 4 BHK',
    sizeRange: '878 – 1711 Sq.ft Carpet · 1351 – 2670 Sq.ft SBU',
    possession: 'Under Construction',
    approval: 'RERA – PRM/KA/RERA/1251/310/PR/200525/007759',
    status: 'available',
    images: URBAN_FOREST_IMAGES,
    loanApproved: false,
  },
  {
    id: 13,
    title: 'Golden City',
    subtitle: 'Unique Prime City',
    propertyType: 'Plot',
    price: 'On Request',
    location: 'Chikkanahalli, Mysore Road, Bengaluru',
    city: 'bengaluru',
    area: 'Residential Plotted Layout',
    bhk: 'Plots',
    possession: 'Ready for registration & construction',
    approval: 'BMRDA Approved',
    status: 'available',
    images: GOLDEN_CITY_IMAGES,
    loanApproved: false,
  },
  {
    id: 14,
    title: 'Nambiar District 25',
    subtitle: 'Phase 3 – Sports District',
    propertyType: 'Apartment',
    price: 'On Request',
    location: 'Dommasandra, Bengaluru',
    city: 'bengaluru',
    area: '20+ Acre Sports District',
    bhk: '2, 3, 4 & 4.5 BHK',
    sizeRange: '1252 – 2980 Sq.ft Carpet',
    possession: 'Under Construction',
    approval: 'RERA – PRM/KA/RERA/1251/308/PR/260526/008686',
    status: 'available',
    images: NAMBIAR_IMAGES,
    loanApproved: false,
  },
  {
    id: 15,
    title: 'Royal Kadhambas',
    subtitle: 'JS Infra Ventures',
    propertyType: 'Plot',
    price: 'On Request',
    location: 'Sathanur Road, Kanakapura, Bangalore',
    city: 'bengaluru',
    area: '35 Acres',
    bhk: 'Luxury Villa Plots',
    possession: 'Ready for registration & construction',
    approval: 'BMRDA Approved',
    status: 'available',
    images: ROYAL_KADHAMBAS_IMAGES,
    loanApproved: false,
  },
  {
    id: 16,
    title: 'DS-MAX Samyak',
    subtitle: 'The Complete Living',
    propertyType: 'Apartment',
    price: 'On Request',
    location: 'Kengeri Hobli, Bangalore',
    city: 'bengaluru',
    area: '600 Units · B+G+14 Floors',
    bhk: '2, 3 & 4 BHK',
    sizeRange: '738 – 1377 Sq.ft Carpet',
    possession: 'Under Construction',
    approval: 'RERA – PRM/KA/RERA/1251/310/PR/150223/005721',
    status: 'available',
    images: DS_MAX_SAMYAK_IMAGES,
    loanApproved: false,
  },
];

export const PROPERTY_TYPES = ['Flat', 'House', 'Villa', 'Plot', 'Commercial'];
export const PROPERTY_CONDITIONS = ['Ready to Move', 'Under Construction', 'Resale'];
export const FURNISH_TYPES = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished', 'NA'];
export const POSTED_BY_TYPES = ['Owner', 'Agent', 'Builder'];
export const FACING_OPTIONS = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];