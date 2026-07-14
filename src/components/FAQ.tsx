import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What services does MR Traders offer?",
    answer: "MR Traders offers complete interior design solutions including living room design, modular kitchen design, bedroom interiors, bathroom design, false ceiling, wallpaper, flooring, and full home interior packages. As a factory outlet, we also supply premium quality materials directly."
  },
  {
    question: "Where is MR Traders located in Nashik?",
    answer: "We are located at MR Traders & Factory Outlet, Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka, Nashik-422003. You're welcome to visit our showroom to experience our designs and materials firsthand."
  },
  {
    question: "How long does a typical interior design project take?",
    answer: "Project timelines depend on scope. A single room typically takes 2–4 weeks, while a full home interior project takes 6–12 weeks. We provide a clear timeline during your initial consultation and keep you informed throughout."
  },
  {
    question: "What is the advantage of your Factory Outlet?",
    answer: "As a factory outlet, we source materials directly from manufacturers — no middlemen, no inflated retail margins. You get the same premium quality products at significantly lower prices compared to traditional interior design stores."
  },
  {
    question: "How many projects has MR Traders completed?",
    answer: "We have successfully delivered 1000+ projects across Nashik. Our portfolio includes residential homes, apartments, villas, and commercial spaces. Every project is unique and executed with the same level of care and attention to detail."
  },
  {
    question: "Do you offer free consultation?",
    answer: "Yes! We offer a free initial consultation where our expert designers assess your space, understand your requirements and budget, and present design ideas tailored to you. Call us at +91 9423640903 or send a message to get started."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-main relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-accent max-w-2xl mx-auto">
            Everything you need to know about MR Traders and our services
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 bg-secondary/10 backdrop-blur-sm rounded-xl border border-secondary/20 hover:border-secondary/50 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium pr-8">{faq.question}</h3>
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-secondary flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-secondary flex-shrink-0" />
                  )}
                </div>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-accent"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}