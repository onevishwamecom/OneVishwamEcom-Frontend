import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cities } from '../../../data/locations';
import { FINANCE_CATEGORIES } from '../../../data/dummyFinanceServices';
import { FINANCE_PROVIDER_TYPES, FINANCE_SERVICE_MODES, FINANCE_POSTED_BY, FINANCE_AVAILABILITY } from './financeConstants';

function PostFinanceService() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    loanType: '',
    interestRate: '',
    minAmount: '',
    maxAmount: '',
    eligibility: '',
    processingTime: '',
    documentsRequired: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    city: '',
    area: '',
    providerType: '',
    serviceMode: '',
    postedBy: '',
    availability: '',
  });
  const [errors, setErrors] = useState({});

  const cityAreas = formData.city ? (cities[formData.city]?.areas || []) : [];

  const validate = () => {
    const errs = {};
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.contactPhone.trim()) errs.contactPhone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) errs.contactPhone = 'Enter a valid 10-digit number';
    if (!formData.contactEmail.trim()) errs.contactEmail = 'Email is required';
    if (!formData.city) errs.city = 'City is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    navigate('/finance-service/success');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
        : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
    }`;

  return (
    <div className="min-h-screen pb-24 pt-6 sm:pt-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link to="/our-services/finance-lending" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-blue transition-colors mb-6">
          <i className="fa-solid fa-arrow-left text-[10px]" />
          Back to Finance Services
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
            OneVishwam · Finance
          </p>
          <h1 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">Post a Financial Service</h1>
          <p className="text-sm text-gray-500 mt-2">List your loan, insurance, or investment service for thousands of users to discover.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Details */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
              <i className="fa-solid fa-building text-brand-blue/60" />
              Company Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Company Name <span className="text-red-400">*</span></span>
                <input type="text" value={formData.companyName} onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="e.g., HDFC Ltd." className={inputClass('companyName')} />
                {errors.companyName && <span className="text-xs text-red-500">{errors.companyName}</span>}
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Service Category <span className="text-red-400">*</span></span>
                <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)}
                  className={inputClass('category')}>
                  <option value="">Select category</option>
                  {FINANCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Provider Type</span>
                <select value={formData.providerType} onChange={(e) => handleChange('providerType', e.target.value)}
                  className={inputClass('providerType')}>
                  <option value="">Select</option>
                  {FINANCE_PROVIDER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Loan / Service Details */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
              <i className="fa-solid fa-percentage text-brand-blue/60" />
              Service Details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Interest Rate</span>
                <input type="text" value={formData.interestRate} onChange={(e) => handleChange('interestRate', e.target.value)}
                  placeholder="e.g., 8.5% – 10.5%" className={inputClass('interestRate')} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Service Mode</span>
                <select value={formData.serviceMode} onChange={(e) => handleChange('serviceMode', e.target.value)}
                  className={inputClass('serviceMode')}>
                  <option value="">Select</option>
                  {FINANCE_SERVICE_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Minimum Amount (₹)</span>
                <input type="text" value={formData.minAmount} onChange={(e) => handleChange('minAmount', e.target.value)}
                  placeholder="e.g., 500000" className={inputClass('minAmount')} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Maximum Amount (₹)</span>
                <input type="text" value={formData.maxAmount} onChange={(e) => handleChange('maxAmount', e.target.value)}
                  placeholder="e.g., 50000000" className={inputClass('maxAmount')} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Processing Time</span>
                <input type="text" value={formData.processingTime} onChange={(e) => handleChange('processingTime', e.target.value)}
                  placeholder="e.g., 3 – 7 working days" className={inputClass('processingTime')} />
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Posted By</span>
                <select value={formData.postedBy} onChange={(e) => handleChange('postedBy', e.target.value)}
                  className={inputClass('postedBy')}>
                  <option value="">Select</option>
                  {FINANCE_POSTED_BY.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Availability</span>
                <select value={formData.availability} onChange={(e) => handleChange('availability', e.target.value)}
                  className={inputClass('availability')}>
                  <option value="">Select</option>
                  {FINANCE_AVAILABILITY.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Eligibility</span>
                <textarea value={formData.eligibility} onChange={(e) => handleChange('eligibility', e.target.value)}
                  rows={3} placeholder="List eligibility criteria (one per line)" className={inputClass('eligibility')} />
              </label>

              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Documents Required</span>
                <textarea value={formData.documentsRequired} onChange={(e) => handleChange('documentsRequired', e.target.value)}
                  rows={3} placeholder="List required documents (one per line)" className={inputClass('documentsRequired')} />
              </label>

              <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description <span className="text-red-400">*</span></span>
                <textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
                  rows={4} placeholder="Describe your service" className={inputClass('description')} />
                {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
              </label>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-brand-blue/60" />
              Location
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">City <span className="text-red-400">*</span></span>
                <select value={formData.city} onChange={(e) => { handleChange('city', e.target.value); handleChange('area', ''); }}
                  className={inputClass('city')}>
                  <option value="">Select city</option>
                  {Object.keys(cities).map((c) => (
                    <option key={c} value={c}>{cities[c].label}</option>
                  ))}
                </select>
                {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Area</span>
                <select value={formData.area} onChange={(e) => handleChange('area', e.target.value)}
                  className={inputClass('area')} disabled={!formData.city}>
                  <option value="">{formData.city ? 'Select area' : 'Select city first'}</option>
                  {cityAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
              <i className="fa-solid fa-address-card text-brand-blue/60" />
              Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Phone Number <span className="text-red-400">*</span></span>
                <input type="tel" value={formData.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit number" className={inputClass('contactPhone')} />
                {errors.contactPhone && <span className="text-xs text-red-500">{errors.contactPhone}</span>}
              </label>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Email <span className="text-red-400">*</span></span>
                <input type="email" value={formData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="email@example.com" className={inputClass('contactEmail')} />
                {errors.contactEmail && <span className="text-xs text-red-500">{errors.contactEmail}</span>}
              </label>
            </div>
          </div>

          {/* Upload Section */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
              <i className="fa-solid fa-image text-brand-blue/60" />
              Media (Optional)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-brand-blue mb-2" />
                <p className="text-xs text-gray-500"><span className="font-semibold text-brand-blue">Click</span> to upload logo</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>

              <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-cloud-arrow-up text-2xl text-brand-blue mb-2" />
                <p className="text-xs text-gray-500"><span className="font-semibold text-brand-blue">Click</span> to upload banner</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit"
              className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
              <i className="fa-solid fa-paper-plane" /> Publish Service
            </button>
            <p className="text-xs text-gray-400">All fields marked with <span className="text-red-400">*</span> are required.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostFinanceService;
