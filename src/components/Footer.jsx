import { footerBrandName, footerSummary, footerQuickLinks, footerServiceLinks, footerSocialLinks, footerLocations } from '../data/footerContent';
import logoName from '../assets/Logo_name.png';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="h-1 bg-gradient-to-r from-brand-blue via-yellow-400 to-brand-blue" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <img src={logoName} alt={footerBrandName} className="h-10 w-auto object-contain" />
            <p className="text-xs sm:text-sm leading-6 text-gray-400">{footerSummary}</p>
            <div className="flex gap-3 pt-1">
              {footerSocialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-lg border border-gray-600 text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors flex items-center justify-center text-xs"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerQuickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors leading-relaxed block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 text-white">Services</h4>
            <ul className="space-y-3">
              {footerServiceLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors leading-relaxed block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-4 text-white">Contact Info</h4>
            <ul className="space-y-3.5">
              {footerLocations.slice(0, 3).map((loc) => (
                <li key={loc.value} className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  <span className="text-gray-300 font-medium">{loc.label}:</span> {loc.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700/80 text-center text-xs text-gray-400">
          &copy; {year} {footerBrandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
