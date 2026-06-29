import { Link } from 'react-router-dom';

function ResetSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <i className="fa-solid fa-check text-3xl text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-brand-charcoal mb-2">Password Updated Successfully</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your password has been changed successfully. You can now log in with your new password.
          </p>
          <Link to="/"
            className="inline-block w-full rounded-xl bg-brand-blue py-3 text-sm font-bold text-white hover:bg-brand-navy transition-colors text-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetSuccess;
