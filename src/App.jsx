import { useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION_EVENT } from './config/navigation';
const Footer = lazy(() => import('./components/Footer'));
import BrandLoader from './components/ui/BrandLoader';
import { useAuth, forceLogout } from './store/authSlice';
import store from './store';
import AuthModals from './components/auth/AuthModals';

// Lazy load routes
const AboutPage = lazy(() => import('./pages/about'));
const ContactPage = lazy(() => import('./pages/contact'));
const Home = lazy(() => import('./pages/home'));
const ServicesPage = lazy(() => import('./pages/services'));
const CareersPage = lazy(() => import('./pages/careers'));
const PropertyDetails = lazy(() => import('./pages/services/property/PropertyDetails'));
const PostRequirement = lazy(() => import('./pages/services/property/PostRequirement'));
const RequirementSuccess = lazy(() => import('./pages/services/property/RequirementSuccess'));
const LoanDetails = lazy(() => import('./pages/services/finance/LoanDetails'));
const GroceryDetails = lazy(() => import('./pages/services/grocery/GroceryDetails'));
const VehicleDetails = lazy(() => import('./pages/services/automobile/VehicleDetails'));
const JewelleryDetails = lazy(() => import('./pages/services/jewellery/JewelleryDetails'));
const GarmentDetails = lazy(() => import('./pages/services/garments/GarmentDetails'));
const FinanceGallery = lazy(() => import('./pages/services/finance/FinanceGallery'));
const FinanceDetails = lazy(() => import('./pages/services/finance/FinanceDetails'));
const FinanceFlow = lazy(() => import('./services/FinanceFlow'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyOtp = lazy(() => import('./pages/auth/VerifyOtp'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const ResetSuccess = lazy(() => import('./pages/auth/ResetSuccess'));
const ProfileSettings = lazy(() => import('./pages/profile/Settings'));
const NotificationsPage = lazy(() => import('./pages/notifications'));
const ComingSoon = lazy(() => import('./pages/coming-soon/ComingSoon'));

function ScrollToTopAndNavHelper() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleCustomNav = (e) => {
      navigate(e.detail);
    };
    window.addEventListener(NAVIGATION_EVENT, handleCustomNav);
    return () => window.removeEventListener(NAVIGATION_EVENT, handleCustomNav);
  }, [navigate]);

  // Listen for forced logout from token refresh failure
  useEffect(() => {
    const handleForceLogout = () => {
      store.dispatch(forceLogout());
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  return null;
}

/**
 * RequireAuth - guards protected detail/listing pages.
 * Unauthenticated users see a "please log in" placeholder and an auth modal
 * is opened automatically on first visit so they can log in without losing context.
 */
function RequireAuth({ children }) {
  const { isLoggedIn, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const promptedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !promptedRef.current) {
      promptedRef.current = true;
      openAuthModal('login');
    }
  }, [isLoggedIn, openAuthModal]);

  if (isLoggedIn) return children;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 pt-16 lg:pt-14">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mx-auto mb-4">
          <i className="fa-solid fa-lock text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-brand-charcoal">Login Required</h2>
        <p className="mt-2 text-sm text-gray-500">
          Please log in to view this property. We&rsquo;ll keep everything ready so you can come right back here.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue text-white px-6 py-3 text-sm font-bold hover:bg-brand-navy transition-colors"
        >
          <i className="fa-solid fa-arrow-right-to-bracket" /> Log In to Continue
        </button>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 block w-full text-sm font-semibold text-gray-500 hover:text-brand-blue transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const { isLoggedIn, fetchMe } = useAuth();

  // Validate stored session on mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchMe();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ScrollToTopAndNavHelper />
      <main>
        <Suspense fallback={<BrandLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us/*" element={<AboutPage />} />
            <Route path="/our-services/finance-lending" element={<FinanceGallery />} />
            <Route path="/our-services/*" element={<ServicesPage location={location} />} />
            <Route path="/contact-us/*" element={<ContactPage location={location} />} />
            <Route path="/careers/*" element={<CareersPage />} />
            <Route path="/property/requirement/success" element={<RequirementSuccess />} />
            <Route path="/property/requirement" element={<PostRequirement />} />
            <Route path="/property/*" element={<RequireAuth><PropertyDetails location={location} /></RequireAuth>} />
            <Route path="/finance/*" element={<RequireAuth><LoanDetails location={location} /></RequireAuth>} />
            <Route path="/finance-service/:id" element={<RequireAuth><FinanceDetails location={location} /></RequireAuth>} />
            <Route path="/finance-flow" element={<FinanceFlow />} />
            <Route path="/grocery/*" element={<RequireAuth><GroceryDetails location={location} /></RequireAuth>} />
            <Route path="/vehicle/*" element={<RequireAuth><VehicleDetails location={location} /></RequireAuth>} />
            <Route path="/jewellery/*" element={<RequireAuth><JewelleryDetails location={location} /></RequireAuth>} />
            <Route path="/garment/*" element={<RequireAuth><GarmentDetails location={location} /></RequireAuth>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="/profile/settings" element={<RequireAuth><ProfileSettings /></RequireAuth>} />
            <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <AuthModals />
    </>
  );
}

export default App;