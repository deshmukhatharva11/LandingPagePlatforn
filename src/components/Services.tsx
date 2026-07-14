import { motion } from 'framer-motion';
import { Sofa, UtensilsCrossed, BedDouble, Store, Building2, Paintbrush2 } from 'lucide-react';

const services = [
  {
    icon: Store,
    title: 'Factory Outlet',
    description: 'Buy directly from our factory at wholesale prices. No middlemen, no markups — just premium materials, laminates, hardware, and fittings at the best prices in Nashik.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Modular Kitchen',
    description: 'Precision-engineered modular kitchens built in our own facility. Every cabinet, shutter, and fitting crafted for durability, elegance, and your exact measurements.',
  },
  {
    icon: BedDouble,
    title: 'Bedroom & Wardrobe',
    description: 'Custom wardrobes, beds, and storage solutions designed around your lifestyle. Every inch is thought through so your bedroom becomes your personal retreat.',
  },
  {
    icon: Sofa,
    title: 'Living Room Design',
    description: 'From false ceilings to wall panelling to TV units — we design living rooms that impress your guests and feel like home to your family.',
  },
  {
    icon: Building2,
    title: 'Full Home Interiors',
    description: 'Complete turnkey interior solutions. One contract, one team, zero hassle. We handle design, procurement, and execution from day one to handover.',
  },
  {
    icon: Paintbrush2,
    title: 'Commercial Spaces',
    description: 'Offices, showrooms, clinics, and restaurants across Nashik trust MR Traders to build spaces that reflect their brand and impress their clients.',
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-main relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-accent max-w-2xl mx-auto"
          >
            Complete interior design solutions — from factory outlet to your dream home
          </motion.p>
        </div>

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
              <div className="relative h-full bg-secondary/10 backdrop-blur-sm rounded-2xl border border-secondary/20 hover:border-secondary/50 transition-all duration-300 overflow-hidden">
                {/* Abstract Lines */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Circular patterns */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 border-2 border-secondary/20 rounded-full group-hover:border-secondary/40 transition-colors duration-500" />
                  <div className="absolute -bottom-16 -left-16 w-32 h-32 border-2 border-accent/20 rounded-full group-hover:border-accent/40 transition-colors duration-500" />
                  
                  {/* Diagonal lines */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 border-t-2 border-r-2 border-secondary/10 rounded-tr-full transform rotate-6 origin-bottom-left group-hover:border-secondary/30 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 border-b-2 border-l-2 border-accent/10 rounded-bl-full transform -rotate-6 origin-top-right group-hover:border-accent/30 transition-colors duration-500" />
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                <div className="relative p-8 flex flex-col items-center text-center">
                  {/* Icon with animated background */}
                  <div className="relative mb-6 transform-gpu transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute -inset-4 bg-accent-gradient opacity-20 blur-xl rounded-full transition-opacity duration-500 group-hover:opacity-40" />
                    <service.icon className="h-16 w-16 text-secondary relative z-10" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-secondary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-accent">
                    {service.description}
                  </p>

                  {/* Additional decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}