import { footerBrandName, footerSummary, footerQuickLinks, footerServiceLinks, footerSocialLinks, footerLocations } from '../data/footerContent';
import logoName from '../assets/Logo_name.png';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white">
      <div className="h-1 bg-gradient-to-r from-brand-blue via-yellow-400 to-brand-blue" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <img src={logoName} alt={footerBrandName} className="h-10 w-auto object-contain" />
            <p className="text-sm leading-6 text-gray-400">{footerSummary}</p>
            <div className="flex gap-3">
              {footerSocialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-lg border border-gray-600 text-gray-400 hover:border-yellow-400 hover:text-yellow-400 transition-colors flex items-center justify-center"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerQuickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {footerServiceLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              {footerLocations.slice(0, 3).map((loc) => (
                <li key={loc.value} className="text-sm text-gray-400">
                  <span className="text-gray-300 font-medium">{loc.label}:</span> {loc.value}
                </li>
              ))}
              <li className="pt-2">
                <a href="tel:+918546996622" className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-semibold">
                  <i className="fa-solid fa-phone mr-1.5" />+91 85469 96622
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {year} {footerBrandName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
