/**
 * Reusable PageHeader component for category, listing, and service gallery pages.
 * Renders standard eyebrow badge, title (h1), subtitle, and optional right-aligned actions/CTAs.
 */
function PageHeader({ eyebrow, title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue mb-1">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="text-2xl font-bold tracking-tight text-brand-charcoal sm:text-3xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

export default PageHeader;
