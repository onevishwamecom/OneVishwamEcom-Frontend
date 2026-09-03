import PageHero from '../../components/PageHero';

function CareersHero() {
  return (
    <PageHero
      eyebrow={{ icon: 'fa-solid fa-briefcase', label: 'Careers at One Vishwam' }}
      title={<>Build the Future of <span className="text-yellow-400">Services With Us</span></>}
      subtitle="We are always looking for driven, passionate minds to help build Karnataka's leading cooperative marketplace and financial ecosystem. Submit your profile below to get in touch with our talent team."
      image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80"
    />
  );
}

export default CareersHero;
