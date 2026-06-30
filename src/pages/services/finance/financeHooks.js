import { useMemo } from 'react';
import { financeServices, FINANCE_CATEGORIES } from '../../../data/dummyFinanceServices';
import { getNumericPrice } from '../GalleryComponents';

function parsePriceRange(amountStr) {
  const cleaned = amountStr.replace(/[₹,\s]/g, '');
  if (cleaned.startsWith('0') || cleaned === 'N/A') return 0;
  const m = cleaned.match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

function parseInterestRange(rateStr) {
  if (!rateStr || rateStr === 'N/A' || rateStr === 'Varies') return { min: 0, max: 0 };
  const parts = rateStr.replace(/%/g, '').split('–').map((s) => parseFloat(s.trim()));
  return { min: parts[0] || 0, max: parts[1] || parts[0] || 0 };
}

function parseAmount(amountStr) {
  const cleaned = amountStr.replace(/[₹,\s]/g, '');
  const m = cleaned.match(/([\d.]+)/);
  return m ? parseFloat(m[1]) : 0;
}

export function useTabStats(activeTab) {
  return useMemo(() => {
    const stats = {};
    FINANCE_CATEGORIES.forEach((cat) => {
      stats[cat] = financeServices.filter((s) => s.category === cat).length;
    });
    stats.All = financeServices.length;
    return stats;
  }, []);
}

export function useActiveChips(filters) {
  return useMemo(() => {
    const chips = [];
    filters.loanTypes.forEach((t) => chips.push({ key: `lt-${t}`, label: t }));
    if (filters.amountMin) chips.push({ key: 'amount', label: `Min ₹${(+filters.amountMin / 100000).toFixed(1)}L` });
    if (filters.amountMax) chips.push({ key: 'amount', label: `Max ₹${(+filters.amountMax / 100000).toFixed(1)}L` });
    if (filters.interestMin) chips.push({ key: 'interest', label: `Min ${filters.interestMin}%` });
    if (filters.interestMax) chips.push({ key: 'interest', label: `Max ${filters.interestMax}%` });
    if (filters.tenure) chips.push({ key: 'tenure', label: filters.tenure });
    filters.providerTypes.forEach((t) => chips.push({ key: `pt-${t}`, label: t }));
    filters.serviceModes.forEach((m) => chips.push({ key: `sm-${m}`, label: m }));
    if (filters.city) chips.push({ key: 'city', label: filters.city });
    filters.localities.forEach((l) => chips.push({ key: `loc-${l}`, label: l }));
    if (filters.pincode) chips.push({ key: 'pincode', label: filters.pincode });
    filters.postedBy.forEach((b) => chips.push({ key: `pb-${b}`, label: b }));
    filters.availability.forEach((a) => chips.push({ key: `av-${a}`, label: a }));
    return chips;
  }, [filters]);
}

export function useFilteredServices({
  activeTab, searchTerm, sortBy, filters,
}) {
  return useMemo(() => {
    let results = [...financeServices];

    if (activeTab !== 'All') {
      results = results.filter((s) => s.category === activeTab);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      results = results.filter(
        (s) =>
          s.serviceName.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q)
      );
    }

    if (filters.loanTypes.length > 0) {
      results = results.filter((s) => filters.loanTypes.some((lt) => s.serviceName.toLowerCase().includes(lt.toLowerCase())));
    }

    if (filters.amountMin) {
      const minVal = parseFloat(filters.amountMin);
      results = results.filter((s) => parseAmount(s.minAmount) >= minVal);
    }
    if (filters.amountMax) {
      const maxVal = parseFloat(filters.amountMax);
      results = results.filter((s) => parseAmount(s.maxAmount) <= maxVal);
    }

    if (filters.interestMin) {
      const minInt = parseFloat(filters.interestMin);
      results = results.filter((s) => {
        const r = parseInterestRange(s.interestRate);
        return r.max >= minInt;
      });
    }
    if (filters.interestMax) {
      const maxInt = parseFloat(filters.interestMax);
      results = results.filter((s) => {
        const r = parseInterestRange(s.interestRate);
        return r.min <= maxInt;
      });
    }

    if (filters.tenure) {
      results = results.filter((s) => {
        const t = s.tenure.toLowerCase();
        if (filters.tenure === '1–5 Years') return t.includes('1') || t.includes('2') || t.includes('3') || t.includes('4') || t.includes('5');
        if (filters.tenure === '5–10 Years') return t.includes('5') || t.includes('6') || t.includes('7') || t.includes('8') || t.includes('9') || t.includes('10');
        if (filters.tenure === '10–20 Years') return t.includes('10') || t.includes('15') || t.includes('20');
        if (filters.tenure === '20+ Years') return t.includes('20') || t.includes('25') || t.includes('30');
        return true;
      });
    }

    if (filters.providerTypes.length > 0) {
      results = results.filter((s) => filters.providerTypes.includes(s.providerType));
    }

    if (filters.serviceModes.length > 0) {
      results = results.filter((s) => filters.serviceModes.includes(s.serviceMode));
    }

    if (filters.city) {
      results = results.filter((s) => s.city === filters.city);
    }

    if (filters.localities.length > 0) {
      results = results.filter((s) => filters.localities.includes(s.area));
    }

    if (filters.pincode) {
      results = results.filter((s) => s.pincode === filters.pincode);
    }

    if (filters.postedBy.length > 0) {
      results = results.filter((s) => filters.postedBy.includes(s.postedBy));
    }

    if (filters.availability.length > 0) {
      results = results.filter((s) => filters.availability.includes(s.availability));
    }

    if (sortBy === 'interest-low') {
      results.sort((a, b) => {
        const ra = parseInterestRange(a.interestRate);
        const rb = parseInterestRange(b.interestRate);
        return (ra.min || 0) - (rb.min || 0);
      });
    } else if (sortBy === 'interest-high') {
      results.sort((a, b) => {
        const ra = parseInterestRange(a.interestRate);
        const rb = parseInterestRange(b.interestRate);
        return (rb.min || 0) - (ra.min || 0);
      });
    } else {
      results.sort((a, b) => a.id - b.id);
    }

    return results;
  }, [activeTab, searchTerm, sortBy, filters]);
}
