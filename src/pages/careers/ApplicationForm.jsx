import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import Field from '../../components/Field';
import { uploadResumeToCloudinary } from '../../utils/uploadResumeToCloudinary';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, isEmailJSConfigured } from '../../config/emailjs';

function ApplicationForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.email.trim()) { e.email = 'Email is required.'; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email address.';
    if (!formData.phone.trim()) { e.phone = 'Phone number is required.'; }
    else if (!/^\d{10}$/.test(formData.phone)) e.phone = 'Please enter a valid 10-digit phone number.';
    if (!formData.role.trim()) e.role = 'Please specify the role.';
    if (!resumeFile) e.resume = 'Please upload your resume (PDF or DOCX).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    let resumeUrl = '';

    try {
      const result = await uploadResumeToCloudinary(resumeFile);
      resumeUrl = result.url;
    } catch (err) {
      setIsSubmitting(false);
      Swal.fire({ title: 'Upload Failed', text: 'Could not upload resume.', icon: 'error', confirmButtonColor: '#1a4b8c' });
      return;
    }

    const templateParams = {
      title: 'New Career Application',
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      service: `Career Interest: ${formData.role}`,
      message: `Application for role: ${formData.role}. Resume: ${resumeUrl}`,
    };

    if (!isEmailJSConfigured()) {
      Swal.fire({ title: 'Configuration Error', text: 'Email service is not configured. Please try again later.', icon: 'error', confirmButtonColor: '#1a4b8c' });
      setIsSubmitting(false);
      return;
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      Swal.fire({ title: 'Application Sent!', text: 'Thank you for your interest.', icon: 'success', confirmButtonColor: '#1a4b8c' });
      setFormData({ name: '', email: '', phone: '', role: '' });
      setResumeFile(null);
    } catch {
      Swal.fire({ title: 'Oops!', text: 'Something went wrong. Please try again.', icon: 'error', confirmButtonColor: '#1a4b8c' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rounded-xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm" onSubmit={handleSubmit} noValidate>
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">Application Form</p>
      <h2 className="mt-2 text-2xl font-bold text-brand-charcoal">Drop your resume</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" error={errors.name} />
        <Field label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" error={errors.email} />
        <Field label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter 10-digit phone number" error={errors.phone} />
        <Field label="Role of Interest" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Sales Executive, Manager" error={errors.role} />
      </div>

      <div className="mt-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Upload Resume (PDF/DOCX)</label>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="resume-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            errors.resume ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          }`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <i className="fa-solid fa-cloud-arrow-up text-2xl text-brand-blue mb-2" />
              <p className="text-sm text-gray-500"><span className="font-semibold text-brand-blue">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-400 mt-0.5">PDF or DOCX (Max: 5MB)</p>
            </div>
            <input id="resume-upload" ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, resume: 'File too large. Max 5MB.' })); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; return; }
                setResumeFile(file);
                if (errors.resume) setErrors((p) => ({ ...p, resume: undefined }));
              }
            }} />
          </label>
        </div>
        {resumeFile && <p className="mt-2 text-sm text-green-600 font-medium"><i className="fa-solid fa-paperclip mr-1" />{resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)</p>}
        {errors.resume && <p className="mt-2 text-xs text-red-500">{errors.resume}</p>}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-brand-navy transition-colors disabled:opacity-60"
        >
          {isSubmitting ? <><i className="fa-solid fa-spinner fa-spin" /> Uploading...</> : 'Submit Application'}
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;
