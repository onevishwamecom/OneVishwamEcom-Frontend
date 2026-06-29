import ContactHero from './ContactHero';
import ContactSidebar from './ContactSidebar';
import EnquiryForm from './EnquiryForm';

function ContactPage({ location }) {
  const params = new URLSearchParams(location?.search || '');
  const loanContext = params.get('type') === 'property'
    ? { type: 'property', id: params.get('id'), title: params.get('title'), price: params.get('price') }
    : null;

  return (
    <div>
      <ContactHero />
      {loanContext && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-3">
            <i className="fa-solid fa-circle-check text-emerald-600 text-lg" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Loan enquiry for {loanContext.title}</p>
              <p className="text-xs text-emerald-600">Price: {loanContext.price} · Ref: #{loanContext.id}</p>
            </div>
          </div>
        </div>
      )}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <EnquiryForm loanContext={loanContext} />
            <ContactSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
