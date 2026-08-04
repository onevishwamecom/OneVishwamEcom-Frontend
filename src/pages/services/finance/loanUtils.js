export const LOAN_TYPE_META = {
  home: {
    label: 'Home Loan',
    icon: 'fa-house-chimney',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600',
    subtitle: '100% pre-approved, flexible EMI options',
    features: [
      '100% Home Loan available',
      'Flexible EMI options',
      'No hidden charges',
      'Quick approval',
      'Minimal documentation',
    ],
    steps: [
      'Fill the online application',
      'Upload documents',
      'Get instant approval',
      'Choose your property',
      'Disbursal within 7 days',
    ],
    stats: { enquiries: 5, enrolled: 6, slots: 25 },
  },
  vehicle: {
    label: 'Vehicle Loan',
    icon: 'fa-car',
    image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1600',
    subtitle: 'Two/Three Wheelers, Cars, Commercial Vehicles',
    features: [
      'New & Used vehicle financing',
      'Zero down payment options',
      'Insurance bundled',
      'Quick disbursal',
      'Part exchange facility',
    ],
    steps: [
      'Select your vehicle',
      'Apply for loan',
      'Instant approval',
      'Documentation',
      'Drive away the same day',
    ],
    stats: { enquiries: 8, enrolled: 12, slots: 40 },
  },
  personal: {
    label: 'Personal Loan',
    icon: 'fa-user',
    image: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=1600',
    subtitle: 'Zero collateral, same-day disbursal',
    features: [
      'Zero collateral',
      'Same-day disbursal',
      'Flexible tenure',
      'Part-prepayment allowed',
      'No end-use restriction',
    ],
    steps: [
      'Check eligibility online',
      'Fill the application',
      'Upload documents',
      'Instant approval',
      'Funds credited in 24 hours',
    ],
    stats: { enquiries: 12, enrolled: 18, slots: 50 },
  },
  business: {
    label: 'Business Loan',
    icon: 'fa-briefcase',
    image: 'https://images.pexels.com/photos/5648102/pexels-photo-5648102.jpeg?auto=compress&cs=tinysrgb&w=1600',
    subtitle: 'MSME, Mudra & working capital finance',
    features: [
      'Government-backed schemes',
      'Collateral-free up to ₹10L',
      'Flexible repayment',
      'Working capital & term loan',
      'Export finance available',
    ],
    steps: [
      'Check eligibility',
      'Apply with business documents',
      'Valuation & verification',
      'Approval',
      'Disbursal within 7 days',
    ],
    stats: { enquiries: 10, enrolled: 9, slots: 30 },
  },
  education: {
    label: 'Education Loan',
    icon: 'fa-graduation-cap',
    image: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=1600',
    subtitle: 'Study in India & abroad with ease',
    features: [
      'Moratorium period available',
      'No collateral up to ₹7.5L',
      'Tax benefits under Sec 80E',
      'Quick online process',
      'Dedicated counselor',
    ],
    steps: [
      'Check eligibility',
      'Apply with admission letter',
      'Upload documents',
      'Co-applicant verification',
      'Disbursal before course start',
    ],
    stats: { enquiries: 7, enrolled: 5, slots: 20 },
  },
};

export const SLUG_TO_TYPE = {
  'home-loan': 'home',
  'vehicle-loan': 'vehicle',
};

export function formatLoanAmount(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '';
  const num = Number(amount);
  if (num >= 10000000) {
    const cr = num / 10000000;
    return '₹' + (Number.isInteger(cr) ? cr : cr.toFixed(1)) + ' Cr+';
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return '₹' + (Number.isInteger(lakh) ? lakh : lakh.toFixed(1)) + ' L+';
  }
  return '₹' + num.toLocaleString('en-IN');
}

export function formatLoanTenure(months) {
  if (!months) return 'Flexible tenure';
  const years = months / 12;
  if (Number.isInteger(years)) return `Up to ${years} years`;
  return `Up to ${Math.round(years)} years`;
}

export function enrichLoan(loan) {
  const meta = LOAN_TYPE_META[loan.type] || {};
  return {
    ...loan,
    id: loan._id || loan.id,
    title: loan.name || meta.label || 'Loan',
    subtitle: meta.subtitle || `${meta.label || 'Loan'} with flexible repayment`,
    icon: meta.icon || 'fa-hand-holding-dollar',
    image: meta.image || '',
    interestRate: loan.interestRate != null ? `${loan.interestRate}%+` : 'N/A',
    maxAmountNumeric: loan.maxAmount,
    minAmountNumeric: loan.minAmount,
    maxAmount: formatLoanAmount(loan.maxAmount),
    minAmount: formatLoanAmount(loan.minAmount),
    tenure: formatLoanTenure(loan.tenureMonths),
    processingFee: loan.processingFee != null ? `${loan.processingFee}%` : '0%',
    features: meta.features || [],
    steps: meta.steps || [],
    stats: meta.stats || { enquiries: 0, enrolled: 0, slots: 0 },
    eligibility: loan.eligibility && loan.eligibility.length ? loan.eligibility : [],
  };
}

export function resolveLoan(loans, slug) {
  const byId = loans.find((l) => l._id === slug || l.id === slug);
  if (byId) {
    return { selected: byId, related: loans.filter((l) => l._id !== byId._id) };
  }

  const type = SLUG_TO_TYPE[slug] || slug;
  const byType = loans.filter((l) => l.type === type);
  if (byType.length) {
    const typeIds = new Set(byType.map((l) => l._id));
    return { selected: byType[0], related: loans.filter((l) => !typeIds.has(l._id)) };
  }

  return { selected: null, related: loans };
}
