import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';
import PasswordInput from '../../components/ui/PasswordInput';

function ProfileSettings() {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, deleteAccount, logout, loading, error, clearError } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileErrors, setProfileErrors] = useState({});
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showDelete, setShowDelete] = useState(false);

  function validateProfile() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    else if (name.trim().length < 2) e.name = 'At least 2 characters';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{10,15}$/.test(phone)) e.phone = 'Invalid phone number';
    return e;
  }

  function validatePassword() {
    const e = {};
    if (!passwords.current) e.current = 'Current password is required';
    if (!passwords.newPass) e.newPass = 'New password is required';
    else if (passwords.newPass.length < 6) e.newPass = 'At least 6 characters';
    if (!passwords.confirm) e.confirm = 'Please confirm';
    else if (passwords.newPass !== passwords.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  function handleProfileField(field, value, setter) {
    setter(value);
    clearError();
    if (profileErrors[field]) {
      const next = { ...profileErrors };
      delete next[field];
      setProfileErrors(next);
    }
  }

  function handlePasswordField(field, value) {
    setPasswords({ ...passwords, [field]: value });
    clearError();
    if (passwordErrors[field]) {
      const next = { ...passwordErrors };
      delete next[field];
      setPasswordErrors(next);
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const v = validateProfile();
    setProfileErrors(v);
    if (Object.keys(v).length) return;
    try {
      await updateProfile({ name, phone }).unwrap();
      Swal.fire({ icon: 'success', title: 'Profile updated!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
    } catch {}
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const v = validatePassword();
    setPasswordErrors(v);
    if (Object.keys(v).length) return;
    try {
      await changePassword({ currentPassword: passwords.current, newPassword: passwords.newPass }).unwrap();
      setPasswords({ current: '', newPass: '', confirm: '' });
      Swal.fire({ icon: 'success', title: 'Password changed!', timer: 1500, showConfirmButton: false, toast: true, position: 'top-end' });
    } catch {}
  };

  const handleDelete = () => {
    deleteAccount().then((res) => {
      if (!res.error) {
        logout();
        navigate('/');
      }
    });
  };

  function inputClass(field, errObj) {
    return `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
      errObj[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
        : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
    }`;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please login to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-charcoal mb-2">Account Settings</h1>
      <p className="text-gray-500 text-sm mb-8">Manage your profile, password, and account</p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Profile */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-brand-charcoal mb-4">Profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input type="text" value={name} onChange={(e) => handleProfileField('name', e.target.value, setName)}
              className={inputClass('name', profileErrors)}
            />
            {profileErrors.name && <p className="mt-1 text-xs text-red-500">{profileErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input type="tel" value={phone} onChange={(e) => handleProfileField('phone', e.target.value, setPhone)}
              className={inputClass('phone', profileErrors)}
            />
            {profileErrors.phone && <p className="mt-1 text-xs text-red-500">{profileErrors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" value={user.email} disabled
              className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <button type="submit" disabled={loading}
            className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50"
          >
            {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Password */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-brand-charcoal mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <PasswordInput label="Current Password" value={passwords.current}
            onChange={(e) => handlePasswordField('current', e.target.value)}
            placeholder="Enter current password" error={passwordErrors.current}
          />
          <div className="grid grid-cols-2 gap-3">
            <PasswordInput label="New Password" value={passwords.newPass}
              onChange={(e) => handlePasswordField('newPass', e.target.value)}
              placeholder="Enter new password" error={passwordErrors.newPass}
            />
            <PasswordInput label="Confirm" value={passwords.confirm}
              onChange={(e) => handlePasswordField('confirm', e.target.value)}
              placeholder="Confirm new password" error={passwordErrors.confirm}
            />
          </div>
          <button type="submit" disabled={loading}
            className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-navy transition-colors disabled:opacity-50"
          >
            {loading && <i className="fa-solid fa-circle-notch fa-spin mr-2" />}
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      {/* Delete Account */}
      <section className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <h2 className="text-lg font-bold text-red-600 mb-2">Delete Account</h2>
        <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data. This action cannot be undone.</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="rounded-xl bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 text-sm font-bold hover:bg-red-100 transition-colors"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-600">Are you sure? This is permanent.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={loading}
                className="rounded-xl bg-red-600 text-white px-6 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button onClick={() => setShowDelete(false)}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfileSettings;
