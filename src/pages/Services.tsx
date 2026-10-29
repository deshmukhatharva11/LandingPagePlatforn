import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sofa, UtensilsCrossed, BedDouble, Bath, Layers, Armchair, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import SEO from '../components/SEO';

const services = [
  {
    icon: Sofa,
    title: 'Living Room Design',
    description: 'Transform your living room into a stunning statement space. We blend comfort, style, and functionality to create the perfect gathering place for your family.',
    features: [
      'Custom Sofa & Seating Layouts',
      'Designer TV Unit Backdrops',
      'Accent Wall Wallpaper & Panels',
      'Lighting & False Ceiling Integration'
    ],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000'
  },
  {
    icon: UtensilsCrossed,
    title: 'Modular Kitchens',
    description: 'Our state-of-the-art modular kitchens combine modern aesthetics with maximum practicality. Factory-direct materials ensure premium finishes at unbeatable prices.',
    features: [
      'L-Shaped, U-Shaped, Parallel & Island Layouts',
      'Waterproof Board & Anti-Scratch Laminate',
      'Premium Soft-Close Hardware & Accessories',
      'Custom Chimney & Built-In Appliance Slots'
    ],
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2000'
  },
  {
    icon: BedDouble,
    title: 'Bedroom Interiors',
    description: 'Create your personal sanctuary with our custom bedroom designs. Every element — from wardrobes to lighting — is curated to bring you ultimate comfort.',
    features: [
      'Sliding & Open Wardrobe Solutions',
      'Custom Headboard & Bed Frame Designs',
      'Integrated Dressing Units & Workstations',
      'Warm & Ambient Lighting Schemes'
    ],
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000'
  },
  {
    icon: Bath,
    title: 'Bathroom Design & Styling',
    description: 'Elevate your bathrooms with smart space layout and modern styling. We focus on choosing durable, moisture-resistant, and premium materials.',
    features: [
      'Anti-Slip Tiles & Wall Panel Matchmaking',
      'Custom Vanity Counters & Storage Cabinets',
      'Dry & Wet Zone Segregation Layouts',
      'Premium Branded Sanitaryware Selection'
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000'
  },
  {
    icon: Layers,
    title: 'False Ceiling & Lighting',
    description: 'Dramatically change the mood of any room with custom false ceilings. We design drop, tray, and cove ceilings fitted with smart LED lighting.',
    features: [
      'Premium Gypsum & Wooden Ceiling Layouts',
      'Energy-Efficient Concealed LED Lighting',
      'Strategic Fan & Air-Vent Placement',
      'Professional Finish & Seamless Jointing'
    ],
    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=2000'
  },
  {
    icon: Armchair,
    title: 'Custom Furnishings & Factory Outlet Supply',
    description: 'As a direct factory outlet, we provide custom-built furniture, loose chairs, wall paneling, and other premium interior supplies at wholesale prices.',
    features: [
      'Custom Sofa, Dining Table & Sofa-Cum-Beds',
      'Factory-Direct Quality & Wholesaling Rates',
      'Wide Selection of Fabrics, Veneers & Laminates',
      'Crafted to Order to Fit Your Exact Room Sizes'
    ],
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2000'
  }
];

export default function Services() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Interior Design & Execution Services in Nashik | MR Interiors"
        description="Comprehensive interior services: Full home interiors, modular kitchens, custom wardrobes, and commercial fit-outs in Nashik, Pune & Mumbai."
        canonical="/services"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />
      <div className="pt-32 bg-main">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000"
              alt="MR Interiors Services Nashik"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-main via-main/90 to-main" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif mb-6"
            >
              Our <span className="text-secondary">Services</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-accent max-w-3xl mx-auto mb-8"
            >
              Professional turnkey interior design and premium factory outlet supply directly to your home
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => setIsFormOpen(true)}
              className="px-8 py-3 bg-secondary text-main rounded-md hover:bg-secondary-600 transition-all duration-300 transform hover:scale-105"
            >
              Get Free Consultation
            </motion.button>
          </div>
        </section>

        {/* Dedicated Service Category Hub */}
        <section className="py-12 bg-secondary/5 border-y border-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-serif text-center mb-8">Specialized Interior Solutions</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/home-interiors" className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/40 transition-all group">
                <h3 className="font-serif text-lg text-white mb-2 group-hover:text-secondary transition-colors">Complete Home Interiors</h3>
                <p className="text-accent/70 text-xs mb-4">Turnkey 2 & 3 BHK interior execution with factory pricing.</p>
                <span className="text-secondary text-xs font-medium flex items-center gap-1">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <Link to="/modular-kitchens" className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/40 transition-all group">
                <h3 className="font-serif text-lg text-white mb-2 group-hover:text-secondary transition-colors">Modular Kitchens</h3>
                <p className="text-accent/70 text-xs mb-4">Waterproof marine ply, soft-close Blum/Hafele hardware.</p>
                <span className="text-secondary text-xs font-medium flex items-center gap-1">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <Link to="/wardrobes" className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/40 transition-all group">
                <h3 className="font-serif text-lg text-white mb-2 group-hover:text-secondary transition-colors">Wardrobes & Furniture</h3>
                <p className="text-accent/70 text-xs mb-4">Floor-to-ceiling sliding systems and custom woodwork.</p>
                <span className="text-secondary text-xs font-medium flex items-center gap-1">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
              <Link to="/commercial-interiors" className="p-6 rounded-2xl bg-main/60 border border-white/10 hover:border-secondary/40 transition-all group">
                <h3 className="font-serif text-lg text-white mb-2 group-hover:text-secondary transition-colors">Commercial Fit-Outs</h3>
                <p className="text-accent/70 text-xs mb-4">Offices, retail shops, and showroom execution.</p>
                <span className="text-secondary text-xs font-medium flex items-center gap-1">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-main relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-secondary/10 backdrop-blur-sm border border-secondary/20 hover:border-secondary/50 transition-all duration-300">
                    <div className="relative p-8">
                      <service.icon className="h-16 w-16 text-secondary mb-6" />
                      <h3 className="text-2xl font-serif text-white mb-4">{service.title}</h3>
                      <p className="text-accent mb-6">{service.description}</p>
                      <ul className="space-y-3">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-accent">
                            <span className="w-2 h-2 rounded-full bg-secondary mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <ProjectForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </>
  );
}