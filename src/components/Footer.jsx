import {
  footerBrandName,
  footerSummary,
  footerQuickLinks,
  footerServiceLinks,
  footerSocialLinks,
  footerLocations,
} from '../data/footerContent';
import logoName from '../assets/Logo_name.png';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      {/* Brand Accent Top Line */}
      <div className="h-1 bg-gradient-to-r from-brand-blue via-yellow-400 to-brand-blue" />

      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        {/* Main Footer 4-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          {/* 1. Brand Info Column (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <img
              src={logoName}
              alt={footerBrandName}
              className="h-10 w-auto object-contain brightness-105"
            />
            <p className="text-xs sm:text-sm leading-relaxed text-gray-400">
              {footerSummary}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {footerSocialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:border-yellow-400 hover:text-yellow-400 hover:bg-white/10 transition-all flex items-center justify-center text-sm shadow-xs"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Company Column (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerQuickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 hover:translate-x-0.5 transition-all leading-relaxed inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Services Column (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Services
            </h4>
            <ul className="space-y-2.5">
              {footerServiceLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 hover:translate-x-0.5 transition-all leading-relaxed inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Info Column (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-400 leading-relaxed">
              {footerLocations.map((loc) => (
                <li key={loc.label} className="leading-relaxed">
                  <span className="text-gray-300 font-semibold mr-1.5">{loc.label}:</span>
                  {loc.label === 'Email' ? (
                    <a
                      href={`mailto:${loc.value}`}
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {loc.value}
                    </a>
                  ) : loc.label === 'Phone' ? (
                    <a
                      href={`tel:${loc.value.replace(/\s+/g, '')}`}
                      className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                      {loc.value}
                    </a>
                  ) : (
                    <span className="text-gray-400">{loc.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center space-y-3">
          <p className="text-[11px] sm:text-xs text-gray-400/90 max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-gray-300">Disclaimer:</span> Website materials are
            provided for general information and are subject to change without notice, with renders
            and plans serving as artistic concepts rather than official sales offers. Sharing
            contact information constitutes agreement for the team to contact users by call or text,
            superseding the DND registry.
          </p>
          <p className="text-xs text-gray-500">
            &copy; {year} {footerBrandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
