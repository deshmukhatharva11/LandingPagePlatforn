import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Award, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function NashikLocation() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const localities = [
    'Gangapur Road',
    'College Road',
    'Indira Nagar',
    'Govind Nagar',
    'Mahatma Nagar',
    'Panchavati',
    'Pathardi Phata',
    'Ashoka Marg',
    'Deolali Camp',
    'Nashik Road',
    'Cidco',
    'Satpur',
  ];

  const highlights = [
    {
      title: 'Our Flagship Nashik Studio & Factory Outlet',
      desc: 'Based at Sambhaji Nagar Road, Nandura Naka. Homeowners can physically inspect raw materials, mock-up kitchens, and hardware before ordering.',
    },
    {
      title: '1000+ Delivered Nashik Homes',
      desc: 'Over 3 decades transforming residences across Gangapur Road, Indira Nagar, and Mahatma Nagar with 5-star customer trust.',
    },
    {
      title: 'Zero Middlemen Margins',
      desc: 'Because we manufacture in our Nashik facility, you bypass showroom markups and get genuine factory-direct rates on plywood and laminates.',
    },
    {
      title: 'Strict 45-Day Delivery Promise',
      desc: 'Dedicated local teams of carpenters, civil technicians, and interior architects guarantee on-time project handover.',
    },
  ];

  const faqs = [
    {
      question: 'Where is the MR Interiors showroom & factory outlet located in Nashik?',
      answer: 'Our main office and factory outlet is located at Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka, Nashik - 422003. We are open Monday to Saturday from 9:00 AM to 7:00 PM.',
    },
    {
      question: 'Which areas in Nashik do you provide interior design and execution services?',
      answer: 'We cover all residential and commercial zones across Nashik, including Gangapur Road, College Road, Indira Nagar, Govind Nagar, Mahatma Nagar, Pathardi Phata, Ashoka Marg, Panchavati, and Deolali Camp.',
    },
    {
      question: 'Can I visit the workshop to see sample modular kitchens and wardrobes in Nashik?',
      answer: 'Absolutely. We invite clients to visit our factory outlet studio to touch and test material finishes, drawer runners, acrylic shutters, and lighting setups.',
    },
  ];

  return (
    <>
      <SEO
        title="Interior Designer in Nashik | Best Home & Modular Kitchens | MR Interiors"
        description="Looking for the best interior designer in Nashik? MR Interiors provides turnkey home interiors, modular kitchens, and wardrobes with factory-direct pricing."
        canonical="/interior-designer-nashik"
        serviceName="Interior Design and Execution in Nashik"
        serviceDescription="Turnkey residential interiors, modular kitchens, custom wardrobes, and commercial fit-outs in Nashik, Maharashtra."
        city="Nashik"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/interior-designer-nashik' },
          { name: 'Nashik', url: '/interior-designer-nashik' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <MapPin className="w-3.5 h-3.5" /> Flagship Studio &amp; Factory Outlet · Nashik
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Nashik&apos;s Most Trusted <span className="text-secondary italic">Interior Designers</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                With over 1,000 homes completed and 35+ years of local craftsmanship, MR Interiors is Nashik&apos;s leading turnkey interior design studio. We bring state-of-the-art modular kitchens, luxury wardrobes, and complete residential interiors straight from our local factory outlet to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" /> Book Free Nashik Consultation
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
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200"
                alt="Interior Designer in Nashik - MR Interiors"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">Headquarters &amp; Factory Outlet</p>
                      <p className="text-white/70 text-xs">Nilgiri Baug, Sambhaji Nagar Road, Nashik</p>
                    </div>
                    <span className="text-secondary text-xs font-semibold px-2.5 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                      35+ Years in Nashik
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why Us in Nashik */}
        <section className="py-16 bg-secondary/5 border-y border-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif text-center mb-12">
              The MR Interiors Edge in <span className="text-secondary">Nashik</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((h, i) => (
                <div key={i} className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/30 transition-all">
                  <CheckCircle2 className="w-8 h-8 text-secondary mb-4" />
                  <h3 className="font-semibold text-lg text-white mb-2">{h.title}</h3>
                  <p className="text-accent/70 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Services Offered */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Our Core Services in Nashik</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Everything under one roof: from design concepts to turnkey on-site carpentry, plumbing, and electrical.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Complete Home Interiors</h3>
                <p className="text-accent/70 text-sm mb-4">
                  Turnkey residential design for 2 BHK, 3 BHK, row houses, and luxury bungalows across Nashik.
                </p>
              </div>
              <Link to="/home-interiors" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                View Home Interiors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Modular Kitchens</h3>
                <p className="text-accent/70 text-sm mb-4">
                  Waterproof marine-grade plywood, branded soft-close German fittings, and customized spice racks.
                </p>
              </div>
              <Link to="/modular-kitchens" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                View Modular Kitchens <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-secondary/5 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif text-white mb-3">Wardrobes &amp; Commercial</h3>
                <p className="text-accent/70 text-sm mb-4">
                  Floor-to-ceiling sliding wardrobes, walk-in closets, and corporate office fit-outs in Nashik.
                </p>
              </div>
              <Link to="/wardrobes" className="text-secondary font-medium text-sm flex items-center gap-1 hover:underline">
                View Wardrobe Designs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Coverage Neighborhoods */}
        <section className="py-16 bg-secondary/5 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif mb-6">Service Coverage Across Nashik</h2>
            <p className="text-accent/70 max-w-2xl mx-auto mb-8 text-sm">
              Our site supervisors and design architects actively work in every major neighborhood of Nashik:
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {localities.map((loc, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-secondary/30 bg-main/50 text-xs sm:text-sm text-accent/90">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-main/80 border-t border-white/10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-center mb-8">Nashik Interior Design FAQs</h2>
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
            <h2 className="text-3xl font-serif mb-4">Visit Our Nashik Factory Outlet</h2>
            <p className="text-accent/80 mb-6 max-w-xl mx-auto">
              Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka, Nashik, Maharashtra 422003
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <span className="flex items-center gap-2 text-secondary">
                <Phone className="w-4 h-4" /> +91 9423640903
              </span>
              <span className="flex items-center gap-2 text-secondary">
                <Mail className="w-4 h-4" /> mrtradersofficial01@gmail.com
              </span>
              <span className="flex items-center gap-2 text-secondary">
                <Clock className="w-4 h-4" /> Mon - Sat: 9:00 AM - 7:00 PM
              </span>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-transform hover:scale-105 shadow-xl"
            >
              Book Studio Consultation
            </button>
          </div>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
