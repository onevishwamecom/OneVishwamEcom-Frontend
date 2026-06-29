import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const VEHICLE_CATEGORIES = ['2W', '3W', '4W', 'Commercial'];
const EMPLOYMENT_TYPES = ['Salaried', 'Self-Employed', 'Business'];

function QuickLoanModal({ prefill, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [vehicleCondition, setVehicleCondition] = useState('New');
  const [loanAmount, setLoanAmount] = useState('');
  const [employment, setEmployment] = useState('');

  useEffect(() => {
    if (prefill) {
      const catMap = { '2-wheeler': '2W', '3-wheeler': '3W', '4-wheeler': '4W', commercial: 'Commercial' };
      setCategory(catMap[prefill.category] || '');
      setVehicleCondition(prefill.condition === 'new' ? 'New' : 'Old');
    }
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prefill, onClose]);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !category || !loanAmount || !employment) {
      Swal.fire({ icon: 'warning', title: 'Please fill all required fields', timer: 2000, showConfirmButton: false });
      return;
    }
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      Swal.fire({ icon: 'warning', title: 'Enter a valid 10-digit phone number', timer: 2000, showConfirmButton: false });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Request Submitted!',
      text: 'Your loan request has been submitted! Our team will contact you within 24 hours.',
      confirmButtonColor: '#1f3b73',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-brand-charcoal">Check Loan Eligibility</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-xmark text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Phone Number</label>
            <input type="text" inputMode="numeric" maxLength={10} value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Vehicle Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white">
              <option value="">Select Category</option>
              {VEHICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Vehicle Condition</label>
            <div className="flex gap-3">
              {['New', 'Old'].map((opt) => (
                <label key={opt} className={`flex-1 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm cursor-pointer transition-colors ${
                  vehicleCondition === opt
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  <input type="radio" name="loanCondition" checked={vehicleCondition === opt}
                    onChange={() => setVehicleCondition(opt)} className="sr-only" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Loan Amount Required (₹ in Lakhs)</label>
            <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 5"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">Employment Type</label>
            <select value={employment} onChange={(e) => setEmployment(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-blue bg-white">
              <option value="">Select Employment Type</option>
              {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={handleSubmit}
            className="w-full rounded-xl bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Submit Request
          </button>
          <div className="space-y-1 text-center text-xs text-gray-400">
            <p><i className="fa-solid fa-headset mr-1" />Live call support available 24/7</p>
            <p><i className="fa-solid fa-shield mr-1" />All policies followed as per RBI guidelines</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickLoanModal;
