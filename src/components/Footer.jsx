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
      {/* Top Accent Gradient Bar */}
      <div className="h-1 bg-gradient-to-r from-brand-blue via-amber-400 to-brand-blue" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-6 sm:pb-8">
        {/* Main 12-Column Balanced Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12">
          {/* Column 1: Brand Info (4 / 12 cols = 33.3%) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img src={logoName} alt={footerBrandName} className="h-9 sm:h-10 w-auto object-contain" />
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-sm">
              {footerSummary}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {footerSocialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-lg border border-slate-700/80 bg-slate-800/30 text-slate-400 hover:border-amber-400 hover:text-amber-400 hover:bg-slate-800 transition-all flex items-center justify-center text-xs"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Center Navigation Zone (4 / 12 cols = 33.3% total: Company 2 cols + Services 2 cols) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Company Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-white">
                Company
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerQuickLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors leading-relaxed block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-white">
                Services
              </h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {footerServiceLinks.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors leading-relaxed block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Contact Info (4 / 12 cols = 33.3%) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 text-white">
              Contact Info
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {footerLocations.map((loc) => (
                <li key={loc.label} className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <span className="text-slate-200 font-semibold">{loc.label}:</span>{' '}
                  {loc.label === 'Email' ? (
                    <a href={`mailto:${loc.value}`} className="hover:text-amber-400 transition-colors">
                      {loc.value}
                    </a>
                  ) : loc.label === 'Phone' ? (
                    <a href={`tel:${loc.value}`} className="hover:text-amber-400 transition-colors">
                      {loc.value}
                    </a>
                  ) : (
                    <span>{loc.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-8 pt-6 sm:mt-10 sm:pt-8 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-[11px] sm:text-xs text-slate-400 max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-slate-300">Disclaimer:</span> Website materials are provided for general information and are subject to change without notice, with renders and plans serving as artistic concepts rather than official sales offers. Sharing contact information constitutes agreement for the team to contact users by call or text, superseding the DND registry.
          </p>
          <p className="text-xs text-slate-500">
            &copy; {year} {footerBrandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
