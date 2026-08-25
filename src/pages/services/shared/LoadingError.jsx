import React from 'react';

/**
 * Standard Loading Spinner component for services galleries & detail views.
 */
export function LoadingSpinner({ text = 'Loading...', className = 'py-20' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-gray-400 ${className}`}>
      <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-blue" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

/**
 * Standard Error state component with retry action.
 */
export function ErrorState({
  error,
  onRetry,
  title = 'Unable to load content',
  className = 'py-16',
}) {
  const message = typeof error === 'string' ? error : error?.message || 'Something went wrong. Please try again.';

  return (
    <div className={`text-center max-w-md mx-auto px-4 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
        <i className="fa-solid fa-triangle-exclamation text-xl" />
      </div>
      <h3 className="text-base font-bold text-brand-charcoal">{title}</h3>
      <p className="text-xs text-gray-500 mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          <i className="fa-solid fa-rotate-right" />
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Helper wrapper that conditionally renders loading, error or children.
 */
export default function LoadingError({
  loading,
  error,
  onRetry,
  loadingText = 'Loading...',
  children,
}) {
  if (loading) return <LoadingSpinner text={loadingText} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  return <>{children}</>;
}
