import { useState, useEffect, useRef } from 'react';
import { cities } from '../../data/locations';
import { useAuth } from '../../store/authSlice';
import { navigateTo } from '../../config/navigation';
import { propertyAPI, vehicleAPI, groceryAPI, garmentAPI, jewelleryAPI, financeAPI } from '../../api';

const CATEGORIES = [
  { id: 'real-estate', label: 'Real Estate', icon: 'fa-house-chimney', desc: 'House, Plot, Apartment' },
  { id: 'vehicle', label: 'Vehicle', icon: 'fa-car', desc: 'Car, Bike, Commercial' },
  { id: 'grocery', label: 'Grocery', icon: 'fa-basket-shopping', desc: 'Food, Beverages, Daily Needs' },
  { id: 'garment', label: 'Garment', icon: 'fa-shirt', desc: 'Clothes, Fashion, Accessories' },
  { id: 'finance', label: 'Financial Services', icon: 'fa-building-columns', desc: 'Loan, Investment, Insurance' },
  { id: 'service', label: 'Services', icon: 'fa-wrench', desc: 'Plumbing, Electrical, Repairs' },
];

const CATEGORY_FIELDS = {
  'real-estate': [
    { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Apartment', 'House', 'Villa', 'Plot', 'Commercial'] },
    { name: 'bhk', label: 'BHK', type: 'select', options: ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'] },
    { name: 'bathrooms', label: 'Bathrooms', type: 'select', options: ['1', '2', '3', '4+'] },
    { name: 'area_sqft', label: 'Area (sq. ft.)', type: 'number', placeholder: 'e.g. 1500' },
    { name: 'furnishing', label: 'Furnishing', type: 'select', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
    { name: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. 20th of 20 Floors' },
    { name: 'parking', label: 'Parking', type: 'text', placeholder: 'e.g. 2 Covered + 2 Open' },
    { name: 'extraRoom', label: 'Extra Room', type: 'text', placeholder: 'e.g. Pooja Room' },
    { name: 'priceSuffix', label: 'Price Suffix', type: 'select', options: ['', '/ Per Month', '/ Per Year', 'Negotiable'] },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: 'e.g. 560066' },
    { name: 'projectCount', label: 'Total Projects', type: 'number', placeholder: 'e.g. 120' },
    { name: 'totalUnits', label: 'Total Units', type: 'number', placeholder: 'e.g. 120' },
    { name: 'availableUnits', label: 'Available Units', type: 'number', placeholder: 'e.g. 5' },
  ],
  'vehicle': [
    { name: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g. Toyota, Honda' },
    { name: 'model', label: 'Model', type: 'text', placeholder: 'e.g. Civic, Corolla' },
    { name: 'year', label: 'Year', type: 'select', options: Array.from({ length: 30 }, (_, i) => String(2026 - i)) },
  ],
  'grocery': [
    { name: 'quantity', label: 'Quantity', type: 'number', placeholder: 'e.g. 10' },
    { name: 'unit', label: 'Unit', type: 'select', options: ['Kg', 'Liter', 'Piece', 'Pack', 'Dozen'] },
  ],
  'garment': [
    { name: 'size', label: 'Size', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] },
    { name: 'color', label: 'Color', type: 'text', placeholder: 'e.g. Red, Blue, Green' },
  ],
  'finance': [
    { name: 'serviceType', label: 'Service Type', type: 'select', options: ['Home Loan', 'Vehicle Loan', 'Personal Loan', 'Business Loan', 'Investment'] },
    { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 5' },
  ],
  'service': [
    { name: 'serviceType', label: 'Service Type', type: 'text', placeholder: 'e.g. Plumbing, Electrical' },
    { name: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 3' },
  ],
};

function PlaceholderImage({ index }) {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-amber-100', 'bg-rose-100', 'bg-teal-100'];
  const icons = ['fa-image', 'fa-camera', 'fa-picture', 'fa-photo-film', 'fa-camera-retro', 'fa-images'];
  return (
    <div className={`aspect-[4/3] rounded-xl ${colors[index % colors.length]} flex flex-col items-center justify-center text-gray-400`}>
      <i className={`fa-solid ${icons[index % icons.length]} text-3xl`} />
      <span className="mt-2 text-xs font-medium">Photo {index + 1}</span>
    </div>
  );
}

const INITIAL = {
  title: '', subtitle: '', description: '', price: '', priceSuffix: '', city: 'bengaluru', area: '', zone: '', contact: '',
  propertyType: '', bhk: '', bathrooms: '', area_sqft: '', furnishing: '', floor: '', parking: '', extraRoom: '',
  pincode: '', projectCount: '', totalUnits: '', availableUnits: '',
  brand: '', model: '', year: '',
  quantity: '', unit: '', size: '', color: '', serviceType: '', experience: '',
};

function StepCategory({ selected, onSelect }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Choose a category for your listing</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <button key={cat.id} onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all ${
                isActive
                  ? 'border-brand-blue bg-brand-blue/5 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                isActive ? 'bg-brand-blue text-white' : 'bg-gray-50 text-gray-500'
              }`}>
                <i className={`fa-solid ${cat.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm ${isActive ? 'text-brand-blue' : 'text-brand-charcoal'}`}>{cat.label}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{cat.desc}</p>
              </div>
              {isActive && <i className="fa-solid fa-circle-check text-brand-blue text-lg" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDetails({ form, onChange }) {
  const cityOptions = Object.entries(cities);
  const areaOptions = cities[form.city]?.areas || [];
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-2">Fill in the details about your item</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
        <input type="text" value={form.title} onChange={(e) => onChange('title', e.target.value)}
          placeholder="e.g. 3 BHK Apartment for Sale"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
        />
      </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitle</label>
          <input type="text" value={form.subtitle} onChange={(e) => onChange('subtitle', e.target.value)}
            placeholder="e.g. 4 BHK Flat for Rent in Whitefield"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe your item in detail..."
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">Rs.</span>
            <input type="text" value={form.price} onChange={(e) => onChange('price', e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
          <input type="tel" value={form.contact} onChange={(e) => onChange('contact', e.target.value)}
            placeholder="Your mobile number"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
          <select value={form.city} onChange={(e) => onChange('city', e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all bg-white"
          >
            {cityOptions.map(([id, city]) => (
              <option key={id} value={id}>{city.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Area / Locality</label>
          <select value={form.area} onChange={(e) => { onChange('area', e.target.value); onChange('zone', e.target.value); }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all bg-white"
          >
            <option value="">Select Area</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function StepPhotos({ photos, onAdd, brochure, onBrochureChange }) {
  const fileRef = useRef(null);
  const brochureRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (file && photos.length < 6) {
      onAdd([...photos, { id: Date.now(), name: file.name, size: file.size }]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-6">Upload photos of your item (max 6)</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
          }`}
        >
          <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-600">Drag & drop photos here</p>
          <p className="mt-1 text-xs text-gray-400">or click to browse</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { if (e.target.files[0]) handleFile(e.target.files[0]); e.target.value = ''; }}
          />
        </div>

        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {photos.map((p, i) => (
              <div key={p.id} className="relative">
                <PlaceholderImage index={i} />
                <button onClick={() => onAdd(photos.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            ))}
            {photos.length < 6 && (
              <button onClick={() => fileRef.current?.click()}
                className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <i className="fa-solid fa-plus text-xl" />
                <span className="mt-1 text-xs">Add More</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 mb-4">Upload a brochure PDF (optional)</p>
        <div
          onClick={() => brochureRef.current?.click()}
          className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors hover:border-brand-blue hover:bg-brand-blue/5"
        >
          <i className="fa-solid fa-file-pdf text-3xl text-red-400" />
          <p className="mt-2 text-sm font-medium text-gray-600">
            {brochure ? brochure.name : 'Click to upload brochure PDF'}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">PDF only, max 10MB</p>
          <input ref={brochureRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => { if (e.target.files[0]) onBrochureChange(e.target.files[0]); e.target.value = ''; }}
          />
        </div>
        {brochure && (
          <button onClick={() => onBrochureChange(null)}
            className="mt-2 text-xs text-red-500 hover:text-red-600"
          >
            <i className="fa-solid fa-xmark mr-1" />Remove
          </button>
        )}
      </div>
    </div>
  );
}

function StepSpecifics({ category, form, onChange }) {
  const fields = CATEGORY_FIELDS[category];
  if (!fields || fields.length === 0) {
    return <p className="text-sm text-gray-500">No additional details needed for this category.</p>;
  }
  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Add category-specific details</p>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
            {field.type === 'select' ? (
              <select value={form[field.name]} onChange={(e) => onChange(field.name, e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all bg-white"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input type={field.type} value={form[field.name]} onChange={(e) => onChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 transition-all"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepReview({ category, form, photos }) {
  const catLabel = CATEGORIES.find((c) => c.id === category)?.label || category;
  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">Review your listing before publishing</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-xl text-brand-blue">
              <i className={`fa-solid ${CATEGORIES.find((c) => c.id === category)?.icon || 'fa-list'}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{catLabel}</p>
              <h3 className="text-lg font-bold text-brand-charcoal">{form.title || 'Untitled Listing'}</h3>
              {form.subtitle && <p className="text-sm text-gray-500">{form.subtitle}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Price</p>
              <p className="font-semibold text-brand-charcoal">{form.price ? `Rs. ${form.price}${form.priceSuffix ? ' ' + form.priceSuffix : ''}` : 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Location</p>
              <p className="font-semibold text-brand-charcoal">{form.area || cities[form.city]?.label || 'Not set'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Contact</p>
              <p className="font-semibold text-brand-charcoal">{form.contact || 'Not set'}</p>
            </div>
          </div>

          {form.description && (
            <div>
              <p className="text-gray-400 text-xs">Description</p>
              <p className="text-sm text-gray-600 mt-0.5">{form.description}</p>
            </div>
          )}

          {category && CATEGORY_FIELDS[category]?.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs mb-2">Category Details</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORY_FIELDS[category].map((field) => (
                  <div key={field.name} className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{field.label}</p>
                    <p className="text-sm font-semibold text-brand-charcoal">{form[field.name] || '-'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {photos.length > 0 && (
            <div>
              <p className="text-gray-400 text-xs mb-2">Photos ({photos.length})</p>
              <div className="flex gap-2 overflow-x-auto">
                {photos.map((_, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                    <i className="fa-solid fa-image text-lg" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STEPS = ['Category', 'Details', 'Photos', 'More Info', 'Review'];

function AddListing() {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [form, setForm] = useState(INITIAL);
  const [photos, setPhotos] = useState([]);
  const [brochure, setBrochure] = useState(null);
  const [brochureUrl, setBrochureUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal('login');
    }
  }, [isLoggedIn, openAuthModal]);

  if (!isLoggedIn) {
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="mx-auto max-w-lg px-4 text-center pt-20">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <i className="fa-solid fa-check text-3xl text-emerald-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-brand-charcoal">Listing Submitted!</h2>
          <p className="mt-2 text-sm text-gray-500">Your listing has been submitted for review. You will be notified once it is live.</p>
          {brochureUrl && (
            <a href={brochureUrl} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-navy transition-colors"
            >
              <i className="fa-solid fa-file-pdf" />
              Download Brochure
            </a>
          )}
          <button onClick={() => navigateTo('/')}
            className="mt-8 inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-brand-navy transition-colors"
          >
            <i className="fa-solid fa-house" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 0) return !!category;
    if (step === 1) return form.title && form.price && form.contact;
    if (step === 2) return photos.length > 0;
    if (step === 3) return true;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const imageUrls = photos.map((_, i) => `https://example.com/photo${i + 1}.jpg`);
      const base = { title: form.title, description: form.description, price: form.price, city: form.city, contact: form.contact };

      const apiCalls = {
        'real-estate': () => propertyAPI.create({
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          city: form.city,
          zone: form.zone || form.area,
          location: `${form.area}, ${cities[form.city]?.label || form.city}`,
          price: form.price,
          priceSuffix: form.priceSuffix,
          bhk: form.bhk,
          bathrooms: form.bathrooms,
          area: `${form.area_sqft} Sq.Ft.`,
          furnishing: form.furnishing,
          floor: form.floor,
          parking: form.parking,
          extraRoom: form.extraRoom,
          pincode: form.pincode,
          projectCount: parseInt(form.projectCount, 10) || 0,
          totalUnits: parseInt(form.totalUnits, 10) || 0,
          availableUnits: parseInt(form.availableUnits, 10) || 0,
          propertyType: form.propertyType,
          images: imageUrls,
        }),
        'vehicle': () => vehicleAPI.create({ make: form.brand, model: form.model, year: Number(form.year), price: form.price, location: form.area, city: form.city, mileage: '', fuelType: '', transmission: '', condition: 'Used', images: imageUrls }),
        'grocery': () => groceryAPI.create({ name: form.title, category: '', price: form.price, city: form.city, unit: form.unit, stock: Number(form.quantity) || 0, brand: '', organic: false, images: imageUrls }),
        'garment': () => garmentAPI.create({ name: form.title, category: '', price: form.price, city: form.city, size: form.size, color: form.color, material: '', brand: '', quantity: 1, images: imageUrls }),
        'jewellery': () => jewelleryAPI.create({ name: form.title, category: '', material: '', price: form.price, city: form.city, purity: '', weight: 0, weightUnit: 'grams', gemstone: '', occasion: '', images: imageUrls }),
        'finance': () => financeAPI.create({ name: form.title, type: form.serviceType, provider: '', interestRate: '', city: form.city, amountMin: 0, amountMax: 0, tenureMin: 1, tenureMax: 30, features: [], image: imageUrls[0] || '' }),
        'service': () => propertyAPI.create({ ...base, area: form.area, images: imageUrls }),
      };

      const apiCall = apiCalls[category];
      if (!apiCall) throw new Error(`Unknown category: ${category}`);

      const { data: createRes } = await apiCall();
      const propertyId = createRes?.data?._id || createRes?._id;

      if (brochure && propertyId) {
        const fd = new FormData();
        fd.append('brochure', brochure);
        const { data: brochureRes } = await propertyAPI.uploadBrochure(propertyId, fd);
        setBrochureUrl(brochureRes?.data?.brochure || brochureRes?.brochure || null);
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to publish listing');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">Post Your Listing</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details and publish your item</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.map((label, i) => (
                <button key={label} onClick={() => i <= step && setStep(i)}
                  className={`text-xs font-semibold transition-colors ${
                    i === step ? 'text-brand-blue' : i < step ? 'text-emerald-600' : 'text-gray-300'
                  } ${i > step ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              ))}
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-blue rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {step === 0 && <StepCategory selected={category} onSelect={setCategory} />}
          {step === 1 && <StepDetails form={form} onChange={updateForm} />}
          {step === 2 && <StepPhotos photos={photos} onAdd={setPhotos} brochure={brochure} onBrochureChange={setBrochure} />}
          {step === 3 && <StepSpecifics category={category} form={form} onChange={updateForm} />}
          {step === 4 && <StepReview category={category} form={form} photos={photos} />}

          {submitError && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation" />
              {submitError}
            </div>
          )}

          <div className={`flex items-center ${step === 0 ? 'justify-end' : 'justify-between'} mt-8 pt-6 border-t border-gray-100`}>
            {step > 0 && (
              <button onClick={handleBack}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <i className="fa-solid fa-arrow-left" /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={handleNext} disabled={!canNext()}
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <i className="fa-solid fa-arrow-right" />
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={handlePublish} disabled={submitting}
                  className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-check" />}
                  {submitting ? 'Publishing...' : 'Publish Listing'}
                </button>
                <button onClick={handlePublish} disabled={submitting}
                  className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fa-solid fa-floppy-disk" /> Save Draft
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          <i className="fa-solid fa-shield-halved mr-1" />
          Your listing will be reviewed before it goes live. We respect your privacy.
        </p>
      </div>
    </div>
  );
}

export default AddListing;
