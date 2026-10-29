import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ParallaxSlideshow from './components/ParallaxSlideshow';
import Services from './components/Services';
import Projects from './components/Projects/index';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import VideoTestimonials from './components/VideoTestimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import About from './pages/About';
import ServicesPage from './pages/Services';
import HomeInteriors from './pages/services/HomeInteriors';
import ModularKitchens from './pages/services/ModularKitchens';
import Wardrobes from './pages/services/Wardrobes';
import CommercialInteriors from './pages/services/CommercialInteriors';
import NashikLocation from './pages/locations/Nashik';
import PuneLocation from './pages/locations/Pune';
import MumbaiLocation from './pages/locations/Mumbai';
import ScrollToTop from './components/ScrollToTop';
import SEO from './components/SEO';
import Breadcrumbs from './components/Breadcrumbs';
import FAQ from './components/FAQ';
import './pages/App/app.css';

// Lazy-loaded routes
const JourneyExperience = lazy(() => import('./discover/JourneyExperience'));
const ProjectDetail = lazy(() => import('./components/Projects/ProjectDetail'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));
const AppShell = lazy(() => import('./pages/App/index'));

function isPortalHostname() {
  if (typeof window === 'undefined') return false;
  const h = window.location.hostname.toLowerCase();
  return h.startsWith('portal.') || h.includes('portal') ||
         h.startsWith('erp.') || h.includes('erp') ||
         h.startsWith('m21cz11sr.') || h.includes('m21cz11sr');
}

function RootRedirect() {
  if (isPortalHostname()) return <Navigate to='/app/login' replace />;
  return <JourneyExperience />;
}

function HomePage() {
  return (
    <>
      <SEO
        title="MR Interiors | Interior Designer & Factory Outlet in Nashik"
        description="MR Interiors provides turnkey home interiors, modular kitchens, custom wardrobes, and commercial interior design in Nashik, Pune & Mumbai with factory-direct pricing."
        canonical="/"
      />
      <Hero />
      <ParallaxSlideshow />
      <Services />
      <Projects />
      <VideoTestimonials />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

function SiteLayout() {
  const [isLoading, setIsLoading] = useState(() => {
    // Show splash animation only once per browser session
    if (typeof window !== 'undefined' && sessionStorage.getItem('mr_site_loaded')) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!isLoading) return;
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem('mr_site_loaded', '1');
      } catch (_) {}
    }, 1200);

    return () => clearTimeout(loadingTimer);
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className="min-h-screen">
        <Navbar />
        <Breadcrumbs />
        <Outlet />
        <Footer />
      </div>
    </>
  );
}

function ConditionalChatWidget() {
  const location = useLocation();
  if (location.pathname.startsWith('/app') || isPortalHostname()) return null;
  return <ChatWidget />;
}

export default function App() {
  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true }}>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-main" />}>
          <Routes future={{ v7_relativeSplatPath: true }}>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/discover" element={<JourneyExperience />} />
            <Route element={<SiteLayout />}>
              <Route path="/classic" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
              
              {/* Dedicated Service Routes */}
              <Route path="/home-interiors" element={<HomeInteriors />} />
              <Route path="/modular-kitchens" element={<ModularKitchens />} />
              <Route path="/wardrobes" element={<Wardrobes />} />
              <Route path="/commercial-interiors" element={<CommercialInteriors />} />

              {/* Dedicated Location Routes */}
              <Route path="/interior-designer-nashik" element={<NashikLocation />} />
              <Route path="/interior-designer-pune" element={<PuneLocation />} />
              <Route path="/interior-designer-mumbai" element={<MumbaiLocation />} />

              <Route path="/project/:id" element={<ProjectDetail />} />
            </Route>

            {/* Direct Aliases for App Routes */}
            <Route path="/login" element={<Navigate to="/app/login" replace />} />
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/invoices" element={<Navigate to="/app/invoices" replace />} />
            <Route path="/invoices/*" element={<Navigate to="/app/invoices" replace />} />
            <Route path="/products" element={<Navigate to="/app/products" replace />} />
            <Route path="/users" element={<Navigate to="/app/users" replace />} />
            <Route path="/audit" element={<Navigate to="/app/audit" replace />} />
            
            {/* Business App Module */}
            <Route path="/app/*" element={<AppShell />} />
          </Routes>
          <ConditionalChatWidget />
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}
