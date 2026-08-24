import { useState, useRef, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';
import { navigateTo } from '../../config/navigation';
import PasswordInput from '../ui/PasswordInput';

const RULES = [
  { key: 'min', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'One special character', test: (v) => /[!@#$%^&*()_\-+=<>?/{}[\]~|]/.test(v) },
];

function LoginForm({ onSwitch, onClose }) {
  const { login, loading, error, clearError, switchAuthMode } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      Swal.fire({ icon: 'success', title: 'Login Successful!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
      onClose();
      const redirect = sessionStorage.getItem('vishwam_auth_redirect');
      if (redirect) {
        sessionStorage.removeItem('vishwam_auth_redirect');
        navigateTo(redirect);
      }
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
            errors.email
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
              : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <PasswordInput label="Password" value={form.password}
        onChange={(e) => handleChange('password', e.target.value)}
        placeholder="Enter your password" error={errors.password}
      />
      <button type="submit" disabled={loading}
        className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={() => switchAuthMode('forgot')} className="text-brand-blue hover:underline font-medium">Forgot Password?</button>
        <button type="button" onClick={onSwitch} className="text-brand-blue hover:underline font-medium">Create New Account</button>
      </div>
    </form>
  );
}

function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) return 'Full name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 50) return 'Name must be at most 50 characters';
  return '';
}

function validatePhone(phone) {
  if (!phone.trim()) return 'Mobile number is required';
  const digits = phone.replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(digits)) return 'Invalid mobile number';
  return '';
}

function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Invalid email';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'At least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Missing uppercase letter';
  if (!/[a-z]/.test(password)) return 'Missing lowercase letter';
  if (!/[0-9]/.test(password)) return 'Missing number';
  if (!/[!@#$%^&*()_\-+=<>?/{}[\]~|]/.test(password)) return 'Missing special character';
  return '';
}

function validateConfirm(password, confirm) {
  if (!confirm) return 'Confirm password is required';
  if (password !== confirm) return 'Passwords do not match';
  return '';
}

function isFormValid(name, phone, email, password, confirm) {
  return !validateName(name) && !validatePhone(phone) && !validateEmail(email) && !validatePassword(password) && !validateConfirm(password, confirm);
}

function RegisterForm({ onSwitch, onClose }) {
  const { register, loading, error, clearError } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  function getFieldError(field, data = form) {
    switch (field) {
      case 'name': return validateName(data.name);
      case 'phone': return validatePhone(data.phone);
      case 'email': return validateEmail(data.email);
      case 'password': return validatePassword(data.password);
      case 'confirm': return validateConfirm(data.password, data.confirm);
      default: return '';
    }
  }

  function handleChange(field, value) {
    const updated = { ...form, [field]: value };
    setForm(updated);

    setErrors((prev) => {
      const next = { ...prev };
      const err = getFieldError(field, updated);
      if (err) {
        next[field] = err;
      } else {
        delete next[field];
      }
      if (field === 'password' && 'confirm' in next) {
        const confirmErr = getFieldError('confirm', updated);
        if (confirmErr) {
          next.confirm = confirmErr;
        } else {
          delete next.confirm;
        }
      }
      return next;
    });

    clearError();
    setServerError(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    for (const field of ['name', 'phone', 'email', 'password', 'confirm']) {
      const err = getFieldError(field, form);
      if (err) newErrors[field] = err;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      await register({
        fullName: form.name,
        mobile: form.phone,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
      }).unwrap();
      Swal.fire({ icon: 'success', title: 'Account Created!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
      onClose();
      const redirect = sessionStorage.getItem('vishwam_auth_redirect');
      if (redirect) {
        sessionStorage.removeItem('vishwam_auth_redirect');
        navigateTo(redirect);
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        setServerError(err.response.data.message);
      }
      const srvErrors = err?.response?.data?.errors;
      if (srvErrors && Array.isArray(srvErrors)) {
        const mapped = {};
        const fieldMap = { fullName: 'name', mobile: 'phone', confirmPassword: 'confirm' };
        for (const { field, message } of srvErrors) {
          const formField = fieldMap[field] || field;
          if (formField in form) mapped[formField] = message;
        }
        if (Object.keys(mapped).length) setErrors(mapped);
      } else if (srvErrors && typeof srvErrors === 'object') {
        const mapped = {};
        const fieldMap = { fullName: 'name', mobile: 'phone', confirmPassword: 'confirm' };
        for (const [fld, msg] of Object.entries(srvErrors)) {
          const formField = fieldMap[fld] || fld;
          if (formField in form) mapped[formField] = Array.isArray(msg) ? msg[0] : msg;
        }
        if (Object.keys(mapped).length) setErrors(mapped);
      }
    }
  };

  function inputClass(field) {
    return `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
        : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
    }`;
  }

  const valid = isFormValid(form.name, form.phone, form.email, form.password, form.confirm);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{serverError}</div>
      )}
      {!serverError && error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
        <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter your full name" className={inputClass('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
        <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Enter your phone number" className={inputClass('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
        <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email" className={inputClass('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <PasswordInput label="Password" value={form.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Create password" error={errors.password}
        />
        <PasswordInput label="Confirm Password" value={form.confirm}
          onChange={(e) => handleChange('confirm', e.target.value)}
          placeholder="Confirm password" error={errors.confirm}
        />
      </div>
      <button type="submit" disabled={!valid || loading}
        className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-brand-blue hover:underline font-medium">Login</button>
      </p>
    </form>
  );
}

function ForgotPasswordForm({ onBack, onNext }) {
  const { forgotPassword, loading, error, clearError, setForgotEmail } = useAuth();
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
      const result = await forgotPassword(email).unwrap();
      setForgotEmail(email);
      if (result?.otp) {
        Swal.fire({
          icon: 'info', title: 'Dev Mode OTP',
          text: `Your OTP is: ${result.otp}`,
          timer: 8000, showConfirmButton: true, confirmButtonText: 'Got it',
        });
      }
      onNext();
    } catch {}
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
        <input type="email" value={email} onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter your email"
          className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
            emailError
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
              : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
          }`}
        />
        {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
      </div>
      <button type="submit" onClick={handleSubmit} disabled={loading || !email}
        className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50"
      >
        {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
        {loading ? 'Sending...' : 'Send Verification Code'}
      </button>
      <div className="text-center text-sm text-gray-500">
        Remember your password?{' '}
        <button type="button" onClick={onBack} className="text-brand-blue hover:underline font-medium">Back to Login</button>
      </div>
    </div>
  );
}

function VerifyOtpForm({ onBack, onNext }) {
  const { verifyOtp, resendOtp, loading, error, clearError, forgotEmail } = useAuth();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpError, setOtpError] = useState('');
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

  const resetCooldown = useCallback(() => {
    setTimer(300);
    setCanResend(false);
  }, []);

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

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = pasted.length < 6 ? pasted.length : 5;
    inputsRef.current[nextIndex]?.focus();
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

  const handleResend = async () => {
    try {
      const result = await resendOtp(forgotEmail).unwrap();
      resetCooldown();
      if (result?.otp) {
        Swal.fire({
          icon: 'info', title: 'Dev Mode OTP',
          text: `Your new OTP is: ${result.otp}`,
          timer: 8000, showConfirmButton: true, confirmButtonText: 'Got it',
        });
      }
    } catch {}
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      <p className="text-sm text-gray-500 text-center">
        Enter the 6-digit code sent to <strong className="text-brand-charcoal">{forgotEmail}</strong>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Verification Code</label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => (inputsRef.current[i] = el)}
                type="text" inputMode="numeric" autoComplete="one-time-code"
                maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`h-12 w-10 rounded-xl border text-center text-lg font-bold outline-none transition-all ${
                  otpError
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                    : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
                }`}
              />
            ))}
          </div>
          {otpError && <p className="mt-2 text-xs text-red-500 text-center">{otpError}</p>}
        </div>

        <button type="submit" disabled={loading || otp.join('').length !== 6}
          className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50"
        >
          {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">
            Code expires in <span className="font-mono font-semibold text-brand-charcoal">{formatTime(timer)}</span>
          </p>
          {canResend ? (
            <button type="button" onClick={handleResend} disabled={loading}
              className="text-sm text-brand-blue hover:underline font-medium"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-sm text-gray-400">Resend in {formatTime(timer)}</p>
          )}
        </div>
      </form>
      <div className="text-center text-sm text-gray-500">
        <button type="button" onClick={onBack} className="text-brand-blue hover:underline font-medium">Use a different email</button>
      </div>
    </div>
  );
}

function SetPasswordForm({ onBack, onSuccess }) {
  const { resetPasswordWithOtp, loading, error, clearError, forgotEmail, verifyToken } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!password) e.password = 'Password is required';
    else if (!RULES.every((r) => r.test(password))) e.password = 'Does not meet all requirements';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  function handleChange(field, value) {
    if (field === 'password') setPassword(value);
    if (field === 'confirm') setConfirm(value);
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
      await resetPasswordWithOtp({ email: forgotEmail, verifyToken, password }).unwrap();
      onSuccess();
    } catch {}
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput label="New Password" value={password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Enter new password" error={errors.password}
        />

        {password && (
          <div className="space-y-1.5 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            {RULES.map((rule) => {
              const passed = rule.test(password);
              return (
                <div key={rule.key} className="flex items-center gap-2 text-xs">
                  <i className={`fa-solid ${passed ? 'fa-check-circle text-green-500' : 'fa-circle text-gray-300'} text-[10px]`} />
                  <span className={passed ? 'text-green-600' : 'text-gray-400'}>{rule.label}</span>
                </div>
              );
            })}
          </div>
        )}

        <PasswordInput label="Confirm Password" value={confirm}
          onChange={(e) => handleChange('confirm', e.target.value)}
          placeholder="Confirm new password" error={errors.confirm}
        />

        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50"
        >
          {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
          {loading ? 'Saving...' : 'Save New Password'}
        </button>
      </form>
      <div className="text-center text-sm text-gray-500">
        <button type="button" onClick={onBack} className="text-brand-blue hover:underline font-medium">Back to OTP</button>
      </div>
    </div>
  );
}

function ResetSuccessView({ onClose }) {
  return (
    <div className="text-center py-2 space-y-4">
      <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
        <i className="fa-solid fa-check text-3xl text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-brand-charcoal">Password Updated Successfully</h3>
        <p className="text-sm text-gray-500 mt-1">Your password has been changed. You can now log in with your new password.</p>
      </div>
      <button type="button" onClick={onClose}
        className="w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors"
      >
        Go to Login
      </button>
    </div>
  );
}

const MODE_TITLES = {
  login: { title: 'Welcome Back', subtitle: 'Login to your account to continue' },
  register: { title: 'Create Account', subtitle: 'Join OneVishwam to start posting' },
  forgot: { title: 'Forgot Your Password?', subtitle: "Enter your email and we'll send you a verification code" },
  'verify-otp': { title: 'Verify Your Email', subtitle: 'Enter the 6-digit verification code' },
  'reset-password': { title: 'Create a New Password', subtitle: 'Choose a strong password' },
  'reset-success': { title: 'All Done!', subtitle: '' },
};

function AuthModals() {
  const { showAuthModal, closeAuthModal, authModalMode, switchAuthMode, setVerifyToken } = useAuth();

  if (!showAuthModal) return null;

  const mode = MODE_TITLES[authModalMode];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAuthModal} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-brand-charcoal">{mode.title}</h2>
            {mode.subtitle && <p className="text-sm text-gray-500 mt-0.5">{mode.subtitle}</p>}
          </div>
          <button onClick={closeAuthModal}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-4">
          {authModalMode === 'login' ? (
            <LoginForm onSwitch={() => switchAuthMode('register')} onClose={closeAuthModal} />
          ) : authModalMode === 'register' ? (
            <RegisterForm onSwitch={() => switchAuthMode('login')} onClose={closeAuthModal} />
          ) : authModalMode === 'forgot' ? (
            <ForgotPasswordForm
              onBack={() => switchAuthMode('login')}
              onNext={() => switchAuthMode('verify-otp')}
            />
          ) : authModalMode === 'verify-otp' ? (
            <VerifyOtpForm
              onBack={() => switchAuthMode('forgot')}
              onNext={(vt) => { setVerifyToken(vt); switchAuthMode('reset-password'); }}
            />
          ) : authModalMode === 'reset-password' ? (
            <SetPasswordForm
              onBack={() => switchAuthMode('verify-otp')}
              onSuccess={() => switchAuthMode('reset-success')}
            />
          ) : authModalMode === 'reset-success' ? (
            <ResetSuccessView onClose={closeAuthModal} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AuthModals;