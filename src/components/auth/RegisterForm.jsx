import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';
import { navigateTo } from '../../config/navigation';

export default function RegisterForm({ onSwitch, onClose }) {
  const { register, loginWithGoogle, loading, error, clearError, switchAuthMode } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Mobile number is mandatory and required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Please enter a valid 10-digit mobile number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  function handleChange(field, value) {
    setForm({ ...form, [field]: value });
    clearError();
    if (errors[field]) {
      const next = { ...errors };
      delete next[field];
      setErrors(next);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      await register({
        name: form.name,
        fullName: form.name,
        email: form.email,
        phoneNumber: form.phone,
        mobile: form.phone,
        password: form.password,
      }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      if (onClose) onClose();
      const redirect = sessionStorage.getItem('vishwam_auth_redirect');
      sessionStorage.removeItem('vishwam_auth_redirect');
      navigateTo(redirect || '/');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch {}
  };

  const handleGoogleSignIn = async () => {
    try {
      const u = await loginWithGoogle().unwrap();
      const phone = u?.phoneNumber || u?.mobile || '';
      if (!phone || !phone.trim()) {
        switchAuthMode('require-phone');
        return;
      }
      Swal.fire({
        icon: 'success',
        title: 'Signed in with Google!',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      if (onClose) onClose();
      const redirect = sessionStorage.getItem('vishwam_auth_redirect');
      sessionStorage.removeItem('vishwam_auth_redirect');
      navigateTo(redirect || '/');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch (err) {
      console.error('[Google Sign-In Error]:', err);
      Swal.fire({
        icon: 'error',
        title: 'Sign In Failed',
        text: typeof err === 'string' ? err : (err?.message || 'Google sign-in failed'),
        confirmButtonColor: '#1d4ed8',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Name Input */}
      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Full Name
        </span>
        <div
          className={`flex items-center gap-3 px-3.5 py-2 sm:py-2.5 rounded-xl border bg-white transition-all ${
            errors.name
              ? 'border-red-400 ring-2 ring-red-500/10'
              : 'border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15'
          }`}
        >
          <i className="fa-regular fa-user text-brand-blue text-sm shrink-0" />
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {errors.name && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.name}</p>}
      </div>

      {/* Phone Input */}
      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Mobile Number <span className="text-red-500 font-bold">*</span>
        </span>
        <div
          className={`flex items-center gap-3 px-3.5 py-2 sm:py-2.5 rounded-xl border bg-white transition-all ${
            errors.phone
              ? 'border-red-400 ring-2 ring-red-500/10'
              : 'border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15'
          }`}
        >
          <i className="fa-solid fa-phone text-brand-blue text-sm shrink-0" />
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="9876543210"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {errors.phone && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.phone}</p>}
      </div>

      {/* Email Input */}
      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Email id
        </span>
        <div
          className={`flex items-center gap-3 px-3.5 py-2 sm:py-2.5 rounded-xl border bg-white transition-all ${
            errors.email
              ? 'border-red-400 ring-2 ring-red-500/10'
              : 'border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15'
          }`}
        >
          <i className="fa-regular fa-envelope text-brand-blue text-sm shrink-0" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="name@email.com"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {errors.email && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.email}</p>}
      </div>

      {/* Passwords grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="relative pt-1.5">
          <span className="absolute top-0 left-3 bg-white px-1 text-[10px] font-bold text-brand-blue z-10 tracking-wide select-none">
            Password
          </span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-blue/40 bg-white">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-300 font-medium"
            />
          </div>
          {errors.password && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.password}</p>}
        </div>

        <div className="relative pt-1.5">
          <span className="absolute top-0 left-3 bg-white px-1 text-[10px] font-bold text-brand-blue z-10 tracking-wide select-none">
            Confirm
          </span>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-blue/40 bg-white">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.confirm}
              onChange={(e) => handleChange('confirm', e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder="••••••••"
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-300 font-medium"
            />
          </div>
          {errors.confirm && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.confirm}</p>}
        </div>
      </div>

      {/* CREATE ACCOUNT Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-slate-950 hover:bg-[#0f233a] active:scale-[0.99] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
        <span>CREATE ACCOUNT</span>
      </button>

      {/* OR Divider */}
      <div className="relative my-2.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="bg-white px-3">OR SIGN UP WITH</span>
        </div>
      </div>

      {/* Google Sign-Up Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        title="Sign up with Google"
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign up with Google</span>
      </button>

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-500 font-medium pt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-extrabold text-brand-blue hover:text-brand-navy transition-colors cursor-pointer"
        >
          Login
        </button>
      </p>
    </form>
  );
}
