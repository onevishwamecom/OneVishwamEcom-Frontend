import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import API from '../services/api';
import { getPropertyContactInfo } from '../data/footerContent';

function EnquiryModal({ open, isOpen, onClose, propertyTitle, propertyId }) {
  const isModalOpen = open ?? isOpen ?? false;
  const [tab, setTab] = useState('form'); // 'form' | 'direct'
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: propertyTitle ? `I am interested in ${propertyTitle}. Please contact me.` : '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeContact = getPropertyContactInfo(propertyTitle);

  useEffect(() => {
    if (propertyTitle) {
      setFormData((prev) => ({
        ...prev,
        message: `I am interested in ${propertyTitle}. Please contact me.`,
      }));
    }
  }, [propertyTitle]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isModalOpen, onClose]);

  useEffect(() => {
    if (!isModalOpen) {
      setCopied(false);
      setErrors({});
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Message is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'phone') val = val.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        propertyId: propertyId || undefined,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        message: formData.message.trim(),
      };

      await API.post('/api/enquiries', payload);

      Swal.fire({
        title: 'Enquiry Sent!',
        text: 'Thank you. Our team will contact you shortly.',
        icon: 'success',
        confirmButtonColor: '#1a4b8c',
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        message: propertyTitle ? `I am interested in ${propertyTitle}. Please contact me.` : '',
      });
      setErrors({});
      onClose();
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      const serverMsg = err.response?.data?.message || 'Failed to submit enquiry. Please try again or call us directly.';
      Swal.fire({
        title: 'Submission Failed',
        text: serverMsg,
        icon: 'error',
        confirmButtonColor: '#1a4b8c',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(activeContact.phoneRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden my-6 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-navy to-brand-blue px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <i className="fa-solid fa-paper-plane" /> Enquire Now
              </h2>
              {propertyTitle && (
                <p className="mt-1 text-xs text-white/85 line-clamp-1">{propertyTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTab('form')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === 'form'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
            >
              <i className="fa-solid fa-envelope mr-1.5" /> Send Message
            </button>
            <button
              type="button"
              onClick={() => setTab('direct')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                tab === 'direct'
                  ? 'bg-white text-brand-navy shadow-sm'
                  : 'bg-white/10 text-white/90 hover:bg-white/20'
              }`}
            >
              <i className="fa-solid fa-phone mr-1.5" /> Call & WhatsApp
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5">
          {tab === 'form' ? (
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-brand-charcoal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 ${
                    errors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-brand-charcoal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 ${
                      errors.phone ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-brand-charcoal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 ${
                      errors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you are looking for..."
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-brand-charcoal outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 ${
                    errors.message ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                  }`}
                />
                {errors.message && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.message}</p>}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-navy disabled:opacity-60 transition-all shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin text-xs" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane text-xs" />
                      <span>Submit Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3.5">
              <p className="text-xs text-gray-600">
                Our {activeContact.brandName} team is available to assist you immediately. Contact us via phone or WhatsApp.
              </p>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-phone text-brand-blue text-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Direct Helpline</p>
                      <a href={`tel:${activeContact.phoneTel}`} className="text-sm font-bold text-brand-charcoal hover:text-brand-blue transition-colors">
                        {activeContact.phoneDisplay}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyPhone}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-blue text-white hover:bg-brand-navy'}`}
                  >
                    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-xs`} />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-envelope text-emerald-600 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Official Email</p>
                    <a href={`mailto:${activeContact.email}`} className="text-xs font-bold text-brand-charcoal hover:text-brand-blue transition-colors break-all">
                      {activeContact.email}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${activeContact.whatsapp}${propertyTitle ? `?text=${encodeURIComponent(`Hi, I would like to enquire about ${propertyTitle}.`)}` : ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <i className="fa-brands fa-whatsapp text-sm" /> Chat on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="w-full rounded-xl border border-gray-200 text-gray-600 px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EnquiryModal;