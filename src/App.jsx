import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import { NAVIGATION_EVENT } from './config/navigation';
import BrandLoader from './components/ui/BrandLoader';

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

function ScrollToTopAndNavHelper() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetId = location.hash.replace('#', '');
      requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  return null;
}

function App() {
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
            <Route path="/property/*" element={<PropertyDetails location={location} />} />
            <Route path="/finance/*" element={<LoanDetails location={location} />} />
            <Route path="/finance-service/success" element={<FinanceServiceSuccess />} />
            <Route path="/finance-service/:id" element={<FinanceDetails location={location} />} />
            <Route path="/finance-flow" element={<FinanceFlow />} />
            <Route path="/grocery/*" element={<GroceryDetails location={location} />} />
            <Route path="/vehicle/*" element={<VehicleDetails location={location} />} />
            <Route path="/jewellery/*" element={<JewelleryDetails location={location} />} />
            <Route path="/garment/*" element={<GarmentDetails location={location} />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;