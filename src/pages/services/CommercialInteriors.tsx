import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle2, Briefcase, Store, ArrowRight, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import ProjectForm from '../../components/ProjectForm';

export default function CommercialInteriors() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const commercialSpaces = [
    {
      title: 'Corporate Offices & IT Workspaces',
      desc: 'Acoustic conference rooms, executive cabins, ergonomic linear workstations, glass partitions, and smart reception lobbies.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
    },
    {
      title: 'Retail Stores & Showrooms',
      desc: 'High-impact product displays, spot-lit shelving, branded cash counters, and durable traffic-ready flooring for maximum retail conversion.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
    },
    {
      title: 'Clinics, Spas & Salons',
      desc: 'Calming patient waiting areas, hygienic sterile treatment stations, mood lighting, and concealed storage designed for wellness facilities.',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200',
    },
    {
      title: 'Restaurants, Cafes & Lounges',
      desc: 'Atmospheric dining seating, custom bar counters, acoustic ceiling treatments, and functional service kitchen partitions.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200',
    },
  ];

  const highlights = [
    {
      title: 'Fast-Track Turnaround',
      desc: 'We understand commercial downtime costs money. Pre-fabricated factory modules minimize on-site disturbance and ensure handover on time.',
    },
    {
      title: 'Commercial Durability',
      desc: 'Heavy-duty commercial hardware, fire-retardant materials, scratch-resistant HPL, and high-traffic floor finishes.',
    },
    {
      title: 'Complete MEP Integration',
      desc: 'End-to-end electrical ducting, HVAC routing, network cabling, fire safety, and biometric access provisioning.',
    },
    {
      title: 'Factory-Direct Supply',
      desc: 'Substantial cost efficiency for large multi-desk installations and custom retail fixtures straight from our factory facility.',
    },
  ];

  const faqs = [
    {
      question: 'What types of commercial projects does MR Interiors undertake in Nashik and Pune?',
      answer: 'We design and execute corporate office fit-outs, retail shops, jewelry and fashion showrooms, medical clinics, boutique hotels, and educational facilities.',
    },
    {
      question: 'Can you work during after-hours or non-operating hours for commercial spaces?',
      answer: 'Yes, for commercial spaces and operating malls, our execution teams coordinate night shifts and weekend installation to avoid disrupting business hours.',
    },
    {
      question: 'Do you provide 3D renders before commercial execution?',
      answer: 'Yes, every project includes detailed 3D photorealistic renderings and layout plans for stakeholder approvals before manufacturing commences.',
    },
  ];

  return (
    <>
      <SEO
        title="Commercial Interior Designer in Nashik, Pune & Mumbai | MR Interiors"
        description="Transform corporate offices, shops, and retail showrooms with MR Interiors. Turnkey commercial interior design and fast-track factory execution."
        canonical="/commercial-interiors"
        serviceName="Commercial Interior Design and Fit-Out"
        serviceDescription="Corporate office design, retail shop fit-outs, showroom interiors, MEP integration, and commercial turnkey execution."
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Commercial Interiors', url: '/commercial-interiors' },
        ]}
        faqs={faqs}
      />

      <div className="pt-28 bg-main text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-secondary bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20 mb-4">
                <Building2 className="w-3.5 h-3.5" /> Offices, Shops &amp; Showrooms
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6">
                Commercial Interiors that <span className="text-secondary italic">Elevate Your Brand</span>
              </h1>
              <p className="text-accent/80 text-lg leading-relaxed mb-8">
                From productive corporate workplaces to high-conversion retail showrooms, MR Interiors provides fast-track commercial fit-outs with factory precision across Nashik, Pune, and Mumbai.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" /> Request Commercial Proposal
                </button>
                <Link
                  to="/home-interiors"
                  className="px-8 py-3.5 rounded-full border border-secondary/40 text-secondary hover:bg-secondary/10 transition-colors flex items-center gap-2"
                >
                  Residential Interiors <ArrowRight className="w-4 h-4" />
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
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
                alt="Commercial Office Interiors by MR Interiors"
                className="w-full h-[450px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-transparent to-transparent flex items-end p-8">
                <div className="bg-main/80 backdrop-blur-md p-4 rounded-xl border border-white/10 w-full">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="text-secondary font-medium">Offices, Retail &amp; Showrooms</p>
                      <p className="text-white/70 text-xs">Fast-Track Turnkey Handover</p>
                    </div>
                    <span className="text-secondary text-xs font-semibold px-2.5 py-1 bg-secondary/10 rounded-full border border-secondary/20">
                      Commercial Grade
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
              Why Businesses Trust <span className="text-secondary">MR Interiors</span>
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

        {/* Commercial Sectors */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-serif mb-4">Sectors We Transform</h2>
            <p className="text-accent/70 max-w-2xl mx-auto">
              Custom-built to reflect brand identity, ergonomic employee comfort, and memorable client experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {commercialSpaces.map((cs, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-secondary/5">
                <img src={cs.image} alt={cs.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="p-6">
                  <h3 className="text-xl font-serif text-white mb-2">{cs.title}</h3>
                  <p className="text-accent/70 text-sm">{cs.desc}</p>
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
          <h2 className="text-3xl font-serif mb-4">Ready to Build Your Commercial Space?</h2>
          <p className="text-accent/70 mb-8">Discuss floor plans, material specs, and milestone timelines with our commercial design consultants.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-8 py-3.5 rounded-full bg-secondary text-main font-semibold hover:bg-secondary-600 transition-transform hover:scale-105 shadow-xl"
          >
            Get a Commercial Quote
          </button>
        </section>
      </div>

      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
