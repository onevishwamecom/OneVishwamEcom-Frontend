function Spinner({ className = 'h-4 w-4' }) {
  return (
    <i className={`fa-solid fa-circle-notch fa-spin ${className}`} />
  );
}

export default Spinner;
