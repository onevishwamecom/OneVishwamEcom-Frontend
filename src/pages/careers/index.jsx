import CareersHero from './CareersHero';
import CareersSidebar from './CareersSidebar';
import ApplicationForm from './ApplicationForm';

function CareersPage() {
  return (
    <div className="pt-16 lg:pt-14 bg-white min-h-screen">
      <CareersHero />
      <section className="py-10 sm:py-14 bg-brand-gray/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-start">
            {/* Left Column: Hiring Info & Value Propositions (5 cols) */}
            <div className="lg:col-span-5">
              <CareersSidebar />
            </div>

            {/* Right Column: Application Form (7 cols) */}
            <div className="lg:col-span-7">
              <ApplicationForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
