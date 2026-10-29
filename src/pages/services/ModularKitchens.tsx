import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, CheckCircle2, ShieldCheck, Flame, Droplets, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function ModularKitchens() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const kitchenTypes = [
    {
      title: 'L-Shaped Modular Kitchen',
      desc: 'Maximizes corner space with an efficient work triangle between refrigerator, sink, and cooking hob. Ideal for open-concept apartments.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200',
    },
    {
      title: 'Parallel & Island Kitchens',
      desc: 'Dual preparation counters with central breakfast bar, dedicated pull-out pantries, and integrated chimney ducting for serious home chefs.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    },
    {
      title: 'U-Shaped Kitchen Layouts',
      desc: 'Abundant countertop surface with 3-wall cabinetry, soft-close carousel units, and tall spice pull-outs.',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200',
    },
    {
      title: 'Acrylic & PU Glass Finish Kitchens',
      desc: 'Ultra high-gloss, scratch-resistant acrylic and lacquered glass shutters designed for easy wipe-down cleaning and modern aesthetics.',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200',
    },
  ];

  const highlights = [
    {
      icon: Droplets,
      title: '100% Water-Resistant Plywood',
      desc: 'Marine BWP/BWR boiling water-proof grade ply designed to handle water splashes, moisture, and humidity.',
    },
    {
      icon: ShieldCheck,
      title: 'Branded German Hardware',
      desc: 'Tandem boxes, hydraulic lift-ups, soft-close hinges from Hafele, Blum, and Hettich with life-cycle durability.',
    },
    {
      icon: Flame,
      title: 'Heat & Termite Proof',
      desc: 'Certified anti-termite and fire-retardant core boards engineered specifically for heavy Indian cooking styles.',
    },
    {
      icon: Sparkles,
      title: 'Direct Factory Outlet Savings',
      desc: 'Cut out showroom distributor margins with in-house CNC routing and edge-banding at our Nashik facility.',
    },
  ];

  const faqs = [
    {
      question: 'What materials do you use for modular kitchen cabinets in Nashik?',
      answer: 'We use IS 710 certified Marine Grade BWP Plywood for the base carcasses and sink modules, with options of Merino/Greenlam laminates, 2mm anti-scratch acrylics, or PU lacquered shutters.',
    },
    {
      question: 'How much does a modular kitchen cost with MR Interiors?',
      answer: 'Costs depend on dimensions, accessories, and shutter finishes. Because we manufacture directly at our factory outlet, typical packages start around ₹1.2 Lakhs to ₹3.5 Lakhs for premium setups, saving up to 25% compared to branded retailers.',
    },
    {
      question: 'Do you offer warranty on kitchen accessories and hardware?',
      answer: 'Yes, we provide up to a 10-year structural warranty on woodwork and manufacturer warranties on all branded soft-close hardware.',
    },
  ];

  return (
    <>
      <SEO
        title="Modular Kitchen Designer in Nashik, Pune & Mumbai | MR Interiors"
        description="Looking for modern modular kitchens? MR Interiors crafts custom L-shaped, parallel & island kitchens with waterproof plywood and factory-direct pricing."
        canonical="/modular-kitchens"
        serviceName="Modular Kitchen Design and Installation"
        serviceDescription="Customized modular kitchen manufacturing, waterproof carcass, soft-close hardware, and turnkey kitchen installation."
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Modular Kitchens', url: '/modular-kitchens' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <UtensilsCrossed className="w-3.5 h-3.5" /> Ergonomic Kitchen Design
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Modular Kitchens Built for <span className="text-secondary italic">Indian Cooking</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                Experience seamless cooking with intelligent modular kitchens crafted by MR Interiors. Built with waterproof marine-grade plywood, soft-close German hardware, and direct factory outlet pricing in Nashik, Pune, and Mumbai.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Get Free Kitchen 3D Layout
                </button>
                <Link
                  to="/home-interiors"
                  className="px-8 py-3.5 rounded-full border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-2"
                >
                  Full Home Interiors <ArrowRight className="w-4 h-4" />
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
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200"
                alt="Modern Modular Kitchen by MR Interiors Nashik"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">BWP Waterproof Core</p>
                      <p className="text-white/70 text-xs">Hafele & Hettich Hardware</p>
                    </div>
                    <span className="text-secondary text-xs font-semibold px-2.5 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                      Factory Direct
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-16 bg-secondary/5 border-y border-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif text-center mb-12">
              Engineered For Durability &amp; Daily Convenience
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((h, i) => (
                <div key={i} className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/30 transition-all">
                  <h.icon className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="font-semibold text-lg text-white mb-2">{h.title}</h3>
                  <p className="text-accent/70 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kitchen Layout Types */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Choose Your Kitchen Style</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Customized to fit your floor plan, cooking habits, and appliance configurations with laser-measured accuracy.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {kitchenTypes.map((k, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-secondary/5">
                <img src={k.image} alt={k.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-serif text-white mb-2">{k.title}</h3>
                  <p className="text-accent/70 text-sm">{k.desc}</p>
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
          <h2 className="text-3xl font-serif mb-4">Upgrade Your Kitchen with Factory Prices</h2>
          <p className="text-accent/70 mb-8">Visit our showroom factory outlet at Sambhaji Nagar Road, Nashik or schedule an in-home measurement today.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-transform hover:scale-105 shadow-xl"
          >
            Request Quotation &amp; 3D Design
          </button>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
