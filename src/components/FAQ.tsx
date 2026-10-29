import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What services does MR Interiors offer in Nashik?",
    answer: "MR Interiors (formerly MR Traders & Factory Outlet) offers end-to-end interior design solutions including complete home interiors, modular kitchen design and installation, custom wardrobes and walk-in closets, bedroom interiors, living room design, false ceilings, wallpaper installation, flooring solutions, and full turnkey interior packages. As a direct factory outlet located in Nashik, we also supply BWR/BWP grade plywood, Hafele and Hettich hardware, and premium laminate finishes at wholesale prices."
  },
  {
    question: "Where is MR Interiors located and what are the visiting hours?",
    answer: "MR Interiors & Factory Outlet is located at Nilgiri Baug, Sambhaji Nagar Road, Nandura Naka, Nashik - 422003, Maharashtra, India. Our studio and showroom are open Monday through Saturday from 9:00 AM to 7:00 PM. You're welcome to visit to experience our design gallery and see material samples firsthand. Call +91 9423640903 to book an appointment."
  },
  {
    question: "How long does a complete home interior project take at MR Interiors?",
    answer: "At MR Interiors, a single room project typically takes 2–4 weeks, while a full home interior project (2 BHK or 3 BHK apartment) takes 35–55 working days. We follow a committed 45-day installation cycle for standard projects with milestone-based tracking, continuous supervisor updates, and transparent timelines provided during your initial consultation."
  },
  {
    question: "What is the advantage of MR Interiors' factory outlet pricing model?",
    answer: "MR Interiors operates as a direct factory outlet, sourcing and manufacturing materials at our Nashik facility. This eliminates middlemen and retail markups, saving homeowners 20-30% compared to traditional interior design stores. You get the same premium quality products – including BWR/BWP grade plywood, Hafele hardware, and imported laminates – at significantly lower prices."
  },
  {
    question: "How many interior design projects has MR Interiors completed?",
    answer: "MR Interiors has successfully delivered over 1,000 interior design projects across Nashik, Pune, and Mumbai over our 35+ year history. Our portfolio spans residential homes, apartments, villas, row houses, and commercial spaces including offices, retail stores, and restaurants. Every project includes a 10-year warranty on modular furniture."
  },
  {
    question: "Does MR Interiors offer a free interior design consultation?",
    answer: "Yes, MR Interiors offers a complimentary initial consultation. Our expert interior designers will assess your space, understand your requirements and budget, and present design ideas tailored specifically for you. Call us at +91 9423640903 or fill out our online contact form to schedule a free site visit in Nashik, Pune, or Mumbai."
  },
  {
    question: "Which cities does MR Interiors serve?",
    answer: "MR Interiors provides turnkey interior design and execution services across three major Maharashtra cities: Nashik (headquarters and factory outlet), Pune, and Mumbai. Our Nashik studio is the primary design and manufacturing hub, while dedicated project teams operate full-time in Pune and Mumbai."
  },
  {
    question: "What warranty does MR Interiors provide on interior work?",
    answer: "MR Interiors provides a comprehensive 10-year warranty on all modular furniture, kitchens, and wardrobe installations. This covers manufacturing defects, hardware performance, and structural integrity. We use only branded hardware from Hafele, Hettich, and Blum, and BWR/BWP grade plywood to ensure long-lasting quality."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-main relative overflow-hidden" id="faq" itemScope itemType="https://schema.org/FAQPage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-accent max-w-2xl mx-auto">
            Everything you need to know about MR Interiors and our interior design services in Nashik
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
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 bg-secondary/10 backdrop-blur-sm rounded-xl border border-secondary/20 hover:border-secondary/50 transition-all duration-300"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium pr-8" itemProp="name">{faq.question}</h3>
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-secondary flex-shrink-0" />
                  ) : (
                    <Plus className="h-5 w-5 text-secondary flex-shrink-0" />
                  )}
                </div>
                <div
                  id={`faq-answer-${index}`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  {/* Always render answer in DOM for crawlers; visually toggle */}
                  <p
                    itemProp="text"
                    className={`mt-4 text-accent transition-all duration-300 ${
                      openIndex === index ? 'block' : 'hidden'
                    }`}
                  >
                    {faq.answer}
                  </p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}