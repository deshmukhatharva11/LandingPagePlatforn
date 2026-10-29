import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-main relative overflow-hidden">
      {/* Geometric Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        
        {/* Small geometric elements */}
        <div className="absolute left-1/4 top-1/4 w-8 h-8 border-2 border-secondary/20 rotate-45 animate-pulse" />
        <div className="absolute right-1/3 bottom-1/3 w-12 h-12 border-2 border-accent/20 rounded-full animate-pulse" />
        <div className="absolute left-2/3 top-1/2 w-6 h-6 bg-accent/20 rotate-12 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo & About */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-1 flex flex-col items-start"
          >
            <Logo showText={false} className="scale-125 mb-4" />
            <p className="text-accent/70 text-xs leading-relaxed mt-2">
              MR Interiors is Maharashtra&apos;s trusted interior design studio &amp; direct factory outlet, transforming spaces across Nashik, Pune, and Mumbai.
            </p>
          </motion.div>
          
          {/* Services Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold text-sm mb-4">Our Services</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/home-interiors" className="text-accent/80 hover:text-secondary transition-colors">Complete Home Interiors</Link>
              </li>
              <li>
                <Link to="/modular-kitchens" className="text-accent/80 hover:text-secondary transition-colors">Modular Kitchens</Link>
              </li>
              <li>
                <Link to="/wardrobes" className="text-accent/80 hover:text-secondary transition-colors">Wardrobes &amp; Furniture</Link>
              </li>
              <li>
                <Link to="/commercial-interiors" className="text-accent/80 hover:text-secondary transition-colors">Commercial Fit-Outs</Link>
              </li>
              <li>
                <Link to="/services" className="text-accent/80 hover:text-secondary transition-colors">All Services Overview</Link>
              </li>
            </ul>
          </motion.div>

          {/* Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="text-white font-semibold text-sm mb-4">Locations</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/interior-designer-nashik" className="text-accent/80 hover:text-secondary transition-colors">Interior Designer in Nashik</Link>
              </li>
              <li>
                <Link to="/interior-designer-pune" className="text-accent/80 hover:text-secondary transition-colors">Interior Designer in Pune</Link>
              </li>
              <li>
                <Link to="/interior-designer-mumbai" className="text-accent/80 hover:text-secondary transition-colors">Interior Designer in Mumbai</Link>
              </li>
              <li>
                <Link to="/about" className="text-accent/80 hover:text-secondary transition-colors">About MR Interiors</Link>
              </li>
              <li>
                <Link to="/discover" className="text-accent/80 hover:text-secondary transition-colors">Design Experience</Link>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <h3 className="text-white font-semibold text-sm mb-4">Contact &amp; Studio</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start text-accent/80">
                <MapPin className="h-4 w-4 text-secondary mr-2.5 shrink-0 mt-0.5" />
                <span className="break-words">MR Interiors &amp; Factory Outlet, Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka, Nashik - 422003, Maharashtra, India</span>
              </li>
              <li className="flex items-center text-accent/80">
                <Phone className="h-4 w-4 text-secondary mr-2.5 shrink-0" />
                <a href="tel:+919423640903" className="hover:text-secondary transition-colors">
                  +91 9423640903
                </a>
              </li>
              <li className="flex items-center text-accent/80">
                <Mail className="h-4 w-4 text-secondary mr-2.5 shrink-0" />
                <a href="mailto:mrtradersofficial01@gmail.com" className="hover:text-secondary transition-colors break-all">
                  mrtradersofficial01@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-accent/20"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://www.instagram.com/mr_traders.10"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-secondary/20 transition-colors group"
            >
              <Instagram className="h-5 w-5 text-accent group-hover:text-secondary transition-colors" />
            </a>
            <a 
              href="https://www.facebook.com/mrtradersofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-secondary/20 transition-colors group"
            >
              <Facebook className="h-5 w-5 text-accent group-hover:text-secondary transition-colors" />
            </a>
            <a 
              href="https://www.youtube.com/@mrtraders"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center hover:bg-secondary/20 transition-colors group"
            >
              <Youtube className="h-5 w-5 text-accent group-hover:text-secondary transition-colors" />
            </a>
          </div>
        </motion.div>
        
        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-xs"
        >
          <p className="text-accent/80">
            &copy; {new Date().getFullYear()} MR Interiors (MR Traders &amp; Factory Outlet). Nashik, Maharashtra. All rights reserved.
          </p>
          <p className="text-accent/50 mt-1">
            Turnkey Interior Design &amp; Execution in Nashik, Pune &amp; Mumbai.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}