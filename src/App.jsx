import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import { setNavigate } from './config/navigation';
import PageSkeleton from './components/ui/PageSkeleton';

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
const FinanceServiceSuccess = lazy(() => import('./pages/services/finance/FinanceServiceSuccess'));
const FinanceFlow = lazy(() => import('./services/FinanceFlow'));
const ComingSoon = lazy(() => import('./pages/coming-soon/ComingSoon'));

/**
 * Registers React Router's navigate function with the navigateTo() utility so that
 * any component calling navigateTo() gets true client-side SPA navigation instead of
 * going through the DOM CustomEvent indirection layer.
 *
 * Also handles scroll-to-top on every route change.
 */
function RouterSyncEffect() {
  const location = useLocation();
  const navigate = useNavigate();

  // Register navigate with the module-level utility on mount and whenever it changes.
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  // Scroll to top on route change (unless navigating to a hash anchor).
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    } else {
      const targetId = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <>
      <RouterSyncEffect />
      <main>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us/*" element={<AboutPage />} />
            <Route path="/our-services/finance-lending" element={<FinanceGallery />} />
            <Route path="/our-services/*" element={<ServicesPage />} />
            <Route path="/contact-us/*" element={<ContactPage />} />
            <Route path="/careers/*" element={<CareersPage />} />
            <Route path="/property/requirement/success" element={<RequirementSuccess />} />
            <Route path="/property/requirement" element={<PostRequirement />} />
            <Route path="/property/*" element={<PropertyDetails />} />
            <Route path="/finance/*" element={<LoanDetails />} />
            <Route path="/finance-service/success" element={<FinanceServiceSuccess />} />
            <Route path="/finance-service/:id" element={<FinanceDetails />} />
            <Route path="/finance-flow" element={<FinanceFlow />} />
            <Route path="/grocery/*" element={<GroceryDetails />} />
            <Route path="/vehicle/*" element={<VehicleDetails />} />
            <Route path="/jewellery/*" element={<JewelleryDetails />} />
            <Route path="/garment/*" element={<GarmentDetails />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;