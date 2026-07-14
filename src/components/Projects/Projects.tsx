import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { projects } from './data';

interface VideoPlayerProps {
  src: string;
  onLoad?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onLoad }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            container.addEventListener('click', () => video.play(), { once: true });
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { root: null, rootMargin: '0px', threshold: [0, 0.1, 0.5, 1] }
    );

    observer.observe(container);
    video.load();
    if (onLoad) onLoad();

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [onLoad]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-black/40"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        disablePictureInPicture
        controls={false}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

export default function Projects() {
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleVideoLoad = (id: string) => {
    setLoadedVideos(prev => new Set(prev).add(id));
  };

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description,
        "video": project.video,
        "creator": {
          "@type": "Organization",
          "name": "MR Traders & Factory Outlet",
          "@id": "https://mrtraders.site"
        }
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(projectsSchema)}
        </script>
        {projects.map(project => (
          <link
            key={project.id}
            rel="preload"
            as="video"
            href={project.video}
            type="video/mp4"
            crossOrigin="anonymous"
          />
        ))}
      </Helmet>

      <section id="projects" className="py-24 bg-main relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-serif mb-4"
            >
              Our Work
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-accent max-w-2xl mx-auto"
            >
              Real homes, real families — 1000+ projects delivered across Nashik
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, delay: index * 0.08 }
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                    <motion.div
                      className="relative h-full transform-gpu transition-all duration-700 ease-out"
                      whileHover={{ scale: 1.05, transition: { duration: 0.7 } }}
                    >
                      <VideoPlayer
                        src={project.video}
                        onLoad={() => handleVideoLoad(project.id)}
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Title always visible */}
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <h3 className="text-2xl font-serif mb-1 text-white font-bold">{project.title}</h3>
                          <p className="text-secondary font-medium mb-1 text-sm tracking-wide">{project.category}</p>
                          <p className={`text-white/80 text-sm transition-all duration-300 ${isHovered ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>{project.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
