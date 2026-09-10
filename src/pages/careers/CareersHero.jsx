import PageHero from '../../components/PageHero';

function CareersHero() {
  return (
    <PageHero
      eyebrow={{ icon: 'fa-solid fa-briefcase', label: 'Careers at OneVishwam' }}
      title={<>Build Your Future <span className="text-yellow-400">With OneVishwam</span></>}
      subtitle="Join our passionate team shaping the future of cooperative finance, digital commerce, and everyday services across Karnataka. Explore opportunities to learn, grow, and make an impact."
      image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
    />
  );
}

export default CareersHero;
