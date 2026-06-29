function Field({ label, placeholder, type = 'text', name, value, onChange, error }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</span>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-brand-blue ${
          error ? 'border-red-300 text-red-600' : 'border-gray-200 bg-white text-brand-charcoal'
        }`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

export default Field;
