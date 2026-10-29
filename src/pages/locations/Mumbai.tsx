import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Award, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function MumbaiLocation() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mumbaiLocalities = [
    'Andheri',
    'Bandra',
    'Powai',
    'Thane',
    'Navi Mumbai',
    'Borivali',
    'Goregaon',
    'Juhu',
    'Dadar',
    'Chembur',
    'Malad',
    'Kandivali',
  ];

  const benefits = [
    {
      title: 'Space-Saving Mumbai Apartment Layouts',
      desc: 'Expertise in optimizing square footage with concealed pull-out tables, hydraulic bed storage, compact breakfast counters, and floor-to-ceiling lofts.',
    },
    {
      title: 'Off-Site Precision Factory Fabrication',
      desc: 'Society regulations in Mumbai strictly limit messy on-site carpentry work. We manufacture everything off-site at our factory, ensuring quiet, fast 5-day on-site assembly.',
    },
    {
      title: 'Moisture & Coastal Climate Protection',
      desc: 'Mumbai’s humid coastal climate demands marine-grade IS 710 BWP plywood and anti-corrosive hardware that resists rust and swelling.',
    },
    {
      title: 'Factory-Direct Pricing Advantage',
      desc: 'Mumbai interior firms often charge heavy luxury overheads. Sourcing through our direct manufacturing model saves up to 20% to 30% without sacrificing quality.',
    },
  ];

  const faqs = [
    {
      question: 'How do you handle society permissions and noisy work in Mumbai apartments?',
      answer: 'Because all modular cabinets, wardrobes, and furniture components are pre-cut and pre-finished in our factory, on-site work is limited to clean assembly and fitting, complying easily with Mumbai residential society rules.',
    },
    {
      question: 'Which areas in Mumbai, Thane, and Navi Mumbai do you cover?',
      answer: 'We provide interior design consultations and project execution across Western Suburbs (Bandra to Borivali), Central Suburbs (Powai, Chembur, Ghatkopar), Thane, and Navi Mumbai.',
    },
    {
      question: 'What materials do you recommend for Mumbai homes due to coastal humidity?',
      answer: 'We strongly recommend 100% BWP Marine Plywood for all kitchen base units and bathroom vanities, combined with rust-proof stainless steel 304 grade soft-close hinges and handles.',
    },
  ];

  return (
    <>
      <SEO
        title="Interior Designer in Mumbai | Space-Saving Home Interiors | MR Interiors"
        description="Looking for modern interior design in Mumbai? MR Interiors specializes in space-saving home interiors, modular kitchens, and custom wardrobes with factory-direct pricing. Call +91 9423640903."
        canonical="/interior-designer-mumbai"
        serviceName="Interior Design and Execution in Mumbai"
        serviceDescription="Turnkey residential interiors, space-saving modular kitchens, custom wardrobes, and fit-outs across Mumbai, Thane, and Navi Mumbai."
        city="Mumbai"
        keywords="interior designer in Mumbai, home interiors Mumbai, modular kitchen Mumbai, wardrobe designer Mumbai, best interior designer Mumbai, flat interior design Mumbai, compact home interior Mumbai, space saving furniture Mumbai"
        includeRating={true}
        speakableAnswer="MR Interiors serves Mumbai, Thane, and Navi Mumbai with space-saving interior design solutions. Manufactured at their Nashik factory outlet, they deliver modular kitchens, compact wardrobes, and complete home interiors optimized for Mumbai's smaller apartment sizes. Factory-direct pricing saves Mumbai homeowners 20-30%. Call +91 9423640903 for a free Mumbai consultation."
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/interior-designer-mumbai' },
          { name: 'Mumbai', url: '/interior-designer-mumbai' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <MapPin className="w-3.5 h-3.5" /> Space-Saving Architecture · Mumbai &amp; Thane
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Smart &amp; Luxury Home Interiors in <span className="text-secondary italic">Mumbai</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                Designed for high-rise living in Mumbai, Thane, and Navi Mumbai. MR Interiors transforms apartments into spacious sanctuaries with space-saving modular kitchens, sleek sliding wardrobes, and turnkey execution straight from our factory outlet.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Book Mumbai Consultation
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
                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200"
                alt="Interior Designer in Mumbai - MR Interiors"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">Engineered for Mumbai High-Rises</p>
                      <p className="text-white/70 text-xs">Low-Noise Off-Site Fabrication &amp; Rapid Fitting</p>
                    </div>
                    <span className="text-secondary text-xs font-semibold px-2.5 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                      BWP Moisture Resistant
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
              Why Mumbai Residents Choose <span className="text-secondary">MR Interiors</span>
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

        {/* Services in Mumbai */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Space-Efficient Mumbai Interior Services</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Engineered specifically to maximize living space, air circulation, and natural light.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Compact &amp; Island Kitchens</h3>
                <p className="text-accent/70 text-sm mb-4">
                  L-shaped and parallel modular kitchens with pull-out spice units and concealed chimney channels.
                </p>
              </div>
              <Link to="/modular-kitchens" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                Explore Kitchen Designs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Sliding Wardrobes</h3>
                <p className="text-accent/70 text-sm mb-4">
                  Full-height sliding shutters that save floor clearance while maximizing vertical storage.
                </p>
              </div>
              <Link to="/wardrobes" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                Explore Wardrobes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Turnkey Home Interiors</h3>
                <p className="text-accent/70 text-sm mb-4">
                  End-to-end design, lighting, paint, false ceiling, and furniture for 1, 2, 3 BHK &amp; penthouses.
                </p>
              </div>
              <Link to="/home-interiors" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                Explore Home Interiors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Coverage Neighborhoods */}
        <section className="py-16 bg-secondary/5 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif mb-6">Serving Across Mumbai, Thane &amp; Navi Mumbai</h2>
            <p className="text-accent/70 max-w-2xl mx-auto mb-8 text-sm">
              Our regional teams provide direct on-site consultation and installation across:
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {mumbaiLocalities.map((loc, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-secondary/30 bg-main/50 text-xs sm:text-sm text-accent/90">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-main/80 border-t border-white/10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-center mb-8">Mumbai Interior Design FAQs</h2>
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
            <h2 className="text-3xl font-serif mb-4">Schedule an In-Home Consultation in Mumbai</h2>
            <p className="text-accent/80 mb-6 max-w-xl mx-auto">
              Speak with our senior interior consultants to plan layouts and material specifications.
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
              Get Free Mumbai Estimation
            </button>
          </div>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
