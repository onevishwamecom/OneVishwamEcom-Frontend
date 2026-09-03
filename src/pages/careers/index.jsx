import CareersHero from './CareersHero';
import ApplicationForm from './ApplicationForm';

function CareersPage() {
  return (
    <div className="pt-16 lg:pt-14">
      <CareersHero />
      <section className="mt-6 sm:mt-10 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}

export default CareersPage;
