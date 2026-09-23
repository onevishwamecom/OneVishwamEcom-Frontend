/**
 * Reusable PageContainer component providing standard top/bottom padding
 * and centered max-width layout for page views across the site.
 */
function PageContainer({
  children,
  className = 'pb-24 pt-4 sm:pt-6 relative',
  innerClassName = 'mx-auto max-w-7xl px-4 sm:px-6',
}) {
  return (
    <div className={className}>
      <div className={innerClassName}>
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
