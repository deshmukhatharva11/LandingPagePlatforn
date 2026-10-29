import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type Lenis from 'lenis';
import HeroScrub from '../experience/HeroScrub';
import DiscoverExperience from './DiscoverExperience';
import Showcase from './Showcase';
import JourneyNav from './JourneyNav';
import SEO from '../components/SEO';
import type { Answers } from './report';

/**
 * One continuous journey: scroll-scrubbed video hero → discovery quiz deck →
 * personalized projects/testimonials showcase.
 */
export default function JourneyExperience() {
  const [phase, setPhase] = useState<'hero' | 'quiz' | 'showcase'>('hero');
  const [answers, setAnswers] = useState<Answers>({});
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const showcaseLenis = useRef<Lenis | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const toQuiz = useCallback(() => setPhase('quiz'), []);
  const toHero = useCallback(() => {
    setTargetSection(null);
    setPhase('hero');
  }, []);
  const toShowcase = useCallback((a: Answers) => {
    setAnswers(a);
    setTargetSection(null);
    setPhase('showcase');
  }, []);
  const goToSection = useCallback((id: string) => {
    if (phaseRef.current === 'showcase') {
      showcaseLenis.current?.scrollTo('#' + id, { offset: -64 });
    } else {
      setTargetSection(id);
      setPhase('showcase');
    }
  }, []);

  return (
    <>
      <SEO
        title="MR Interiors | Interior Designer & Factory Outlet in Nashik"
        description="Turnkey home interiors, modular kitchens & custom wardrobes in Nashik by MR Interiors. Factory-direct pricing with 10-year warranty. Call +91 9423640903."
        canonical="/"
        includeRating={true}
        keywords="interior designer in Nashik, home interiors Nashik, modular kitchen Nashik, wardrobe designer Nashik, best interior designer Nashik, MR Interiors, MR Traders, interior design company Nashik"
        speakableAnswer="MR Interiors is Nashik's leading interior design studio and factory outlet with 35+ years of experience. They provide turnkey home interiors, modular kitchens, custom wardrobes, and commercial interiors across Nashik, Pune, and Mumbai at factory-direct pricing. Their Nashik studio is located at Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka. Contact them at +91 9423640903."
        howToSteps={[
          { name: 'Book a Free Consultation', text: 'Call +91 9423640903 or fill the contact form on the website. Our design consultant will schedule a free site visit at your convenience.' },
          { name: 'Design & 3D Visualization', text: 'Our interior architects create custom 2D layouts and photorealistic 3D renders. Visit our Nashik factory outlet to select materials in person.' },
          { name: 'Material Selection at Factory Outlet', text: 'Choose from premium plywood, laminates, hardware (Hafele, Hettich), and finishes at our direct factory outlet – no middlemen, saving you 20-30%.' },
          { name: 'Manufacturing & Installation', text: 'Furniture is precision-manufactured at our Nashik factory. Our on-site team handles installation with a committed 45-day timeline and 10-year warranty.' },
        ]}
      />
      {phase !== 'hero' && <JourneyNav onHome={toHero} onNavigate={goToSection} progress={phase === 'showcase' ? 1 : quizProgress} />}
      <AnimatePresence mode="wait">
      {phase === 'hero' && (
        <motion.div key="hero" exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
          <HeroScrub onComplete={toQuiz} />
        </motion.div>
      )}
      {phase === 'quiz' && (
        <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
          <DiscoverExperience onFinish={toShowcase} onReturnToHero={toHero} onProgress={setQuizProgress} />
        </motion.div>
      )}
      {phase === 'showcase' && (
        <motion.div key="showcase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
          <Showcase answers={answers} initialSection={targetSection} lenisRef={showcaseLenis} />
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
