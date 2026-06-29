import { footerQuickLinks, footerLegalLinks } from '../../data/footerContent';

function FooterLinks() {
  return (
    <>
      <section>
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-brand-mist/60">
          Quick Links
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {footerQuickLinks.map((link) => (
            <li key={link.label} className="list-none">
              <a
                href={link.href}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-brand-mist/75 transition hover:text-brand-mist"
              >
                <span className="h-px w-4 bg-brand-mist/30" aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="lg:col-span-2">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-brand-mist/60">
          Legal Pages
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {footerLegalLinks.map((link) => (
            <li key={link.label} className="list-none">
              <a
                href={link.href}
                className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.05em] text-brand-mist/60 transition hover:text-brand-mist"
              >
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default FooterLinks;
