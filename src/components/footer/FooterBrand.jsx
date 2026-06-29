import { footerBrandName, footerSummary, footerSocialLinks } from '../../data/footerContent';

function FooterBrand() {
  return (
    <section className="space-y-5">
      <p className="text-[11px] font-black uppercase tracking-[0.35em] text-brand-mist/60">
        {footerBrandName}
      </p>
      <h2 className="max-w-xl font-display text-3xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-4xl">
        Simple support for every service.
      </h2>
      <p className="max-w-xl text-sm leading-7 text-brand-mist/75 sm:text-base sm:leading-8">
        {footerSummary}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {footerSocialLinks.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-label={item.label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-mist/15 text-lg text-brand-mist transition hover:border-brand-blue hover:bg-brand-blue"
          >
            <i className={item.icon} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default FooterBrand;
