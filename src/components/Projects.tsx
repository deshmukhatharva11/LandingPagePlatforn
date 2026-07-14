import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { projects } from './Projects/data';

export default function Projects() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean[]>(new Array(projects.length).fill(false));

  useEffect(() => {
    const observers = videoRefs.current.map((videoRef, index) => {
      if (!videoRef) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsIntersecting(prev => {
              const newState = [...prev];
              newState[index] = entry.isIntersecting;
              return newState;
            });
            if (!entry.isIntersecting) videoRef?.pause();
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(videoRef);
      return observer;
    });
    return () => { observers.forEach(o => o?.disconnect()); };
  }, []);

  const handleMouseEnter = (index: number) => {
    if (videoRefs.current[index] && isIntersecting[index]) {
      videoRefs.current[index]?.play().catch(() => {});
    }
    setHoveredIndex(index);
  };

  const handleMouseLeave = (index: number) => {
    const vid = videoRefs.current[index];
    if (vid) { vid.pause(); vid.currentTime = 0; }
    setHoveredIndex(null);
  };

  return (
    <section id="projects" className="py-24 bg-main relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif mb-4">Our Work</h2>
          <p className="text-xl text-accent max-w-2xl mx-auto">
            Real homes, real families — 1000+ projects delivered across Nashik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.08 }}
              className="group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <motion.div
                  className="relative h-full transform-gpu"
                  whileHover={{ scale: 1.05, transition: { duration: 0.7 } }}
                >
                  <video
                    ref={el => videoRefs.current[index] = el}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover bg-black/40"
                  >
                    <source src={project.video} type="video/mp4" />
                  </video>

                  {/* Always-visible gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Title overlay always visible */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <h3 className="text-lg font-serif text-white font-semibold leading-tight">{project.title}</h3>
                      <p className="text-secondary text-xs mt-0.5 tracking-wide">{project.category}</p>
                    </div>
                  </div>

                  {/* Hover description */}
                  <div className={`absolute inset-x-0 top-0 p-4 transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                    <p className="text-white/80 text-sm bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2">{project.description}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}