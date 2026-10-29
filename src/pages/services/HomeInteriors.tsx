import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, CheckCircle2, Shield, Sparkles, ArrowRight, PhoneCall, Layers, Palette, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function HomeInteriors() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: 'Turnkey Design & Execution',
      description: 'From 2D/3D layouts to on-site carpentry, civil work, electrical, false ceilings, and painting.',
    },
    {
      title: 'Factory-Direct Pricing',
      description: 'Manufactured at our dedicated factory outlet with no middleman markups, saving up to 20-30%.',
    },
    {
      title: '10-Year Warranty & Quality Guarantee',
      description: 'Using BWR/BWP grade plywood, branded hardware (Hafele, Hettich), and premium acrylic/PU laminates.',
    },
    {
      title: 'Transparent Timelines',
      description: 'Committed 45-day installation cycle with milestone-based tracking and continuous supervisor updates.',
    },
  ];

  const spaces = [
    {
      name: 'Living & Dining Rooms',
      desc: 'Elegant TV units, Italian marble accents, bespoke seating, fluted panels, and custom dining setups.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200',
    },
    {
      name: 'Master & Guest Bedrooms',
      desc: 'Floor-to-ceiling wardrobes, cushioned headboards, study desks, and serene mood lighting designs.',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200',
    },
    {
      name: 'Modular Kitchens & Pantries',
      desc: 'Ergonomic L-shape, U-shape, and parallel kitchens engineered for Indian cooking styles.',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200',
    },
    {
      name: 'Pooja Mandir & Spiritual Zones',
      desc: 'Custom CNC jaali work, warm LED backlighting, Corian temples, and dedicated brass fixture provisions.',
      image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b12?q=80&w=1200',
    },
  ];

  const faqs = [
    {
      question: 'What is included in MR Interiors complete home interior package?',
      answer: 'Our turnkey home interior service covers space planning, 3D visualization, modular kitchen, custom wardrobes, TV unit, false ceiling with LED lights, wall treatments, painting, electrical modifications, and loose furniture solutions.',
    },
    {
      question: 'How long does a full home interior project take in Nashik, Pune, or Mumbai?',
      answer: 'Typically, residential projects range from 35 to 55 working days depending on the apartment size (2 BHK, 3 BHK, or luxury villa) and customized design requirements.',
    },
    {
      question: 'Do you offer factory-outlet direct material selection?',
      answer: 'Yes, clients can visit our Nashik factory outlet studio to inspect raw boards, hardware, laminates, and finishes in person before execution begins.',
    },
  ];

  return (
    <>
      <SEO
        title="Complete Home Interiors in Nashik, Pune & Mumbai | MR Interiors"
        description="Transform your home with MR Interiors. Turnkey residential interior design, customized furniture, and factory-direct quality across Nashik, Pune, and Mumbai. 10-year warranty. Call +91 9423640903."
        canonical="/home-interiors"
        serviceName="Complete Home Interiors"
        serviceDescription="Full home residential interior design, modular furniture manufacturing, false ceiling, and turnkey execution."
        keywords="home interiors Nashik, complete home interior design, residential interior designer Nashik, 2BHK interior design Nashik, 3BHK interior Nashik, home decoration Nashik, turnkey interiors Nashik"
        includeRating={true}
        speakableAnswer="MR Interiors offers complete home interior packages in Nashik, Pune, and Mumbai starting from turnkey design to on-site installation. Their services include living room design, bedroom interiors, modular kitchens, false ceilings, and custom furniture. With factory-direct pricing, homeowners save 20-30%. Projects are completed within 45 days with a 10-year warranty."
        howToSteps={[
          { name: 'Free Site Visit & Measurement', text: 'Our interior designer visits your home for free to take precise measurements and understand your lifestyle requirements.' },
          { name: 'Custom 3D Design & Quotation', text: 'Receive photorealistic 3D renders of every room with itemized transparent pricing within 5 working days.' },
          { name: 'Material Selection at Factory Outlet', text: 'Visit our Nashik factory outlet to personally select plywood, laminates, hardware, and finishes.' },
          { name: 'Manufacturing & Quality Check', text: 'Your custom furniture is precision-manufactured at our Nashik facility with multiple quality checkpoints.' },
          { name: 'On-Site Installation & Handover', text: 'Our trained carpenter team installs everything on-site within the committed 45-day timeline, followed by a thorough final walkthrough.' },
        ]}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Home Interiors', url: '/home-interiors' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Turnkey Residential Solutions
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Complete Home Interiors Crafted with <span className="text-secondary italic">Factory Precision</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                From luxury apartments to independent villas, MR Interiors delivers turnkey interior design and execution. We blend bespoke aesthetics with direct factory manufacturing to build dream homes without contractor delays or hidden costs.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Book Design Consultation
                </button>
                <Link
                  to="/interior-designer-nashik"
                  className="px-8 py-3.5 rounded-full border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-2"
                >
                  Explore Nashik Projects <ArrowRight className="w-4 h-4" />
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
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200"
                alt="Complete Home Interiors by MR Interiors"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">1000+ Projects Completed</p>
                      <p className="text-white/70 text-xs">Nashik · Pune · Mumbai</p>
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

        {/* Feature Grid */}
        <section className="py-16 bg-secondary/5 border-y border-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif text-center mb-12">
              Why Homeowners Choose <span className="text-secondary">MR Interiors</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/30 transition-all">
                  <CheckCircle2 className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="font-semibold text-lg text-white mb-2">{feat.title}</h3>
                  <p className="text-accent/70 text-sm leading-relaxed">{feat.desc || feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spaces Covered */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Complete Living Spaces Tailored For You</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Every corner of your residence designed for everyday luxury, practical storage, and long-term durability.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {spaces.map((sp, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-secondary/5">
                <img src={sp.image} alt={sp.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-serif text-white mb-2">{sp.name}</h3>
                  <p className="text-accent/70 text-sm">{sp.desc}</p>
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
          <h2 className="text-3xl font-serif mb-4">Ready to Plan Your Dream Home?</h2>
          <p className="text-accent/70 mb-8">Meet our principal interior architects in Nashik or request an on-site consultation in Pune and Mumbai.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-transform hover:scale-105 shadow-xl"
          >
            Get Free Estimation & Layout
          </button>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
