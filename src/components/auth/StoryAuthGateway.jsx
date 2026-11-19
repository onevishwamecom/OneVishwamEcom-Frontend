import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../store/authSlice';
import logo from '../../assets/logo.png';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import RequirePhoneForm from './RequirePhoneForm';

const RULES = [
  { key: 'min', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'One special character', test: (v) => /[!@#$%^&*()_\-+=<>?/{}[\]~|]/.test(v) },
];

// ─── VERIFY OTP FORM ──────────────────────────────────────────────────────────
function VerifyOtpForm({ onBack, onNext }) {
  const { verifyOtp, resendOtp, loading, error, clearError, forgotEmail } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  function handleChange(index, value) {
    clearError();
    setOtpError('');
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('Please enter the complete 6-digit code');
      return;
    }
    try {
      const result = await verifyOtp({ email: forgotEmail, otp: code }).unwrap();
      onNext(result.verifyToken);
    } catch {}
  };

  return (
    <div className="space-y-3.5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}
      <p className="text-xs text-slate-500 text-center">
        Enter the 6-digit code sent to <strong className="text-slate-800">{forgotEmail}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="flex gap-2 justify-center py-1">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-10 w-9 sm:h-11 sm:w-10 rounded-xl border border-brand-blue/40 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 text-center text-base font-black text-slate-800 outline-none transition-all"
            />
          ))}
        </div>
        {otpError && <p className="text-[11px] text-red-500 text-center font-medium">{otpError}</p>}

        <button
          type="submit"
          disabled={loading || otp.join('').length !== 6}
          className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 cursor-pointer"
        >
          {loading && <i className="fa-solid fa-circle-notch fa-spin text-xs mr-2" />}
          <span>VERIFY CODE</span>
        </button>

        <div className="text-center space-y-0.5 text-xs text-slate-400">
          <p>
            Code expires in <span className="font-mono font-bold text-slate-700">{formatTime(timer)}</span>
          </p>
          {canResend && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await resendOtp(forgotEmail).unwrap();
                  setTimer(300);
                  setCanResend(false);
                } catch {}
              }}
              className="text-brand-blue hover:underline font-bold text-xs"
            >
              Resend Code
            </button>
          )}
        </div>
      </form>

      <div className="text-center text-xs text-slate-500 pt-0.5">
        <button
          type="button"
          onClick={onBack}
          className="font-extrabold text-brand-blue hover:text-brand-navy transition-colors cursor-pointer"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}

// ─── SET PASSWORD FORM ────────────────────────────────────────────────────────
function SetPasswordForm({ onBack, onSuccess }) {
  const { resetPasswordWithOtp, loading, error, clearError, forgotEmail, verifyToken } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!password) e.password = 'Password is required';
    else if (!RULES.every((r) => r.test(password))) e.password = 'Does not meet all requirements';
    if (!confirm) e.confirm = 'Please confirm password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      await resetPasswordWithOtp({ email: forgotEmail, verifyToken, password }).unwrap();
      onSuccess();
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-1.5 text-xs text-red-600 font-medium">
          {error}
        </div>
      )}

      <div className="relative pt-1">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[10px] font-bold text-brand-blue z-10 tracking-wide select-none">
          New Password
        </span>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-brand-blue/40 bg-white">
          <i className="fa-solid fa-lock text-brand-blue text-xs shrink-0" />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearError(); }}
            placeholder="••••••••••••"
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {errors.password && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.password}</p>}
      </div>

      <div className="relative pt-1">
        <span className="absolute top-0 left-3.5 bg-white px-1.5 text-[10px] font-bold text-brand-blue z-10 tracking-wide select-none">
          Confirm Password
        </span>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-brand-blue/40 bg-white">
          <i className="fa-solid fa-lock text-brand-blue text-xs shrink-0" />
          <input
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); clearError(); }}
            onPaste={(e) => e.preventDefault()}
            placeholder="••••••••••••"
            className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-300 font-medium"
          />
        </div>
        {errors.confirm && <p className="mt-0.5 text-[10px] text-red-500 font-medium">{errors.confirm}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 cursor-pointer"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin text-xs mr-2" />}
        <span>SAVE NEW PASSWORD</span>
      </button>
    </form>
  );
}

// ─── RESET SUCCESS VIEW ───────────────────────────────────────────────────────
function ResetSuccessView({ onClose }) {
  return (
    <div className="text-center py-3 space-y-3">
      <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
        <i className="fa-solid fa-check text-xl" />
      </div>
      <div>
        <h3 className="text-base font-black text-slate-900">Password Updated!</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Your password has been changed successfully.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 cursor-pointer"
      >
        Go to Login
      </button>
    </div>
  );
}

// ─── MAIN AUTH GATEWAY (Story removed — pure auth modal) ─────────────────────
export default function StoryAuthGateway() {
  const {
    isLoggedIn,
    user,
    showAuthModal,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    switchAuthMode,
    setVerifyToken,
    verifyToken,
    fetchMe,
  } = useAuth();

  const checkedPhoneForUserRef = useRef(null);

  // Clean up direct login flag when successfully logged in
  useEffect(() => {
    if (isLoggedIn && typeof window !== 'undefined') {
      sessionStorage.removeItem('vishwam_direct_login');
    }
  }, [isLoggedIn]);

  // Handle post-login redirect to intended category page
  useEffect(() => {
    if (isLoggedIn && typeof window !== 'undefined') {
      try {
        const redirect = sessionStorage.getItem('vishwam_auth_redirect');
        if (redirect) {
          sessionStorage.removeItem('vishwam_auth_redirect');
          // Use a small delay so auth state fully propagates before navigation
          setTimeout(() => {
            window.location.href = redirect;
          }, 100);
        }
      } catch {}
    }
  }, [isLoggedIn]);

  // Check phone requirement for social sign-in users
  useEffect(() => {
    let isCancelled = false;

    if (!isLoggedIn || !user) {
      checkedPhoneForUserRef.current = null;
      return;
    }

    const hasLocalPhone = Boolean(user.phoneNumber || user.mobile || user.phone);
    if (hasLocalPhone) {
      if (showAuthModal && authModalMode === 'require-phone') {
        closeAuthModal();
      }
      return;
    }

    const userId = user._id || user.uid || user.firebaseUid || user.email;
    if (checkedPhoneForUserRef.current === userId) {
      if (!showAuthModal || authModalMode !== 'require-phone') {
        openAuthModal('require-phone');
      }
      return;
    }

    checkedPhoneForUserRef.current = userId;

    const verifyPhoneRequirement = async () => {
      try {
        const freshUser = await fetchMe().unwrap();
        if (isCancelled) return;
        const hasRemotePhone = Boolean(freshUser?.phoneNumber || freshUser?.mobile || freshUser?.phone);
        if (hasRemotePhone) {
          if (showAuthModal && authModalMode === 'require-phone') {
            closeAuthModal();
          }
          return;
        }
      } catch {}

      if (!isCancelled) {
        if (!showAuthModal || authModalMode !== 'require-phone') {
          openAuthModal('require-phone');
        }
      }
    };

    verifyPhoneRequirement();

    return () => {
      isCancelled = true;
    };
  }, [isLoggedIn, user, showAuthModal, authModalMode, openAuthModal, closeAuthModal, fetchMe]);

  // Determine whether the modal is mandatory (category gate — cannot be dismissed)
  const isMandatory = typeof window !== 'undefined'
    ? sessionStorage.getItem('vishwam_auth_redirect') !== null
    : false;

  // Show modal when: not logged in AND (showAuthModal triggered) OR require-phone needed
  const shouldShow =
    (!isLoggedIn && showAuthModal) ||
    (isLoggedIn && showAuthModal && authModalMode === 'require-phone');

  if (!shouldShow) return null;

  const handleClose = () => {
    // If mandatory (category gate), prevent closing without login
    if (isMandatory && !isLoggedIn) return;
    closeAuthModal();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-md"
      onClick={isMandatory && !isLoggedIn ? undefined : handleClose}
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-sky-300/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[130px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════
          AUTH CARD — Clean, no story slider
          ══════════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.5)] border border-brand-blue/15 overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh] sm:max-h-[85vh] h-auto my-auto animate-in fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── LEFT HERO: Brand & Trust Anchor ── */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between h-full min-h-0 p-5 lg:p-6 overflow-hidden bg-gradient-to-b from-[#d9ebfa] via-[#e8f2fb] to-[#cfe4f6] text-slate-900 select-none border-r border-sky-200/80">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-sky-300/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-56 h-56 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="OneVishwam Living"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#d9ebfa]/85 via-[#e8f2fb]/70 to-[#cfe4f6]/85 pointer-events-none" />

          <div className="relative z-10 space-y-3 pt-0.5 shrink-0">
            <div className="inline-flex items-center bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs border border-sky-200/80">
              <img src={logo} alt="OneVishwam Logo" className="h-6 w-auto object-contain" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base lg:text-lg font-black text-slate-950 tracking-tight">
                Welcome to OneVishwam
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                Your all-in-one destination for verified Properties, Smart Mobility, and Co-operative Finance.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800">
                <i className="fa-solid fa-circle-check text-brand-blue" />
                <span>10,000+ Verified Bengaluru Listings</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800">
                <i className="fa-solid fa-circle-check text-brand-blue" />
                <span>Regulated Co-operative Credit Partners</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800">
                <i className="fa-solid fa-circle-check text-brand-blue" />
                <span>24-Hour Trusted Session Persistence</span>
              </div>
            </div>
          </div>

          {/* Mandatory gate notice */}
          {isMandatory && !isLoggedIn && (
            <div className="relative z-10 mt-4 shrink-0">
              <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800 font-semibold">
                <i className="fa-solid fa-lock mr-1.5 text-amber-600" />
                Login is required to access this section.
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Authentication Forms ── */}
        <div className="md:col-span-7 relative flex flex-col justify-between h-full min-h-0 bg-white px-4 py-4 sm:px-7 sm:py-5 overflow-y-auto">
          {/* Close button (only if not mandatory) */}
          {!isMandatory && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors z-20 cursor-pointer"
              aria-label="Close"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          )}

          <div className="relative z-10 max-w-sm mx-auto w-full my-auto">
            <div className="text-center mb-2.5">
              <div className="flex justify-center mb-1.5 md:hidden">
                <img src={logo} alt="OneVishwam Logo" className="h-6 w-auto object-contain" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-brand-blue tracking-tight">
                {authModalMode === 'login'
                  ? 'Sign In'
                  : authModalMode === 'require-phone'
                  ? 'One Last Step'
                  : authModalMode === 'forgot'
                  ? 'Reset Password'
                  : authModalMode === 'verify-otp'
                  ? 'Verify Email'
                  : authModalMode === 'reset-password'
                  ? 'New Password'
                  : authModalMode === 'reset-success'
                  ? 'Password Updated'
                  : 'Welcome'}
              </h2>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                {authModalMode === 'login'
                  ? 'Access Verified Portals & Finance'
                  : authModalMode === 'register'
                  ? 'Create Your Free Account'
                  : authModalMode === 'require-phone'
                  ? 'Mobile Number Mandatory'
                  : 'Follow the steps to continue'}
              </p>

              {(authModalMode === 'login' || authModalMode === 'register') && (
                <div className="flex items-center justify-center p-1 bg-slate-100 rounded-xl mt-3 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => switchAuthMode('login')}
                    className={`flex-1 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      authModalMode === 'login'
                        ? 'bg-[#90dafc] text-slate-950 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => switchAuthMode('register')}
                    className={`flex-1 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                      authModalMode === 'register'
                        ? 'bg-[#90dafc] text-slate-950 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Register Now
                  </button>
                </div>
              )}
            </div>

            {/* Form Views */}
            {authModalMode === 'login' ? (
              <LoginForm
                onSwitch={() => switchAuthMode('register')}
                onClose={() => closeAuthModal()}
              />
            ) : authModalMode === 'register' ? (
              <RegisterForm
                onSwitch={() => switchAuthMode('login')}
                onClose={() => closeAuthModal()}
              />
            ) : authModalMode === 'require-phone' ? (
              <RequirePhoneForm onClose={() => closeAuthModal()} />
            ) : authModalMode === 'forgot' ? (
              <ForgotPasswordForm
                onBack={() => switchAuthMode('login')}
                onNext={() => switchAuthMode('verify-otp')}
              />
            ) : authModalMode === 'verify-otp' ? (
              <VerifyOtpForm
                onBack={() => switchAuthMode('forgot')}
                onNext={(vt) => {
                  setVerifyToken(vt);
                  switchAuthMode('reset-password');
                }}
              />
            ) : authModalMode === 'reset-password' ? (
              <SetPasswordForm
                onBack={() => switchAuthMode('verify-otp')}
                onSuccess={() => switchAuthMode('reset-success')}
              />
            ) : authModalMode === 'reset-success' ? (
              <ResetSuccessView onClose={() => closeAuthModal()} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
