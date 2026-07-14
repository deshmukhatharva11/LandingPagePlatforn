import { ArrowRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ProjectForm from './ProjectForm';

export default function Hero() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const videoSrc = isMobile ? '/videos/MRTraders-Mobile.mp4' : '/videos/MRTraders-Desktop.mp4';

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onLoaded = () => setIsVideoLoaded(true);
    vid.addEventListener('loadeddata', onLoaded);
    return () => vid.removeEventListener('loadeddata', onLoaded);
  }, []);

  const headlineWords = ["Nashik's", "Most", "Trusted", "Interior", "Studio"];

  return (
    <>
      <section id="home" className="relative h-screen flex items-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#050608]" />
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 text-white">
          {/* Eyebrow */}
          <motion.p
            className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-secondary mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Interior Design &amp; Factory Outlet
          </motion.p>

          {/* Split-text headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.05] mb-6">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                className={`inline-block mr-[0.25em] ${word === "Interior" || word === "Studio" ? 'text-secondary' : ''}`}
                initial={{ opacity: 0, y: 40, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/75 max-w-xl mb-10 font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            Factory-direct materials. Expert design. 1000+ homes delivered across Nashik since 1992.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.5 }}
          >
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-secondary text-[#050608] font-medium rounded-md hover:bg-secondary-400 transition-all duration-300 transform hover:scale-[1.03] group"
            >
              Book Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-3.5 text-white/90 rounded-md border border-white/15 hover:border-secondary/40 hover:text-secondary transition-all duration-300"
            >
              Explore Our Work
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}