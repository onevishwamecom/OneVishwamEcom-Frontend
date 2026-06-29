/**
 * SectionHeader
 * Renders the repeated eyebrow label + h2 + optional subtitle pattern.
 *
 * Props:
 *   eyebrow   – small uppercase tracking label above the heading
 *   title     – main heading text (h2)
 *   subtitle  – optional paragraph below the heading
 *   align     – 'left' (default) | 'center'
 *   dark      – true when rendered on a dark background (text colours invert)
 *   className – extra classes on the wrapper div
 */
export default function SectionHeader({ eyebrow, title, subtitle, align = 'left', dark = false, className = '' }) {
  const textAlign = align === 'center' ? 'text-center' : '';
  const eyebrowColor = dark ? 'text-yellow-400' : 'text-brand-blue';
  const titleColor   = dark ? 'text-white'       : 'text-brand-charcoal';
  const subtitleColor= dark ? 'text-white/70'    : 'text-gray-500';

  return (
    <div className={`${textAlign} ${className}`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-widest ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${titleColor}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className={`mt-3 leading-relaxed ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
