import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';

export default function ForgotPasswordForm({ onBack, onNext }) {
  const { forgotPassword, loading, error, clearError, switchAuthMode } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  function validate(value) {
    if (!value.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(value)) return 'Invalid email format';
    return '';
  }

  function handleChange(value) {
    setEmail(value);
    clearError();
    setEmailError(validate(value));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    setEmailError(err);
    if (err) return;
    try {
      await forgotPassword(email).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Reset Link Sent!',
        text: `We have sent password reset instructions to ${email}`,
        timer: 4000,
        showConfirmButton: true,
        confirmButtonText: 'Back to Login',
      }).then(() => {
        switchAuthMode('login');
      });
    } catch {}
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}
      <p className="text-xs text-slate-500 leading-relaxed">
        Enter the email address registered with your OneVishwam account. We&rsquo;ll send you a link to reset your password.
      </p>

      {/* Email Input */}
      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Email Address
        </span>
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-brand-blue/40 bg-white">
          <i className="fa-regular fa-envelope text-brand-blue text-sm shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="user@example.com"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {emailError && <p className="mt-1 text-[11px] text-red-500 font-medium">{emailError}</p>}
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading || !email}
        className="w-full py-3 rounded-xl bg-brand-blue hover:bg-brand-blue-hover active:scale-[0.99] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 cursor-pointer"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin text-xs mr-2" />}
        <span>SEND RESET LINK</span>
      </button>

      <div className="text-center text-xs text-slate-500 pt-1">
        Remember your password?{' '}
        <button
          type="button"
          onClick={onBack}
          className="font-extrabold text-brand-blue hover:text-brand-navy transition-colors cursor-pointer"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
