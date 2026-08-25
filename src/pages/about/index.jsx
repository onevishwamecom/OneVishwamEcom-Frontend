import PageHero from '../../components/PageHero';
import SectionHeader from '../../components/SectionHeader';
import logoIcon from '../../assets/Logo_icon.png';

function AboutPage() {
  return (
    <div className='pt-16 lg:pt-14'>
      {/* Hero */}
      <PageHero
        eyebrow="About Us"
        title="One Vishwam — A FinVerse for Everyday Life"
        subtitle="One Stop Solution for finance and products to build your life. Lower prices, direct from manufacturers, backed by co-operative finance."
        logo={logoIcon}
        ctas={[
          { label: 'Visit OneVishwam.com', href: 'https://onevishwam.com/', primary: true, icon: 'fa-solid fa-arrow-up-right-from-square', external: true },
          { label: 'Contact Us', href: '/contact-us/', primary: false },
        ]}
      />

      {/* CEO Message */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Message from the CEO"
            title="Building a Complete Ecosystem for Capital & Commodity"
            className="max-w-3xl"
          />
          <div className="mt-8 max-w-3xl space-y-6 text-gray-700 leading-relaxed">
            <p>
              One Vishwam is a <strong>FinVerse</strong> (finance + ecosystem for all digital needs), that addresses capital investments in useful, daily commodities required in day-to-day life. We offer a <strong>One Stop Solution</strong> for all those who are in need of a complete ecosystem to build their life, by providing them both finance and products to invest in.
            </p>
            <p>
              We offer products at a price lower than any other market, directly from the manufacturer.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Unique */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="What Makes Us Unique"
            title="Finance, Value, and Transparency Combined"
            className="max-w-3xl"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <i className="fa-solid fa-landmark fa-2xl text-brand-blue" />
              <h3 className="mt-4 font-bold text-brand-charcoal">Co-operative Finance</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                We club with Co-operative societies for finance, hence loan provision on property or any other commodity happens at a lesser interest rate.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <i className="fa-solid fa-chart-line fa-2xl text-brand-blue" />
              <h3 className="mt-4 font-bold text-brand-charcoal">Value-Driven Investments</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                We help people cautiously invest their money in commodities that will gain value over the years, helping them make the right choice.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <i className="fa-solid fa-users fa-2xl text-brand-blue" />
              <h3 className="mt-4 font-bold text-brand-charcoal">Customer-First</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                We value our customers by making sure any intermediate parties are eliminated.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <i className="fa-solid fa-factory fa-2xl text-brand-blue" />
              <h3 className="mt-4 font-bold text-brand-charcoal">Direct from Manufacturer</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                We buy directly from manufacturers, sell products at a lesser price than any other marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* One Vishwam Buy & Sell */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Our Core Platforms"
            title="One Vishwam Buy · One Vishwam Sell"
            className="max-w-3xl"
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="bg-brand-blue text-white rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <i className="fa-solid fa-hand-holding-dollar text-brand-navy text-xl" />
                </div>
                <h3 className="text-2xl font-bold">One Vishwam Buy</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                Facilitates provision of money as a commodity, helping vendors, manufacturers and other parties sell their commodities at a better price, establishing relationships for further projects.
              </p>
            </div>
            <div className="bg-brand-navy text-white rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <i className="fa-solid fa-tag text-brand-navy text-xl" />
                </div>
                <h3 className="text-2xl font-bold">One Vishwam Sell</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                Facilitates selling products on a digital platform, helping customers buy commodities of their choice, also provides financial support like home loan, vehicle loan, monthly EMI etc. — hence buying a big-budget commodity also feels easy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Year Vision */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="5-Year Vision"
            title="Where We See Ourselves"
            className="max-w-3xl"
          />
          <div className="mt-8 max-w-3xl space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Property Ecosystem:</strong> Establishing a Website to buy properties from, and provide listings for available properties.
            </p>
            <p>
              <strong>Bengaluru Connectivity:</strong> Secure a connection throughout Bengaluru for major commodities like Properties, Automobile, Jewellery and Electronics.
            </p>
            <p>
              <strong>Vendor Relations:</strong> Maintain good relations with vendors and manufacturers for consistent product listings, and ensure timely financial funding.
            </p>
            <p>
              <strong>Karnataka Expansion:</strong> Build connections across the State of Karnataka and initiate a mass recruitment drive for needy and unemployed.
            </p>
          </div>
        </div>
      </section>

      {/* Website Handles */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Platform Scope"
            title="Our Website Handles"
            className="max-w-3xl"
          />
          <div className="mt-8 max-w-3xl space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-gray-700 leading-relaxed">
                One Vishwam facilitates property, jewellery, automobile, electronics and other commodity listings, where consumers can visit the Webpage/App and view at their leisure.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://onevishwam.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-navy transition-colors"
              >
                <i className="fa-solid fa-globe" /> Visit onevishwam.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;