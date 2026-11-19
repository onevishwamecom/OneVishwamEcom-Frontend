import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';
import { navigateTo } from '../../config/navigation';

export default function RequirePhoneForm({ onClose }) {
  const { user, updateProfile, loading, error, clearError, logout, switchAuthMode } = useAuth();
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isSessionExpired =
    (error && /expired|unauthorized/i.test(error)) ||
    (phoneError && /expired|unauthorized/i.test(phoneError));

  const handleSessionExpiredLogin = async () => {
    try {
      await logout();
    } catch {}
    switchAuthMode('login');
  };

  const validatePhone = (val) => {
    const digits = (val || '').replace(/[\s-]/g, '');
    if (!digits) return 'Mobile number is mandatory and required';
    if (!/^[6-9]\d{9}$/.test(digits)) return 'Please enter a valid 10-digit mobile number starting with 6-9';
    return '';
  };

  const resolveErrorMessage = (raw) => {
    if (!raw) return '';
    const str = String(raw);
    if (/duplicate key|E11000|already registered/i.test(str) && !/null/i.test(str)) {
      return 'This mobile number is already registered with another account. Please use a different number.';
    }
    return str;
  };

  const displayError = resolveErrorMessage(phoneError || error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validatePhone(phone);
    if (err) {
      setPhoneError(err);
      return;
    }

    try {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      await updateProfile({
        name: user?.name || user?.fullName || 'User',
        fullName: user?.fullName || user?.name || 'User',
        phoneNumber: cleanPhone,
        mobile: cleanPhone,
        role: 'user',
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Registration Complete!',
        text: 'Your mobile number has been registered.',
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
    } catch (apiErr) {
      const msg = typeof apiErr === 'string' ? apiErr : (apiErr?.message || 'Failed to save mobile number');
      setPhoneError(resolveErrorMessage(msg));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSessionExpired ? (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-800">
            <i className="fa-solid fa-clock-rotate-left text-amber-600" />
            <span>Session Expired</span>
          </div>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Your login session has expired. Please sign in again to complete your account registration.
          </p>
          <button
            type="button"
            onClick={handleSessionExpiredLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <i className="fa-solid fa-arrow-right-to-bracket" />
            <span>SIGN IN AGAIN</span>
          </button>
        </div>
      ) : (
        <>
          {displayError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-red-600 font-medium">
              {displayError}
            </div>
          )}
        </>
      )}

      <div className="text-center mb-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue mx-auto flex items-center justify-center text-xl mb-2">
          <i className="fa-solid fa-mobile-screen-button" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Mobile Number Required</h3>
        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
          Please enter your mobile number to complete registration. This is mandatory for all OneVishwam accounts.
        </p>
      </div>

      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Mobile Number <span className="text-red-500 font-bold">*</span>
        </span>
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2.5 sm:py-3 rounded-xl border bg-white transition-all ${
            displayError
              ? 'border-red-400 ring-2 ring-red-500/10'
              : 'border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15'
          }`}
        >
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">+91</span>
          <input
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhone(val);
              setPhoneError('');
              if (clearError) clearError();
            }}
            placeholder="9876543210"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-semibold tracking-wider"
            autoFocus
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || isSessionExpired}
        className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover active:scale-[0.99] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
        <span>COMPLETE REGISTRATION</span>
      </button>
    </form>
  );
}
