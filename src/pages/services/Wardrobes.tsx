import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Ruler, Sparkles, ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function Wardrobes() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const wardrobeTypes = [
    {
      title: 'Sliding Door Wardrobes',
      desc: 'Floor-to-ceiling sliding systems with concealed soft-close channels. Saves floor space while offering panoramic opening access.',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200',
    },
    {
      title: 'Hinged & Openable Wardrobes',
      desc: 'Classic 90-degree openable shutters with 165-degree wide hinges, external drawers, and integrated dressing mirrors.',
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200',
    },
    {
      title: 'Walk-In Closets & Dressing Lounges',
      desc: 'Bespoke island accessories drawer, automated sensor LED lighting, tempered glass display doors, and dedicated shoe vaults.',
      image: 'https://images.unsplash.com/photo-1558997519-83ea9252def8?q=80&w=1200',
    },
    {
      title: 'Custom Loose & Built-In Furniture',
      desc: 'Sofa-cum-beds, ergonomic study workstations, dining sets, and bedside tables handcrafted at our Nashik factory outlet.',
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200',
    },
  ];

  const benefits = [
    {
      title: 'Customized Internal Storage',
      desc: 'Organized with sari trays, tie racks, jewelry organizers, pull-out trousers racks, and deep overhead loft spaces.',
    },
    {
      title: 'Anti-Bend Stiffener Systems',
      desc: 'Aluminum door straighteners installed on high doors to guarantee zero warping or bending over decades.',
    },
    {
      title: 'Finest Material Selections',
      desc: 'PU gloss, fluted veneer, tinted fluted glass, soft-touch matte acrylics, and fabric-textured laminates.',
    },
    {
      title: 'Factory-Direct Craftsmanship',
      desc: 'Zero uneven gaps or rough carpenter edges; machine-pressed edge banding ensure water-tight finish.',
    },
  ];

  const faqs = [
    {
      question: 'Which wardrobe style is best for compact bedrooms in Nashik and Pune?',
      answer: 'Sliding door wardrobes are ideal for rooms where clearance between bed and wardrobe is tight (less than 3 feet), as sliding panels glide smoothly without requiring swinging door clearance.',
    },
    {
      question: 'Can MR Interiors customize internal wardrobe layouts?',
      answer: 'Yes, 100% of our internal configurations are custom tailored to your wardrobe needs—including hanging heights, drawer dividers, lockable lockers, and overhead lofts.',
    },
    {
      question: 'What materials are used for MR Interiors custom wardrobes?',
      answer: 'We use commercial BWR or Calibrated HDHMR plywood core with zero termite risk, matched with premium soft-close slide channels and hardware.',
    },
  ];

  return (
    <>
      <SEO
        title="Custom Wardrobe & Furniture Designer in Nashik | MR Interiors"
        description="Premium sliding wardrobes, walk-in closets, and custom furniture in Nashik, Pune & Mumbai. Factory outlet pricing with 10-year durability. Call +91 9423640903."
        canonical="/wardrobes"
        serviceName="Custom Wardrobe and Furniture Design"
        serviceDescription="Sliding wardrobes, walk-in closets, modular storage systems, and custom furniture manufacturing."
        keywords="wardrobe designer Nashik, custom wardrobe Nashik, sliding wardrobe Nashik, walk-in closet Nashik, furniture designer Nashik, bedroom wardrobe design, modular wardrobe Nashik"
        includeRating={true}
        speakableAnswer="MR Interiors designs and manufactures custom wardrobes and furniture in Nashik, Pune, and Mumbai. Options include floor-to-ceiling sliding door wardrobes, hinged wardrobes, walk-in closets, and bespoke loose furniture. All wardrobes use BWR/HDHMR plywood with soft-close hardware and come with a 10-year warranty. Factory-direct pricing saves customers 20-30% compared to retail."
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Wardrobes & Furniture', url: '/wardrobes' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <Layers className="w-3.5 h-3.5" /> Tailored Storage Architecture
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Custom Wardrobes &amp; <span className="text-secondary italic">Furniture Solutions</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                Maximize bedroom elegance and storage efficiency with custom-engineered sliding wardrobes, walk-in closets, and bespoke furniture handcrafted directly at our factory outlet in Nashik.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Book Free Measurement
                </button>
                <Link
                  to="/modular-kitchens"
                  className="px-8 py-3.5 rounded-full border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-2"
                >
                  Explore Modular Kitchens <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-secondary/20 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200"
                alt="Custom Wardrobe Solutions by MR Interiors"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">Bespoke Internal Partitions</p>
                      <p className="text-white/70 text-xs">Soft-Close Aluminum Systems</p>
                    </div>
                    <span className="text-secondary text-xs font-semibold px-2.5 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                      10-Year Life Warranty
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 bg-secondary/5 border-y border-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif text-center mb-12">
              The Engineering Difference with <span className="text-secondary">MR Interiors</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/30 transition-all">
                  <CheckCircle2 className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="font-semibold text-lg text-white mb-2">{b.title}</h3>
                  <p className="text-accent/70 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wardrobe Styles */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Popular Wardrobe &amp; Furniture Configurations</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Constructed to your room heights with smooth glides, sensor lighting, and luxurious tactile surfaces.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {wardrobeTypes.map((w, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-secondary/5">
                <img src={w.image} alt={w.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-serif text-white mb-2">{w.title}</h3>
                  <p className="text-accent/70 text-sm">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-main/80 border-t border-white/10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-secondary/5">
                <h3 className="font-medium text-white text-base mb-2">{f.question}</h3>
                <p className="text-accent/70 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-serif mb-4">Design Your Custom Wardrobe Today</h2>
          <p className="text-accent/70 mb-8">Visit our factory outlet at Nilgiri Baug, Sambhaji Nagar Road, Nashik or get an in-home designer visit.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-transform hover:scale-105 shadow-xl"
          >
            Schedule Free Design Session
          </button>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
