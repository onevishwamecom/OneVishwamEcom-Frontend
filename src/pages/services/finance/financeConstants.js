export const FINANCE_TABS = [
  { id: 'All', icon: 'fa-layer-group', label: 'All' },
  { id: 'Home Loans', icon: 'fa-house-chimney', label: 'Home Loans' },
  { id: 'Personal Loans', icon: 'fa-user', label: 'Personal Loans' },
  { id: 'Vehicle Loans', icon: 'fa-car', label: 'Vehicle Loans' },
  { id: 'Business Loans', icon: 'fa-briefcase', label: 'Business Loans' },
  { id: 'Gold Loans', icon: 'fa-coins', label: 'Gold Loans' },
  { id: 'Education Loans', icon: 'fa-graduation-cap', label: 'Education Loans' },
  { id: 'Insurance', icon: 'fa-shield-heart', label: 'Insurance' },
  { id: 'Investment Services', icon: 'fa-chart-line', label: 'Investment' },
  { id: 'Credit Cards', icon: 'fa-credit-card', label: 'Credit Cards' },
  { id: 'Financial Advisors', icon: 'fa-handshake', label: 'Advisors' },
];

export const INITIAL_FILTERS = {
  loanTypes: [],
  amountMin: '',
  amountMax: '',
  interestMin: '',
  interestMax: '',
  tenure: '',
  providerTypes: [],
  serviceModes: [],
  city: '',
  localities: [],
  pincode: '',
  postedBy: [],
  availability: [],
};

export const INITIAL_SECTIONS = {
  loanType: true,
  amount: true,
  interestRate: true,
  tenure: true,
  providerType: false,
  serviceMode: false,
  city: true,
  localities: true,
  pincode: false,
  postedBy: false,
  availability: false,
};

export const LOAN_TYPE_OPTIONS = [
  'Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan',
  'Gold Loan', 'Education Loan',
];

export const FINANCE_TENURE_OPTIONS = ['1–5 Years', '5–10 Years', '10–20 Years', '20+ Years'];
export const FINANCE_PROVIDER_TYPES = ['Bank', 'NBFC', 'Financial Institution', 'Individual Consultant'];
export const FINANCE_SERVICE_MODES = ['Online', 'Offline', 'Both'];
export const FINANCE_POSTED_BY = ['Bank', 'Agent', 'Financial Consultant'];
export const FINANCE_AVAILABILITY = ['Available Now', 'Appointment Required'];

export const FINANCE_STATS = { enquiries: 5, enrolled: 6, slots: 25 };
export const FINANCE_FOCUS_AREAS = ['NRI Loans', 'Loan Against Property', 'Construction Loans'];
export const FINANCE_INCENTIVES = ['0% Processing Fee', 'Quick Approval', 'Flexible EMI'];

export const FINANCE_CATEGORIES = [
  'Home Loans',
  'Personal Loans',
  'Vehicle Loans',
  'Business Loans',
  'Gold Loans',
  'Education Loans',
  'Insurance',
  'Investment Services',
  'Credit Cards',
  'Financial Advisors',
];

export function formatFinanceAmount(value) {
  if (value === null || value === undefined || value === '') return '';
  const str = String(value).trim();
  if (str === 'N/A' || str === 'Varies' || /^No limit$/i.test(str)) return str;
  if (str.startsWith('₹')) return str;
  if (/^[\d,.\s]+$/.test(str)) {
    const num = parseFloat(str.replace(/[, ]/g, ''));
    if (!isNaN(num)) return '₹' + num.toLocaleString('en-IN');
  }
  return str;
}
