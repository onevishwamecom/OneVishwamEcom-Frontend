import CareersHero from './CareersHero';
import ApplicationForm from './ApplicationForm';

function CareersPage() {
  return (
    <div>
      <CareersHero />
      <section className="py-16 sm:py-20">
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
