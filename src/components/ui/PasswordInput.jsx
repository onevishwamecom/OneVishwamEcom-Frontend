import { useState } from 'react';

function PasswordInput({ value, onChange, placeholder, label, className = '', error }) {
  const [show, setShow] = useState(false);

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none transition-all ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
              : 'border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10'
          }`}
        />
        <button type="button" onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className={`fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default PasswordInput;
