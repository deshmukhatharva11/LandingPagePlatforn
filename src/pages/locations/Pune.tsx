import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Award, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function PuneLocation() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const puneLocalities = [
    'Baner',
    'Wakad',
    'Hinjewadi',
    'Kharadi',
    'Kothrud',
    'Viman Nagar',
    'Magarpatta City',
    'Hadapsar',
    'Bavdhan',
    'Pimple Saudagar',
    'Aundh',
    'Ravet',
  ];

  const benefits = [
    {
      title: 'Precision Factory-Direct Prefabrication',
      desc: 'All modular cabinets and wardrobe shutters are precision cut and edge-banded in our central factory outlet, minimizing carpentry sawdust and noise in Pune high-rises.',
    },
    {
      title: 'Cost Advantage for Pune Homeowners',
      desc: 'Avoid inflated Pune interior studio commissions. By sourcing directly from our factory outlet, clients save 15% to 25% on premium modular setups.',
    },
    {
      title: 'Dedicated On-Site Pune Project Engineers',
      desc: 'Our experienced site supervisors handle turnkey installation, electrical work, false ceilings, and painting locally on-site.',
    },
    {
      title: 'Transparent Milestones & 10-Yr Warranty',
      desc: 'Complete project tracking via digital progress reports, with guaranteed handover within 45 to 60 working days.',
    },
  ];

  const faqs = [
    {
      question: 'How does MR Interiors execute interior projects in Pune?',
      answer: 'Our senior interior designers conduct virtual or on-site measurements across Pune. The modular units are custom-crafted at our manufacturing unit with German machinery and dispatched directly to your Pune residence for rapid, clean installation by our trained team.',
    },
    {
      question: 'Which areas in Pune do you serve?',
      answer: 'We serve all key residential and commercial hubs including Baner, Wakad, Hinjewadi Phase 1-3, Kharadi, Kothrud, Viman Nagar, Magarpatta, Hadapsar, and Pimple Saudagar.',
    },
    {
      question: 'How can Pune clients review material samples?',
      answer: 'Our designers carry material sample kits (including acrylic, laminate, veneer, and hardware samples) during our in-home consultation in Pune.',
    },
  ];

  return (
    <>
      <SEO
        title="Interior Designer in Pune | Home Interiors & Modular Kitchens | MR Interiors"
        description="Looking for an experienced interior designer in Pune? MR Interiors offers turnkey home interiors, modular kitchens, and custom wardrobes with factory-direct pricing."
        canonical="/interior-designer-pune"
        serviceName="Interior Design and Execution in Pune"
        serviceDescription="Turnkey residential interiors, modular kitchens, custom wardrobes, and commercial interior fit-outs in Pune, Maharashtra."
        city="Pune"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/interior-designer-pune' },
          { name: 'Pune', url: '/interior-designer-pune' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <MapPin className="w-3.5 h-3.5" /> Turnkey Residential Execution · Pune
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Premium Home Interiors in <span className="text-secondary italic">Pune</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                Designed for modern Pune lifestyle apartments and gated communities. MR Interiors brings engineered modular kitchens, bespoke sliding wardrobes, and turnkey home interiors with direct factory-outlet pricing to Baner, Kharadi, Hinjewadi, and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Book Pune Consultation
                </button>
                <a
                  href="tel:+919423640903"
                  className="px-8 py-3.5 rounded-full border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-2"
                >
                  Call +91 9423640903
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden border border-secondary/20 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200"
                alt="Interior Designer in Pune - MR Interiors"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">Turnkey Execution in Pune</p>
                      <p className="text-white/70 text-xs">Direct Factory Manufacturing &amp; On-Site Assembly</p>
                    </div>
                    <span className="text-secondary text-xs font-semibold px-2.5 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                      10-Year Warranty
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
              Why Pune Homeowners Choose <span className="text-secondary">MR Interiors</span>
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

        {/* Services in Pune */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Interior Solutions for Pune Residences</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Optimized for 2 BHK, 3 BHK, and duplex apartments in Pune&apos;s leading gated societies.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Complete 2 &amp; 3 BHK Interiors</h3>
                <p className="text-accent/70 text-sm mb-4">
                  Turnkey space planning, false ceiling, concealed wiring, wall textures, and complete furnishing.
                </p>
              </div>
              <Link to="/home-interiors" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                Explore Home Interiors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Modular Kitchens</h3>
                <p className="text-accent/70 text-sm mb-4">
                  BWP waterproof marine-grade kitchens with soft-close Blum &amp; Hafele hardware.
                </p>
              </div>
              <Link to="/modular-kitchens" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                Explore Kitchen Designs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Custom Storage &amp; Wardrobes</h3>
                <p className="text-accent/70 text-sm mb-4">
                  Floor-to-ceiling sliding wardrobes with space-saving internal drawers and lofts.
                </p>
              </div>
              <Link to="/wardrobes" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                Explore Wardrobes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Coverage Neighborhoods */}
        <section className="py-16 bg-secondary/5 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif mb-6">Covering Key Neighborhoods in Pune</h2>
            <p className="text-accent/70 max-w-2xl mx-auto mb-8 text-sm">
              Our Pune installation teams actively serve high-density apartment communities across:
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {puneLocalities.map((loc, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-secondary/30 bg-main/50 text-xs sm:text-sm text-accent/90">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-main/80 border-t border-white/10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-center mb-8">Pune Interior Design FAQs</h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/10 bg-secondary/5">
                <h3 className="font-medium text-white text-base mb-2">{f.question}</h3>
                <p className="text-accent/70 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location Contact Card */}
        <section className="py-16 max-w-4xl mx-auto px-4">
          <div className="rounded-3xl border border-secondary/30 bg-gradient-to-b from-secondary/10 to-main p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-serif mb-4">Request a Home Measurement in Pune</h2>
            <p className="text-accent/80 mb-6 max-w-xl mx-auto">
              Connect directly with our design leads to receive 3D floor plan recommendations and transparent estimations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <span className="flex items-center gap-2 text-secondary">
                <Phone className="w-4 h-4" /> +91 9423640903
              </span>
              <span className="flex items-center gap-2 text-secondary">
                <Mail className="w-4 h-4" /> mrtradersofficial01@gmail.com
              </span>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-transform hover:scale-105 shadow-xl"
            >
              Get Free Pune Estimation
            </button>
          </div>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
