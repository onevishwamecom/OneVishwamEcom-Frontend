import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../store/authSlice';
import PasswordInput from '../../components/ui/PasswordInput';

const RULES = [
  { key: 'min', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'One special character', test: (v) => /[!@#$%^&*()_\-+=<>?/{}[\]~|]/.test(v) },
];

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPasswordWithOtp, loading, error, clearError } = useAuth();
  const email = location.state?.email;
  const verifyToken = location.state?.verifyToken;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email || !verifyToken) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, verifyToken, navigate]);

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
      await resetPasswordWithOtp({ email, verifyToken, password }).unwrap();
      navigate('/reset-success', { replace: true });
    } catch {}
  };

  if (!email || !verifyToken) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-charcoal">Create a New Password</h1>
          <p className="text-gray-500 mt-2 text-sm">Choose a strong password for your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
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
          <div className="mt-4 text-center text-sm text-gray-500">
            <Link to="/forgot-password" className="text-brand-blue hover:underline font-medium">Start over</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
