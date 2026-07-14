import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Rajesh Patil",
    role: "Homeowner, Nashik",
    content: "MR Traders completely transformed our home. The designs are beautiful, the quality is excellent, and the team was professional from start to finish. We're absolutely thrilled with the results!",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Apartment Owner, Nashik",
    content: "Best interior designers in Nashik! Their factory outlet pricing gave us premium quality at very affordable rates. Our modular kitchen is a dream come true. Highly recommended.",
    rating: 5
  },
  {
    name: "Sunil Deshmukh",
    role: "Villa Owner, Nashik",
    content: "Excellent work by the MR Traders team. They understood our requirements perfectly and delivered beyond expectations. The attention to detail is outstanding and the project was completed on time.",
    rating: 5
  },
  {
    name: "Anita Kulkarni",
    role: "Homeowner, Nashik",
    content: "We are very happy with MR Traders. From design to installation, everything was smooth and professional. Our living room now looks like it's straight out of a magazine. Wonderful experience!",
    rating: 5
  },
  {
    name: "Mahesh Pawar",
    role: "Property Owner, Nashik",
    content: "Outstanding service and quality. The team at MR Traders is knowledgeable, creative and very responsive. They helped us choose the right materials within our budget. Truly the best in Nashik.",
    rating: 5
  },
  {
    name: "Sneha Jadhav",
    role: "Residential Client, Nashik",
    content: "MR Traders turned our bare house into a beautiful home. The factory outlet concept means we got top-quality products without the inflated retail prices. Couldn't be happier!",
    rating: 5
  }
];

export default function Testimonials() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="py-24 bg-main relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif mb-4">What Our Clients Say</h2>
          <p className="text-xl text-accent max-w-2xl mx-auto">
            Over 1000 happy families in Nashik trust MR Traders for their interior design needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
                  {/* Quote mark decoration */}
                  <div className="absolute top-0 right-0 text-6xl text-secondary/10 font-serif">"</div>
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-secondary fill-secondary" />
                    ))}
                  </div>
                  
                  {/* Testimonial content */}
                  <p className="text-accent mb-6 relative z-10">
                    {testimonial.content}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-accent-gradient opacity-20 blur-lg rounded-full transition-opacity duration-500 group-hover:opacity-40" />
                      <div className="w-12 h-12 rounded-full bg-main/80 backdrop-blur-sm border border-secondary/30 flex items-center justify-center text-secondary font-serif text-sm">
                        {getInitials(testimonial.name)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-white group-hover:text-secondary transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-accent text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}