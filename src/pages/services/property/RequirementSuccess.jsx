import { Link } from 'react-router-dom';

function RequirementSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fa-solid fa-check text-3xl text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-brand-charcoal mb-2">
            Your Requirement Has Been Submitted Successfully!
          </h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            We have received your requirement. Matching properties and sellers will be shown or shared once available.
          </p>
          <div className="space-y-3">
            <Link to="/our-services/real-estate-property"
              className="block w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors"
            >
              Continue Browsing
            </Link>
            <Link to="/our-services/real-estate-property"
              className="block w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              View Property Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequirementSuccess;
