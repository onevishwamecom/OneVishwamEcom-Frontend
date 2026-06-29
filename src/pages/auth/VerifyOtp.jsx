import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../store/authSlice';

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, loading, error, clearError } = useAuth();
  const email = location.state?.email;

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
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

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
      const result = await verifyOtp({ email, otp: code }).unwrap();
      navigate('/reset-password', { state: { email, verifyToken: result.verifyToken } });
    } catch {}
  };

  const handleResend = async () => {
    try {
      await resendOtp(email).unwrap();
      resetCooldown();
    } catch {}
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-charcoal">Verify Your Email</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Enter the 6-digit verification code sent to <strong className="text-brand-charcoal">{email}</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                    } ${i === 0 ? '' : ''}`}
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
                Verification code expires in <span className="font-mono font-semibold text-brand-charcoal">{formatTime(timer)}</span>
              </p>
              {canResend ? (
                <button type="button" onClick={handleResend} disabled={loading}
                  className="text-sm text-brand-blue hover:underline font-medium"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-sm text-gray-400">Resend code in {formatTime(timer)}</p>
              )}
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <Link to="/forgot-password" className="text-brand-blue hover:underline font-medium">Use a different email</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
