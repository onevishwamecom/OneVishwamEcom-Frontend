import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

// ── Carousel Slides (Mirrors OneVishwam multi-sector ecosystem) ─────────────
const WELCOME_SLIDES = [
  {
    id: 'properties',
    category: 'Real Estate & Living',
    tag: "Karnataka's #1 Capital & Commodity Platform",
    badgeIcon: 'fa-solid fa-house-chimney',
    title: (
      <>
        Welcome to{' '}
        <span className="text-[#90dafc] font-black drop-shadow-[0_2px_8px_rgba(144,218,252,0.4)]">
          OneVishwam
        </span>
      </>
    ),
    subtitle:
      'One Stop Solution for finance and products to build your life. Lower prices, direct from manufacturers, backed by co-operative finance. Verified properties, smart mobility, and community-powered credit.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    highlightBadge: '10,000+ Verified Listings in Bengaluru',
  },
  {
    id: 'automobiles',
    category: 'Smart Mobility',
    tag: 'Direct Sourcing · Zero Brokerage',
    badgeIcon: 'fa-solid fa-car',
    title: (
      <>
        Certified Mobility,{' '}
        <span className="text-[#90dafc] font-black drop-shadow-[0_2px_8px_rgba(144,218,252,0.4)]">
          Factory Prices
        </span>
      </>
    ),
    subtitle:
      'Pre-inspected family cars, two-wheelers & commercial transports with 200+ point checks, verified history logs, and instant financing schemes.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80',
    highlightBadge: '200-Pt Inspection Certified Vehicles',
  },
  {
    id: 'finance',
    category: 'Co-Operative Finance',
    tag: 'Community Credit & Transparent EMI',
    badgeIcon: 'fa-solid fa-landmark',
    title: (
      <>
        Ethical Finance for{' '}
        <span className="text-[#90dafc] font-black drop-shadow-[0_2px_8px_rgba(144,218,252,0.4)]">
          Every Family
        </span>
      </>
    ),
    subtitle:
      'We collaborate directly with registered Co-operative societies for transparent, low-interest micro-finance, making prime property and commodity purchases affordable.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80',
    highlightBadge: 'Regulated Karnataka Co-op Credit Partners',
  },
  {
    id: 'lifestyle',
    category: 'Appliances & Comfort',
    tag: 'Direct Manufacturer Procurement',
    badgeIcon: 'fa-solid fa-tv',
    title: (
      <>
        Factory-Direct{' '}
        <span className="text-[#90dafc] font-black drop-shadow-[0_2px_8px_rgba(144,218,252,0.4)]">
          Comfort &amp; Tech
        </span>
      </>
    ),
    subtitle:
      'High-performance 5-star home appliances, smart electronics, and doctor-approved orthopedic mattresses at prices substantially lower than conventional marketplaces.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=80',
    highlightBadge: 'Direct From Manufacturer · Authentic Warranty',
  },
];

// ── Data (mirrored from About page so About page stays untouched) ──────────────
const CORE_PILLARS = [
  {
    icon: 'fa-solid fa-landmark',
    title: 'Co-Operative Finance',
    badge: 'Regulated Credit',
    badgeIcon: 'fa-solid fa-shield-halved',
    desc: 'We collaborate directly with reputed Co-operative societies for transparent, low-interest micro-finance, ensuring loans on properties and commodities remain easily accessible and affordable.',
    highlights: [
      { icon: 'fa-solid fa-percent', text: 'Low-interest micro-credit' },
      { icon: 'fa-solid fa-calendar-check', text: 'Transparent EMI tenure' },
    ],
  },
  {
    icon: 'fa-solid fa-chart-line',
    title: 'Value-Driven Investments',
    badge: 'Appreciating Assets',
    badgeIcon: 'fa-solid fa-arrow-trend-up',
    desc: 'We assist individuals and families in cautiously investing their capital into high-growth, appreciating commodities and prime properties that generate lasting wealth over the years.',
    highlights: [
      { icon: 'fa-solid fa-file-shield', text: '100% Clear title deeds' },
      { icon: 'fa-solid fa-chart-pie', text: 'Long-term equity growth' },
    ],
  },
  {
    icon: 'fa-solid fa-users',
    title: 'Customer-First Approach',
    badge: 'Zero Commission',
    badgeIcon: 'fa-solid fa-handshake-slash',
    desc: 'By eliminating unauthorized intermediary parties and hidden brokerage fees, we protect consumer savings and provide a straightforward, honest transaction experience.',
    highlights: [
      { icon: 'fa-solid fa-ban', text: '0% Brokerage & middleman' },
      { icon: 'fa-solid fa-user-check', text: 'Direct buyer-to-owner connect' },
    ],
  },
  {
    icon: 'fa-solid fa-industry',
    title: 'Direct From Manufacturer',
    badge: 'OEM Direct',
    badgeIcon: 'fa-solid fa-boxes-packing',
    desc: 'We procure directly from original equipment manufacturers and prime developers, delivering premium products at prices substantially lower than conventional open marketplaces.',
    highlights: [
      { icon: 'fa-solid fa-tags', text: 'Substantially lower pricing' },
      { icon: 'fa-solid fa-certificate', text: 'Authentic brand warranty' },
    ],
  },
];

const ROADMAP_STEPS = [
  {
    step: '01',
    title: 'Property Ecosystem',
    phaseTag: 'Capital Assets',
    phaseColor: 'text-sky-700 bg-sky-50 border-sky-200/80',
    desc: 'Establishing an integrated digital portal to discover, inspect, and purchase prime residential plots, luxury villas, and commercial properties with full legal verification.',
    icon: 'fa-solid fa-house-chimney',
    keyPoints: [
      { icon: 'fa-solid fa-map-location-dot', text: 'RERA & BDA Approved Plots' },
      { icon: 'fa-solid fa-shield-check', text: '30-Year Encumbrance Cleared' },
    ],
  },
  {
    step: '02',
    title: 'Bengaluru Multi-Sector Grid',
    phaseTag: 'Commodity Grid',
    phaseColor: 'text-indigo-700 bg-indigo-50 border-indigo-200/80',
    desc: 'Building a robust, connected distribution network across Bengaluru for high-value essentials spanning Properties, Automobiles, Jewellery & Gold, and Electronics.',
    icon: 'fa-solid fa-city',
    keyPoints: [
      { icon: 'fa-solid fa-car', text: 'Certified 200-Pt Audited Cars' },
      { icon: 'fa-solid fa-gem', text: 'BIS Hallmarked Gold & Jewellery' },
    ],
  },
  {
    step: '03',
    title: 'Vendor & Capital Relations',
    phaseTag: 'Co-op Liquidity',
    phaseColor: 'text-teal-700 bg-teal-50 border-teal-200/80',
    desc: 'Nurturing enduring relationships with verified manufacturers and developers for continuous inventory, backed by seamless, timely co-operative financial funding.',
    icon: 'fa-solid fa-handshake-angle',
    keyPoints: [
      { icon: 'fa-solid fa-building-columns', text: 'Regulated Karnataka Co-ops' },
      { icon: 'fa-solid fa-money-bill-transfer', text: 'Prompt Seller Settlements' },
    ],
  },
  {
    step: '04',
    title: 'Statewide Expansion',
    phaseTag: 'Empowerment',
    phaseColor: 'text-amber-700 bg-amber-50 border-amber-200/80',
    desc: 'Expanding our cooperative marketplace footprint across Karnataka while creating grassroots employment opportunities and socio-economic empowerment.',
    icon: 'fa-solid fa-map-location-dot',
    keyPoints: [
      { icon: 'fa-solid fa-earth-asia', text: 'Pan-Karnataka Service Nodes' },
      { icon: 'fa-solid fa-people-roof', text: 'Empowering Local Communities' },
    ],
  },
];

const PLATFORMS = [
  {
    label: 'OneVishwam Buy',
    sub: 'Capital & Sourcing Platform',
    icon: 'fa-solid fa-bag-shopping',
    badge: '10,000+ Assets',
    statusTag: 'Direct Sourcing',
    color: 'from-sky-500 to-blue-700',
    desc: 'Facilitates the investment of capital into carefully verified assets — properties, vehicles, and high-quality goods — with transparent pricing and zero brokerage, powered by co-operative finance partners.',
    pills: [
      { icon: 'fa-solid fa-handshake-slash', text: 'Zero Brokerage' },
      { icon: 'fa-solid fa-building-columns', text: 'Co-op Finance' },
      { icon: 'fa-solid fa-shield-check', text: 'Verified Assets' },
    ],
    features: [
      { icon: 'fa-solid fa-house-circle-check', title: 'Verified Real Estate', desc: 'RERA legal vetting & encumbrance checks' },
      { icon: 'fa-solid fa-car-side', title: 'Audited Mobility', desc: '200-point inspected cars & 2-wheelers' },
      { icon: 'fa-solid fa-file-invoice-dollar', title: 'Direct Sourcing', desc: '0% broker margin, direct owner price' },
    ],
  },
  {
    label: 'OneVishwam Sell',
    sub: 'Marketplace & EMI Platform',
    icon: 'fa-solid fa-store',
    badge: '500+ Verified Vendors',
    statusTag: 'Instant Finance',
    color: 'from-indigo-500 to-purple-700',
    desc: 'Facilitates selling products on a digital platform, helping customers buy commodities of their choice with integrated financial support like home loans, vehicle loans, and easy monthly EMI schemes.',
    pills: [
      { icon: 'fa-solid fa-calculator', text: 'EMI Support' },
      { icon: 'fa-solid fa-house', text: 'Home Loans' },
      { icon: 'fa-solid fa-car', text: 'Vehicle Loans' },
    ],
    features: [
      { icon: 'fa-solid fa-tv', title: 'Appliances & Tech', desc: 'Factory-direct 5-star consumer electronics' },
      { icon: 'fa-solid fa-bed', title: 'Orthopedic Comfort', desc: 'Direct OEM mattresses & home living' },
      { icon: 'fa-solid fa-percent', title: 'Low-Rate EMI', desc: 'Co-operative loans with minimal interest' },
    ],
  },
];

const TRUST_BADGES = [
  { icon: 'fa-solid fa-shield-halved', label: '100% Verified Listings', ringHover: 'hover:border-emerald-400/60' },
  { icon: 'fa-solid fa-handshake', label: '0% Brokerage Fees', ringHover: 'hover:border-sky-400/60' },
  { icon: 'fa-solid fa-landmark', label: 'Co-op Finance Partners', ringHover: 'hover:border-indigo-400/60' },
  { icon: 'fa-solid fa-certificate', label: 'Karnataka Registered', ringHover: 'hover:border-amber-400/60' },
];

export default function WelcomeGateway({ onEnter }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const totalSlides = WELCOME_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay carousel every 5 seconds, pausing on hover
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
  };

  const activeSlide = WELCOME_SLIDES[currentSlide] || WELCOME_SLIDES[0];

  const handleVisitShop = useCallback(() => {
    try {
      sessionStorage.setItem('vishwam_entered_shop', 'true');
    } catch { }
    if (typeof onEnter === 'function') {
      onEnter();
    }
    navigate('/');
  }, [navigate, onEnter]);

  const handleNavigateTo = useCallback((path) => {
    try {
      sessionStorage.setItem('vishwam_entered_shop', 'true');
    } catch { }
    if (typeof onEnter === 'function') {
      onEnter();
    }
    navigate(path);
  }, [navigate, onEnter]);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#f8fafc] font-sans">

      {/* ── STICKY HEADER ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="OneVishwam" className="h-8 sm:h-9 w-auto object-contain" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
                Karnataka's Trusted Marketplace
              </p>
              <p className="text-[9px] text-slate-500 font-semibold">
                Capital · Commodity · Co-operative Finance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigateTo('/about-us')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-blue transition-colors px-3 py-2 rounded-xl hover:bg-brand-blue/5 cursor-pointer"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => handleNavigateTo('/enquiry/')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-blue transition-colors px-3 py-2 rounded-xl hover:bg-brand-blue/5 cursor-pointer"
            >
              <i className="fa-solid fa-envelope text-xs" /> Contact
            </button>
            <button
              type="button"
              onClick={handleVisitShop}
              className="inline-flex items-center gap-2 bg-action-primary hover:bg-action-primary-hover text-action-primary-text border border-action-primary-border px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-store text-xs" />
              <span>Visit Shop</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO CAROUSEL BANNER (Restored Original Slate & Muted Cool Website Theme) ── */}
      <section
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#9eb3c9] via-[#b0c4d9] to-[#94abc2] text-white min-h-[380px] sm:min-h-[430px] lg:min-h-[460px] flex items-center justify-center select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
        aria-label="Welcome Carousel"
      >
        {/* Background Images Layer with Balanced Slate Overlays & Ambient Lights */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Ambient Soft Glow Lights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[380px] bg-gradient-to-tr from-slate-500/20 via-sky-500/15 to-blue-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl" />
          <div className="absolute -top-10 right-10 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl" />

          {/* Carousel Slides */}
          {WELCOME_SLIDES.map((slide, idx) => {
            const active = idx === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.category}
                  className="w-full h-full object-cover object-center scale-105 transition-transform duration-[4000ms] ease-out opacity-75"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                {/* Balanced Slate Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#8fa5bc]/40 via-[#a1b7cd]/30 to-[#859cb3]/50" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#859cb3] via-[#859cb3]/50 to-transparent" />
              </div>
            );
          })}

          {/* Luminous Text Scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-900/40 to-slate-950/65 pointer-events-none" />

          {/* Bottom Accent Hairline matching PageHero */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-300/40 pointer-events-none z-10" />
        </div>

        {/* ── Carousel Outer Chevrons (< and > Side Navigation Buttons) ── */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); prevSlide(); }}
          className="flex absolute left-2.5 sm:left-5 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-brand-blue text-white items-center justify-center backdrop-blur-md border border-white/30 hover:border-sky-300 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Previous slide"
        >
          <i className="fa-solid fa-chevron-left text-xs sm:text-sm" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); nextSlide(); }}
          className="flex absolute right-2.5 sm:right-5 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-brand-blue text-white items-center justify-center backdrop-blur-md border border-white/30 hover:border-sky-300 transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
          aria-label="Next slide"
        >
          <i className="fa-solid fa-chevron-right text-xs sm:text-sm" />
        </button>

        {/* ── Center Content Area ── */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-9 sm:py-11 lg:py-13 text-center flex flex-col items-center">
          {/* Animated Eyebrow / Tag */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-sky-200 backdrop-blur-md border border-white/20 shadow-sm mb-2.5 sm:mb-3 transition-all">
            <i className={`${activeSlide.badgeIcon} text-xs text-[#90dafc]`} />
            <span>{activeSlide.tag}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {activeSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-slate-200 font-medium leading-relaxed max-w-2xl drop-shadow-xs">
            {activeSlide.subtitle}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 my-3.5 sm:my-4 justify-center">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.label}
                className="group flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-[#90dafc]/60 px-3 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <i className={`${b.icon} text-[#90dafc] text-xs transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6`} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="flex items-center justify-center mt-1">
            <button
              type="button"
              onClick={handleVisitShop}
              className="inline-flex items-center gap-2 bg-action-primary hover:bg-action-primary-hover text-action-primary-text border border-action-primary-border px-7 sm:px-9 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <i className="fa-solid fa-store text-action-primary-text" />
              <span>Visit Shop · Explore</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>
          </div>
        </div>

        {/* ── Slide Indicator Dots (Clickable) ── */}
        <div className="absolute bottom-3.5 sm:bottom-4 z-20 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 shadow-md">
          {WELCOME_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? 'w-6 bg-[#90dafc]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${i + 1}: ${s.category}`}
            />
          ))}
        </div>
      </section>

      {/* ── CEO MESSAGE ───────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-10 lg:p-12 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.03)] overflow-hidden">
            {/* Top Minimalist Gradient Accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-1/3 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200/60 mb-3.5">
                    <i className="fa-solid fa-quote-left text-xs text-brand-blue" />
                    <span>Message from the CEO</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    Building a Complete Ecosystem for Capital &amp; Commodity
                  </h2>
                  <p className="mt-2 text-xs font-semibold text-brand-blue uppercase tracking-wider">
                    Leadership Message
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-brand-blue text-white font-black text-xs flex items-center justify-center shadow-xs">
                    OV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">OneVishwam Leadership</p>
                    <p className="text-[11px] font-medium text-sky-600">Executive Vision · Karnataka</p>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  OneVishwam is a trusted marketplace and financial platform that addresses capital investments in essential
                  properties and daily commodities required in day-to-day life. We offer a{' '}
                  <strong className="text-slate-900 font-semibold">One Stop Solution</strong> for all those who are in need of a complete ecosystem to build their
                  life, by providing them both finance and products to invest in.
                </p>
                <p>
                  We offer products at much lower prices than the market, as we source them directly from manufacturers
                  and prime property developers. We collaborate with reputed Co-operative societies to provide
                  low-interest, transparent micro-finance to our customers, making big investments accessible and
                  affordable for every family in Karnataka.
                </p>
                <div className="p-4 rounded-xl bg-slate-50/80 border-l-2 border-sky-400 text-slate-800 text-xs sm:text-sm font-medium italic">
                  "Our vision is to empower Karnataka's families with verified, affordable assets — from prime plots and luxury villas to certified vehicles and factory-direct home goods — backed by ethical co-operative finance."
                </div>

                {/* Interactive Highlight Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-sky-50/50 hover:border-sky-200 transition-all group/item">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center text-xs shrink-0 group-hover/item:scale-110 transition-transform">
                      <i className="fa-solid fa-handshake-slash" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">0% Brokerage</p>
                      <p className="text-[10px] text-slate-500">Direct owner deal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all group/item">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs shrink-0 group-hover/item:scale-110 transition-transform">
                      <i className="fa-solid fa-building-columns" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Co-Op Credit</p>
                      <p className="text-[10px] text-slate-500">Regulated low EMI</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group/item">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0 group-hover/item:scale-110 transition-transform">
                      <i className="fa-solid fa-shield-check" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">100% Vetted</p>
                      <p className="text-[10px] text-slate-500">Legal due diligence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PILLARS ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-sky-50 text-sky-700 border border-sky-100 mb-2.5">
              <i className="fa-solid fa-layer-group text-[10px]" />
              <span>Our Foundation</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Four Core Pillars of OneVishwam
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-normal leading-relaxed">
              Everything we do is grounded in these principles that protect and empower our customers.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 hover:border-sky-300 hover:shadow-[0_20px_40px_-12px_rgba(14,165,233,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default"
              >
                {/* Subtle top ambient glow on hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-sky-50 rounded-full blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 text-brand-blue flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-sky-500 group-hover:to-brand-blue group-hover:text-white group-hover:shadow-md transition-all duration-300">
                      <i className={pillar.icon} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-50 text-slate-600 border border-slate-200/60 group-hover:bg-sky-50 group-hover:text-sky-700 group-hover:border-sky-200 transition-colors">
                      <i className={`${pillar.badgeIcon} text-[9px] text-sky-500`} />
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight mb-2 group-hover:text-brand-blue transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal mb-4">
                    {pillar.desc}
                  </p>

                  {/* Interactive Micro Highlights with Icons */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100/80">
                    {pillar.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] shrink-0 border border-emerald-100">
                          <i className={h.icon} />
                        </span>
                        <span>{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive Link */}
                <div className="relative z-10 mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-brand-blue transition-colors">
                  <span className="tracking-wider uppercase flex items-center gap-1.5">
                    <i className="fa-solid fa-shield-check text-[11px] text-sky-500" />
                    Pillar Guarantee
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                    Explore <i className="fa-solid fa-arrow-right text-[10px]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ─────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-sky-50 text-sky-700 border border-sky-100 mb-2.5">
              <i className="fa-solid fa-shapes text-[10px]" />
              <span>Our Platforms</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Buy &amp; Sell on OneVishwam
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-normal">
              Two interconnected platforms serving every side of the marketplace equation.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PLATFORMS.map((p) => (
              <div
                key={p.label}
                className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 hover:border-sky-300 hover:shadow-[0_24px_48px_-12px_rgba(14,165,233,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Ambient soft glow on hover */}
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-sky-100/60 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Bar with Icon & Status Tag */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 text-brand-blue flex items-center justify-center text-lg shadow-2xs group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-sky-500 group-hover:to-brand-blue group-hover:text-white transition-all duration-300">
                        <i className={p.icon} />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200/70">
                          <span>{p.sub}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-sky-600 mt-0.5">{p.badge}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {p.statusTag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2.5 group-hover:text-brand-blue transition-colors">
                    {p.label}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal mb-5">
                    {p.desc}
                  </p>

                  {/* Interactive Feature List with Icons */}
                  <div className="grid grid-cols-1 gap-2 mb-5">
                    {p.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-white hover:border-sky-200 hover:shadow-2xs transition-all"
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-100/70 text-brand-blue flex items-center justify-center text-xs shrink-0 mt-0.5">
                          <i className={feat.icon} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{feat.title}</p>
                          <p className="text-[11px] text-slate-500 leading-tight">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pills with Icons */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.pills.map((pill) => (
                      <span
                        key={pill.text}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-700 border border-slate-200/60 group-hover:bg-sky-50 group-hover:border-sky-200/80 group-hover:text-sky-800 transition-colors"
                      >
                        <i className={`${pill.icon} text-[10px] text-sky-600`} />
                        <span>{pill.text}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Interactive CTA Button */}
                <div className="relative z-10 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleVisitShop}
                    className="w-full inline-flex items-center justify-between bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-md cursor-pointer group/btn border border-brand-blue/30"
                  >
                    <span className="flex items-center gap-2">
                      <i className={`${p.icon} text-xs text-[#90dafc]`} />
                      <span>Explore {p.label}</span>
                    </span>
                    <i className="fa-solid fa-arrow-right text-xs group-hover/btn:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRATEGIC ROADMAP ─────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-sky-50 text-sky-700 border border-sky-100 mb-2.5">
              <i className="fa-solid fa-compass text-[10px]" />
              <span>Strategic Roadmap</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Where We See Ourselves
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-normal leading-relaxed">
              Our 5-year trajectory to establish Karnataka's premier capital-commodity network.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP_STEPS.map((item) => (
              <div
                key={item.step}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 hover:shadow-[0_16px_32px_-10px_rgba(14,165,233,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 text-brand-blue flex items-center justify-center text-base group-hover:bg-gradient-to-tr group-hover:from-sky-500 group-hover:to-brand-blue group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                      <i className={item.icon} />
                    </div>
                    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${item.phaseColor}`}>
                      Phase {item.step}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                      {item.phaseTag}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal mb-4">
                    {item.desc}
                  </p>

                  {/* Key Deliverables with Micro Icons */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100/80">
                    {item.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                        <i className={`${pt.icon} text-[10px] text-sky-500 shrink-0`} />
                        <span>{pt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Minimal progress indicator bar with flag icon */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-flag-checkered text-sky-500 text-[10px]" />
                      MILESTONE
                    </span>
                    <span className="text-sky-600 font-bold">{parseInt(item.step, 10) * 25}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${parseInt(item.step, 10) * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#d9ebfa] via-[#e8f2fb] to-[#cfe4f6] p-8 sm:p-14 lg:p-16 text-slate-900 border border-sky-200/90 shadow-sm overflow-hidden text-center">
            {/* Ambient Lighting matching footer theme */}
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-gradient-to-br from-sky-300/40 via-blue-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-gradient-to-tr from-sky-300/40 via-blue-200/25 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-white/80 text-brand-blue border border-sky-200 shadow-2xs mb-4">
                <i className="fa-solid fa-sparkles text-[10px]" />
                <span>Karnataka's Unified Marketplace</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3.5 tracking-tight">
                Start Your Journey with OneVishwam
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto mb-8 leading-relaxed">
                Browse verified properties, certified vehicles, co-operative loans, and factory-direct commodities — all in one trusted ecosystem.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={handleVisitShop}
                  className="inline-flex items-center gap-2.5 bg-action-primary hover:bg-action-primary-hover text-action-primary-text border border-action-primary-border px-8 py-3.5 rounded-xl text-sm sm:text-base font-black transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <i className="fa-solid fa-store text-action-primary-text" />
                  <span>Enter the Marketplace</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateTo('/enquiry/')}
                  className="inline-flex items-center gap-2.5 bg-white text-slate-800 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <i className="fa-solid fa-envelope text-brand-blue" />
                  <span>Get in Touch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY BOTTOM CTA (mobile) ────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl px-4 py-3">
        <button
          type="button"
          onClick={handleVisitShop}
          className="w-full inline-flex items-center justify-center gap-2 bg-action-primary hover:bg-action-primary-hover text-action-primary-text border border-action-primary-border py-3.5 rounded-xl text-sm font-black transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <i className="fa-solid fa-store text-xs" />
          <span>Visit Shop — Explore Marketplace</span>
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
      </div>

      {/* Mobile padding for sticky CTA */}
      <div className="sm:hidden h-20" />
    </div>
  );
}
