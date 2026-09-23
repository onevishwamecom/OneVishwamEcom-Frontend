/**
 * Reusable FloatingActionButton (FAB) component for bottom-right sticky triggers.
 *
 * @param {Object} props
 * @param {string} props.icon - FontAwesome icon class
 * @param {React.ReactNode} props.label - Button label text or node
 * @param {() => void} props.onClick - Click handler
 * @param {string} [props.className] - Custom button CSS classes
 */
function FloatingActionButton({
  icon = 'fa-bolt',
  label = 'Quick Action',
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 ${className}`}
    >
      {icon && <i className={`fa-solid ${icon}`} />}
      <span>{label}</span>
    </button>
  );
}

export default FloatingActionButton;

