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

const STORY_CHAPTERS = [
  {
    id: 'mission',
    title: 'Karnataka’s FinVerse',
    tagline: 'Property, Mobility & Direct Co-op Credit',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    summary: 'Direct connect to verified assets with honest co-operative loans and zero broker fees.',
    leftCard: {
      title: 'Trusted Karnataka Network',
      stats: [
        { value: '10,000+', label: 'Listings', icon: 'fa-solid fa-city' },
        { value: '₹100 Cr+', label: 'Safe Volume', icon: 'fa-solid fa-coins' },
        { value: '5,000+', label: 'Families', icon: 'fa-solid fa-users' },
      ],
      tag: '🏛️ Registered Co-op Partners',
    },
    bullets: [
      { icon: 'fa-solid fa-landmark', text: 'Regulated Co-operative Partners across Karnataka' },
      { icon: 'fa-solid fa-city', text: 'Bengaluru-first field operations & local advisors' },
      { icon: 'fa-solid fa-handshake-slash', text: '0% Brokerage — direct owner connect' },
    ],
  },
  {
    id: 'properties',
    title: 'Verified Real Estate',
    tagline: '100% Legal Due Diligence',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    summary: 'RERA-checked plots, villas, and commercial spaces with verified title deeds.',
    leftCard: {
      title: 'Property Title Guarantee',
      stats: [
        { value: '100%', label: 'Due Diligence', icon: 'fa-solid fa-shield-halved' },
        { value: '0%', label: 'Broker Fee', icon: 'fa-solid fa-hand-holding-dollar' },
        { value: 'Direct', label: 'Owner Connect', icon: 'fa-solid fa-handshake' },
      ],
      tag: '📜 100% Verified Title Deeds',
    },
    bullets: [
      { icon: 'fa-solid fa-certificate', text: 'Full legal title check & encumbrance certification' },
      { icon: 'fa-solid fa-house-chimney', text: '10,000+ active listings across Bengaluru zones' },
      { icon: 'fa-solid fa-user-shield', text: 'Direct seller connect, zero broker pressure' },
    ],
  },
  {
    id: 'mobility',
    title: 'Certified Mobility & Living',
    tagline: 'Multi-Point Inspection Standard',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    summary: 'Pre-inspected vehicles and factory-direct home comfort at transparent prices.',
    leftCard: {
      title: 'Quality Certification',
      stats: [
        { value: '200-Pt', label: 'Vehicle Audit', icon: 'fa-solid fa-clipboard-check' },
        { value: 'Direct', label: 'Factory Sourcing', icon: 'fa-solid fa-industry' },
        { value: 'Warranty', label: 'Assured', icon: 'fa-solid fa-award' },
      ],
      tag: '🚗 200-Pt Inspection Certified',
    },
    bullets: [
      { icon: 'fa-solid fa-car-on', text: 'Rigorous 200+ point checks with verified history logs' },
      { icon: 'fa-solid fa-industry', text: 'Direct manufacturer pricing with no markups' },
      { icon: 'fa-solid fa-shield-halved', text: 'Authentic manufacturer warranty documentation' },
    ],
  },
  {
    id: 'finance',
    title: 'Co-operative Finance',
    tagline: 'Affordable Credit & Fast Approvals',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    summary: 'Partnered with registered credit societies for low-interest, ethical asset financing.',
    leftCard: {
      title: 'Co-Operative Society Credit',
      stats: [
        { value: 'Lowest', label: 'Interest Rates', icon: 'fa-solid fa-percent' },
        { value: '24-48h', label: 'Digital Approvals', icon: 'fa-solid fa-bolt' },
        { value: '5,000+', label: 'Empowered Families', icon: 'fa-solid fa-users-gear' },
      ],
      tag: '🤝 Regulated Community Micro-Credit',
    },
    bullets: [
      { icon: 'fa-solid fa-percent', text: 'Low-interest rates for sustainable ownership' },
      { icon: 'fa-solid fa-bolt', text: 'Fast-track digital approvals within 24-48 hours' },
      { icon: 'fa-solid fa-users', text: 'Empowering 5,000+ Karnataka families' },
    ],
  },
];

const AUTOPLAY_INTERVAL = 6000;

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
          className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-[#0f233a] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 cursor-pointer"
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
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
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
            onChange={(e) => {
              setConfirm(e.target.value);
              clearError();
            }}
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
        className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-[#0f233a] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50 cursor-pointer"
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
        className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-[#0f233a] text-white text-xs font-black tracking-widest uppercase transition-all shadow-md shadow-brand-blue/20 cursor-pointer"
      >
        Go to Login
      </button>
    </div>
  );
}

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

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // When opening unauthenticated, ALWAYS show story walkthrough unless explicitly requested
  const [viewState, setViewState] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('vishwam_direct_login') === 'true') {
      return 'auth';
    }
    return 'story';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const timerRef = useRef(null);
  const checkedPhoneForUserRef = useRef(null);

  // When showAuthModal is true (like on manual Logout or Login button click), switch to auth if explicit
  useEffect(() => {
    if (showAuthModal) {
      if (
        authModalMode === 'require-phone' ||
        (typeof window !== 'undefined' && sessionStorage.getItem('vishwam_direct_login') === 'true')
      ) {
        setViewState('auth');
      }
    }
  }, [showAuthModal, authModalMode]);

  // Clean up direct login flag when successfully logged in
  useEffect(() => {
    if (isLoggedIn && typeof window !== 'undefined') {
      sessionStorage.removeItem('vishwam_direct_login');
    }
  }, [isLoggedIn]);

  // Story progression timer (runs only when in story mode and not logged in)
  useEffect(() => {
    if (isLoggedIn || viewState !== 'story' || isPaused) {
      return;
    }

    const intervalTime = 50;
    const stepIncrement = (intervalTime / AUTOPLAY_INTERVAL) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          setActiveChapterIndex((idx) => {
            if (idx < STORY_CHAPTERS.length - 1) {
              return idx + 1;
            } else {
              handleTransitionToAuth('login');
              return idx;
            }
          });
          return 0;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoggedIn, viewState, isPaused, activeChapterIndex]);

  // Handle smooth transition from Story to Auth Card
  const handleTransitionToAuth = useCallback(
    (mode = 'login') => {
      setIsTransitioning(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('vishwam_direct_login', 'true');
      }
      setTimeout(() => {
        setViewState('auth');
        if (authModalMode !== mode) {
          switchAuthMode(mode);
        }
        setIsTransitioning(false);
      }, 300);
    },
    [authModalMode, switchAuthMode]
  );

  // Return to story from Auth Card
  const handleReturnToStory = useCallback(() => {
    setIsTransitioning(true);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('vishwam_direct_login');
    }
    setTimeout(() => {
      setViewState('story');
      setProgress(0);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleNextChapter = () => {
    if (activeChapterIndex < STORY_CHAPTERS.length - 1) {
      setActiveChapterIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      handleTransitionToAuth('login');
    }
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      setActiveChapterIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleSelectChapter = (index) => {
    setActiveChapterIndex(index);
    setProgress(0);
  };

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

  // If user is already logged in and there's no auth modal requirement, do not render
  if (isLoggedIn && (!showAuthModal || authModalMode !== 'require-phone')) {
    return null;
  }

  const currentChapter = STORY_CHAPTERS[activeChapterIndex] || STORY_CHAPTERS[0];

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-950/60 backdrop-blur-md transition-all duration-500 ease-in-out ${
        isTransitioning ? 'opacity-70 scale-[0.99]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-sky-300/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[130px] pointer-events-none" />

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 1: SLEEK & COMPACT STORY WALKTHROUGH (WEBSITE LIGHT THEME)
          ══════════════════════════════════════════════════════════════════ */}
      {viewState === 'story' && !isLoggedIn && (
        <div
          className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-[2rem] shadow-[0_25px_80px_rgba(15,35,58,0.35)] border border-sky-200/80 overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] sm:max-h-[85vh] h-auto my-auto animate-in fade-in duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* ── TOP SEGMENTED STORY PROGRESS BAR (Without Names) ── */}
          <div className="w-full md:col-span-12 px-4 sm:px-6 pt-3 pb-2 bg-white/95 border-b border-sky-100/80 flex items-center gap-1.5 sm:gap-2 z-20 shrink-0">
            {STORY_CHAPTERS.map((ch, idx) => {
              const isCurrent = idx === activeChapterIndex;
              const isCompleted = idx < activeChapterIndex;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChapter(idx)}
                  className="flex-1 h-1 sm:h-1.5 rounded-full bg-sky-200/70 overflow-hidden cursor-pointer focus:outline-none transition-all"
                  aria-label={`Slide ${idx + 1}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-75 ${
                      isCompleted
                        ? 'w-full bg-brand-blue'
                        : isCurrent
                        ? 'bg-brand-blue'
                        : 'w-0'
                    }`}
                    style={{
                      width: isCurrent ? `${progress}%` : isCompleted ? '100%' : '0%',
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* ── LEFT HERO: Compact Visual & Live Trust Stat Hub (Light Theme) ── */}
          <div className="md:col-span-5 relative hidden md:flex flex-col justify-between h-full min-h-0 p-4 lg:p-5 overflow-hidden bg-gradient-to-b from-[#d9ebfa] via-[#e8f2fb] to-[#cfe4f6] text-slate-900 select-none border-r border-sky-200/80">
            {/* Background Image */}
            <img
              key={currentChapter.id}
              src={currentChapter.image}
              alt={currentChapter.title}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-multiply scale-105 transition-all duration-700 ease-out pointer-events-none"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#d9ebfa]/85 via-[#e8f2fb]/70 to-[#cfe4f6]/85 pointer-events-none" />

            {/* Top Brand Logo */}
            <div className="relative z-10 shrink-0 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-xs border border-sky-200/80">
                <img src={logo} alt="OneVishwam Logo" className="h-5 lg:h-6 w-auto object-contain" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-brand-blue border border-sky-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-ping" />
                <span>Karnataka's Trusted Platform</span>
              </div>
            </div>

            {/* Compact Floating Trust Stats Card */}
            <div className="relative z-10 my-auto py-2 flex-1 min-h-0 flex flex-col justify-center">
              <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-sky-200/90 shadow-md space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-sky-100 pb-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-brand-blue">
                    {currentChapter.leftCard.title}
                  </h4>
                  <i className="fa-solid fa-bolt text-brand-blue text-[10px]" />
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {currentChapter.leftCard.stats.map((st, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded-xl bg-sky-50/70 border border-sky-100 text-center"
                    >
                      <i className={`${st.icon} text-brand-blue text-[10px] mb-0.5 block`} />
                      <div className="text-[11px] font-black text-slate-900 leading-tight">
                        {st.value}
                      </div>
                      <div className="text-[8px] text-slate-600 font-semibold truncate">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 border-t border-sky-100 flex items-center gap-1.5 text-[9px] text-emerald-700 font-bold truncate">
                  <i className="fa-solid fa-circle-check text-[10px]" />
                  <span>{currentChapter.leftCard.tag}</span>
                </div>
              </div>
            </div>

            {/* Bottom Trust Anchor (Clean, No Names) */}
            <div className="relative z-10 shrink-0 pt-2 flex items-center justify-between text-[10px] text-slate-600 font-semibold border-t border-sky-200/60">
              <span className="flex items-center gap-1.5 text-brand-blue font-bold">
                <i className="fa-solid fa-shield-halved text-xs" />
                <span>100% Certified Direct Connect</span>
              </span>
              <span className="text-[9px] text-slate-400">OneVishwam</span>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Content & Action Bar (Light Theme) ── */}
          <div className="md:col-span-7 relative flex flex-col justify-between h-full min-h-0 p-4 sm:p-5 lg:p-6 bg-white text-slate-900 overflow-hidden">
            {/* Mobile-only brand header */}
            <div className="flex md:hidden items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-100 shrink-0">
              <div className="inline-flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <img src={logo} alt="OneVishwam Logo" className="h-5 w-auto object-contain" />
              </div>
              <span className="text-[10px] font-bold text-brand-blue">Karnataka's Trusted Platform</span>
            </div>

            {/* Top Bar: Chapter Counter & Skip to Login */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 shrink-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <span className="text-brand-blue font-black">{activeChapterIndex + 1}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500">{STORY_CHAPTERS.length}</span>
              </div>

              <button
                type="button"
                onClick={() => handleTransitionToAuth('login')}
                className="text-[11px] font-bold text-brand-blue hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1 shrink-0 pl-1"
              >
                <span>Skip to Login</span>
                <i className="fa-solid fa-arrow-right text-[9px]" />
              </button>
            </div>

            {/* Middle Narrative & Punchy Trust Points */}
            <div className="flex-1 min-h-0 overflow-y-auto py-2.5 space-y-2 pr-1 select-text">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 leading-tight tracking-tight">
                  {currentChapter.title}
                </h2>
                <p className="text-[11px] sm:text-xs font-bold text-brand-blue mt-0.5">
                  {currentChapter.tagline}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {currentChapter.summary}
              </p>

              {/* 3 Compact Trust Pills */}
              <div className="space-y-1.5 pt-0.5">
                {currentChapter.bullets.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-brand-blue/30 hover:bg-sky-50/40 transition-colors shadow-2xs"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue text-[10px] shrink-0">
                      <i className={b.icon} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 leading-snug">
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Row — Strictly Anchored */}
            <div className="border-t border-slate-100 pt-2 space-y-1.5 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevChapter}
                  disabled={activeChapterIndex === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 border border-slate-200 transition-all cursor-pointer shrink-0"
                  aria-label="Previous Chapter"
                >
                  <i className="fa-solid fa-arrow-left text-xs" />
                </button>

                {activeChapterIndex < STORY_CHAPTERS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextChapter}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#90dafc] hover:bg-[#78d0f8] text-slate-950 text-xs font-black tracking-wider uppercase transition-all shadow-md shadow-[#90dafc]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Next Chapter</span>
                    <i className="fa-solid fa-arrow-right text-[11px]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTransitionToAuth('login')}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-950 hover:bg-[#0f233a] text-white text-xs font-black tracking-widest uppercase transition-all shadow-lg shadow-slate-950/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <span>Sign In to Unlock Portal</span>
                    <i className="fa-solid fa-arrow-right-to-bracket text-[11px]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 2: ELEVATED LOGIN & REGISTRATION CARD (COMPACT & RESPONSIVE)
          ══════════════════════════════════════════════════════════════════ */}
      {(viewState === 'auth' || (isLoggedIn && authModalMode === 'require-phone')) && (
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

            {!isLoggedIn && (
              <div className="relative z-10 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={handleReturnToStory}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md px-3 py-1 text-xs font-bold text-slate-800 border border-sky-300 shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-book-open text-brand-blue text-xs" />
                  <span>✨ View OneVishwam Story</span>
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: Authentication Forms ── */}
          <div className="md:col-span-7 relative flex flex-col justify-between h-full min-h-0 bg-white px-4 py-4 sm:px-7 sm:py-5 overflow-y-auto">
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
      )}
    </div>
  );
}
