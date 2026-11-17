import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';
import { navigateTo } from '../../config/navigation';

export default function LoginForm({ onSwitch, onClose }) {
  const { login, loginWithGoogle, loading, error, clearError, switchAuthMode } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
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
      await login({ email: form.email, password: form.password }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-600 font-medium animate-in fade-in">
          {error}
        </div>
      )}

      {/* Email Input with floating label pill */}
      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Email id
        </span>
        <div
          className={`flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl border bg-white transition-all ${
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
            placeholder="user@example.com"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {errors.email && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.email}</p>}
      </div>

      {/* Password Input with floating label pill */}
      <div className="relative pt-1.5">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[11px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Password
        </span>
        <div
          className={`flex items-center gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl border bg-white transition-all ${
            errors.password
              ? 'border-red-400 ring-2 ring-red-500/10'
              : 'border-brand-blue/40 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/15'
          }`}
        >
          <i className="fa-solid fa-lock text-brand-blue text-sm shrink-0" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-brand-blue transition-colors p-0.5 cursor-pointer"
            aria-label="Toggle password visibility"
          >
            <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`} />
          </button>
        </div>
        {errors.password && <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.password}</p>}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          onClick={() => switchAuthMode('forgot')}
          className="text-xs text-slate-500 hover:text-brand-blue font-medium transition-colors cursor-pointer"
        >
          Forgot your password?
        </button>
      </div>

      {/* LOGIN Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-slate-950 hover:bg-[#0f233a] active:scale-[0.99] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin text-xs" />}
        <span>LOGIN</span>
      </button>

      {/* OR Divider */}
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="bg-white px-3">OR CONTINUE WITH</span>
        </div>
      </div>

      {/* Google Sign-In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        title="Sign in with Google"
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
        <span>Sign in with Google</span>
      </button>

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-500 font-medium pt-1">
        Don&rsquo;t have account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-extrabold text-brand-blue hover:text-brand-navy transition-colors cursor-pointer"
        >
          Register Now
        </button>
      </p>
    </form>
  );
}
