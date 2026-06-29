import { footerBrandName } from '../../data/footerContent';

function FooterCopyright() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-10 border-t border-brand-mist/10 pt-5 text-center text-sm text-brand-mist/60 sm:text-left">
      &copy; {currentYear}{' '}
      <a
        href="/"
        className="font-semibold text-brand-mist underline decoration-brand-mist/40 underline-offset-4 transition hover:text-brand-blue hover:decoration-brand-blue"
      >
        {footerBrandName}
      </a>
    </div>
  );
}

export default FooterCopyright;
