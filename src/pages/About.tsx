import { useEffect } from 'react';
import { Award, Users, Clock, Sparkles, Rocket, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Projects Delivered', value: '1000+' },
  { label: 'All Over Team', value: '100+' },
  { label: 'Years in Nashik', value: '35+' },
  { label: 'Design Experts', value: '25+' }
];

const values = [
  {
    icon: Award,
    title: 'Excellence in Every Detail',
    description: 'We believe every space deserves the best. From materials to craftsmanship, MR Traders maintains the highest standards across all 1000+ projects we have delivered.'
  },
  {
    icon: Users,
    title: 'Client-First Approach',
    description: 'Your vision is our mission. We work closely with every client to understand their unique needs, lifestyle, and budget before presenting a single design concept.'
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We respect your time as much as we respect your space. Our project management ensures timelines are met without compromising on quality or finish.'
  },
  {
    icon: Sparkles,
    title: 'Factory Outlet Advantage',
    description: 'As a factory outlet, we source directly from manufacturers, passing the savings directly to you. Premium quality materials at wholesale prices — no middlemen.'
  },
  {
    icon: Rocket,
    title: 'End-to-End Solutions',
    description: 'From initial design to final installation, we handle everything. You deal with one team, one point of contact — no coordination stress for you.'
  },
  {
    icon: Trophy,
    title: 'Trusted by Nashik',
    description: 'Over a decade of serving Nashik\'s families has built us a reputation that speaks for itself. Our clients come back, and they refer their friends and family to us.'
  }
];

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 bg-main">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000"
            alt="MR Traders Interior Design Nashik"
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
            Nashik's Most Trusted <span className="text-secondary">Interior Design Studio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-accent max-w-3xl mx-auto"
          >
            MR Traders & Factory Outlet has been transforming homes across Nashik for over a decade.
            With 1000+ successful projects, we bring expertise, creativity, and factory-direct value to every space we design.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-main relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="text-center relative overflow-hidden p-6 rounded-2xl bg-secondary/10 backdrop-blur-sm border border-secondary/20 hover:border-secondary/50 transition-all duration-500">
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

                  {/* Stats content with animation */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10"
                  >
                    <div className="text-4xl font-serif text-secondary mb-2 transform group-hover:scale-110 transition-transform duration-500">
                      {stat.value}
                    </div>
                    <div className="text-accent group-hover:text-white transition-colors duration-500">
                      {stat.label}
                    </div>
                  </motion.div>

                  {/* Decorative elements */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-accent/20 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-main relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif mb-4">Why MR Traders?</h2>
            <p className="text-xl text-accent max-w-2xl mx-auto">
              What makes us Nashik's preferred interior design partner — for over a decade and counting.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 bg-secondary/10 backdrop-blur-sm rounded-2xl border border-secondary/20 hover:border-secondary/50 transition-all duration-300 h-full overflow-hidden">
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

                  <div className="relative">
                    {/* Icon with animated background */}
                    <div className="relative mb-6 transform-gpu transition-transform duration-500 group-hover:scale-110">
                      <div className="absolute -inset-4 bg-accent-gradient opacity-20 blur-xl rounded-full transition-opacity duration-500 group-hover:opacity-40" />
                      <value.icon className="h-12 w-12 text-secondary relative z-10" />
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-secondary transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-accent">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}