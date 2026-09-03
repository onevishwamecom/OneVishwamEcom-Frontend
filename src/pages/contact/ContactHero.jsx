import PageHero from '../../components/PageHero';

function ContactHero() {
  return (
    <PageHero
      eyebrow={{ icon: 'fa-solid fa-headset', label: 'Contact One Vishwam' }}
      title={<>Get in Touch with <span className="text-yellow-400">Our Team</span></>}
      subtitle="Whether you're looking for verified property investments, cooperative financial services, or marketplace partnerships, our dedicated advisors are here to assist you every step of the way."
      image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
    />
  );
}

export default ContactHero;
