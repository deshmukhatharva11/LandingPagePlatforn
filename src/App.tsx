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

function HomePage() {
  return (
    <>
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
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowContent(true), 100);
    }, 2500);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={`min-h-screen transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
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
  if (location.pathname.startsWith('/app')) return null;
  return <ChatWidget />;
}

export default function App() {
  return (
    <HelmetProvider>
      <Router future={{ v7_startTransition: true }}>
        <ScrollToTop />
        <SEO />
        <Suspense fallback={<div className="min-h-screen bg-main" />}>
          <Routes future={{ v7_relativeSplatPath: true }}>
            <Route path="/" element={<JourneyExperience />} />
            <Route path="/discover" element={<JourneyExperience />} />
            <Route element={<SiteLayout />}>
              <Route path="/classic" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<ServicesPage />} />
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
