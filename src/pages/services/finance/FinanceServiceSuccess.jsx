import { Link } from 'react-router-dom';

function FinanceServiceSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fa-solid fa-check text-3xl text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Service Posted!</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your financial service has been submitted successfully. It will be reviewed and published shortly.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link to="/our-services/finance-lending"
              className="w-full rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Browse Finance Services
            </Link>
            <Link to="/"
              className="w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceServiceSuccess;
