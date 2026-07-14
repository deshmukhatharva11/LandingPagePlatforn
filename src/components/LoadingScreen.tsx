import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [phase, setPhase] = useState<'logo' | 'line' | 'done'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('line'), 1200);
    const t2 = setTimeout(() => setPhase('done'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#050608] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Logo */}
          <motion.img
            src="/favicon.png"
            alt="MR Traders"
            className="h-20 sm:h-24 w-auto mb-6"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: 'drop-shadow(0 0 30px rgba(200,146,42,0.3))' }}
          />

          {/* Brand Name */}
          <motion.h1
            className="font-serif text-2xl sm:text-3xl tracking-[0.15em] text-white/90 mb-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            MR TRADERS
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-secondary/70 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Nashik&apos;s Finest &middot; Since 1992
          </motion.p>

          {/* Gold sweep line */}
          <div className="w-48 sm:w-64 h-[1px] bg-white/5 overflow-hidden rounded-full">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, #C8922A, transparent)' }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.4, delay: 0.8, ease: [0.45, 0, 0.55, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}