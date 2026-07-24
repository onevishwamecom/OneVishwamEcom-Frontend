import {
  aboutStats,
  aboutTeam,
  expansionRoadmap,
  implementationPhases,
  revenueModel,
} from '../../data/aboutContent';
import PageHero from '../../components/PageHero';
import SectionHeader from '../../components/SectionHeader';
import logoIcon from '../../assets/Logo_icon.png';

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <PageHero
        eyebrow="About Us"
        title="Driving Enterprise Excellence Across Verticals."
        subtitle="OneVishwam is building a comprehensive ecosystem across financial services, real estate, marketplace, and enterprise solutions."
        logo={logoIcon}
        ctas={[
          { label: 'Partner With Us', href: '/contact-us/', primary: true, icon: 'fa-solid fa-arrow-right' },
          { label: 'Explore Services', href: '/our-services/', primary: false },
        ]}
      />

      {/* Stats */}
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {aboutStats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl border border-gray-100 px-5 py-5 text-center"
              >
                <p className="text-2xl font-bold text-brand-blue">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Implementation Plan"
            title="Phase-wise ecosystem rollout"
            className="max-w-2xl"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {implementationPhases.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <i className={`${p.icon} text-2xl text-brand-blue`} />
                <h3 className="mt-4 font-bold text-brand-charcoal text-sm">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="3-Year Vision"
            title="Business Expansion Roadmap"
            className="max-w-2xl"
          />
          <div className="mt-8 overflow-hidden rounded-xl border border-gray-100 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-600">Year</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Coverage</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Customers</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Vendors</th>
                    <th className="px-6 py-4 font-semibold text-gray-600">Franchises</th>
                  </tr>
                </thead>
                <tbody>
                  {expansionRoadmap.map((r, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-brand-charcoal">{r.year}</td>
                      <td className="px-6 py-4 text-gray-600">{r.coverage}</td>
                      <td className="px-6 py-4 text-gray-600">{r.customers}</td>
                      <td className="px-6 py-4 text-gray-600">{r.vendors}</td>
                      <td className="px-6 py-4 text-gray-600">{r.franchises}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Business Strategy"
            title="Diversified Revenue Model"
            className="max-w-2xl"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {revenueModel.map((r) => (
              <div
                key={r.question}
                className="rounded-xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-brand-charcoal">{r.question}</h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{r.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Core Capabilities */}
      <section className="bg-brand-navy text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Core Capabilities"
            title="The infrastructure driving scale"
            dark
            className="max-w-2xl"
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {aboutTeam.map((m) => (
              <div
                key={m.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <i className={`${m.icon} text-2xl text-yellow-400`} />
                <h3 className="mt-4 font-bold text-white">{m.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-yellow-400 text-brand-navy rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-semibold">
              Want to join our franchise network or become a business associate?
            </p>
            <a
              href="/contact-us/"
              className="bg-brand-navy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors whitespace-nowrap"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
