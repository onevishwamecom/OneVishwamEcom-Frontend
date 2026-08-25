import React from 'react';

export default function GroceryCertifications({ item }) {
  const certifications = [];
  if (item?.organic) {
    certifications.push({ label: 'Organic Certified', icon: 'fa-leaf', desc: 'Grown without chemicals or pesticides' });
  }
  if (item?.fssaiCertified) {
    certifications.push({ label: 'FSSAI Certified', icon: 'fa-certificate', desc: 'Approved by Food Safety Authority' });
  }
  if (item?.freshToday) {
    certifications.push({ label: 'Fresh Today', icon: 'fa-sun', desc: 'Harvested and delivered fresh daily' });
  }

  if (certifications.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
          <i className="fa-solid fa-shield-halved text-emerald-600 text-xs" />
        </div>
        <h2 className="text-base font-bold text-brand-charcoal">Certifications &amp; Quality</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {certifications.map((c) => (
          <div key={c.label} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
            <i className={`fa-solid ${c.icon} text-emerald-600 text-lg mb-1`} />
            <p className="text-sm font-bold text-brand-charcoal">{c.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
