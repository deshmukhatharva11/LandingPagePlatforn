import { buildReport, type Answers } from './report';

export interface ShowcaseProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  video?: string;
  styles: string[]; // quiz philosophies this project represents (for personalization)
}

// Reuses the existing project assets; `styles` map each project to quiz philosophies.
export const PROJECTS: ShowcaseProject[] = [
  { id: 'mr-traders-project-1', title: 'Elegant Master Bedroom', category: 'Bedroom Interior · Nashik', description: 'Spacious master bedroom featuring custom drapery, ambient lighting, and premium finishes.', image: '', video: '/videos/1.mp4', styles: ['Luxe Italian', 'Scandinavian Calm', 'Warm Wood'] },
  { id: 'mr-traders-project-2', title: 'Divine Pooja Room', category: 'Mandir Design · Nashik', description: 'Exquisite custom backlit wooden jaali panels and mandir design for a serene prayer space.', image: '', video: '/videos/2.mp4', styles: ['Indian Contemporary', 'Warm Wood'] },
  { id: 'mr-traders-project-3', title: 'Modern Modular Kitchen', category: 'Kitchen Interior · Nashik', description: 'Sleek modular kitchen featuring high-gloss shutters, profile handles, and an elegant arch entrance.', image: '', video: '/videos/3.mp4', styles: ['Handleless Minimal', 'Modern Contemporary'] },
  { id: 'mr-traders-project-4', title: 'Contemporary Living Room', category: 'Living Room · Contemporary', description: 'Luxury TV unit featuring fluted wooden panels, marble backdrops, and floating cabinets.', image: '', video: '/videos/4.mp4', styles: ['Modern Contemporary', 'Indian Contemporary'] },
  { id: 'mr-traders-project-5', title: 'Italian Modular Kitchen', category: 'Kitchen Interior · Premium', description: 'High-gloss finish modular kitchen layout with built-in appliances and optimal work triangle.', image: '', video: '/videos/5.mp4', styles: ['Luxe Italian', 'Italian Modular', 'Handleless Minimal'] },
  { id: 'mr-traders-project-6', title: 'Wardrobe & Dressing Unit', category: 'Wardrobe · Custom', description: 'Sliding wardrobe design with integrated dresser, custom shelving, and warm internal lighting.', image: '', video: '/videos/6.mp4', styles: ['Modern Contemporary', 'Scandinavian', 'Scandinavian Calm'] },
  { id: 'mr-traders-project-7', title: 'False Ceiling & Rafters', category: 'Ceiling Design · Nashik', description: 'Modern gypsum board false ceiling featuring wooden rafters and concealed LED cove lighting.', image: '', video: '/videos/7.mp4', styles: ['Modern Contemporary', 'Luxe Glass'] },
  { id: 'mr-traders-project-8', title: 'Kids Room & Study Unit', category: 'Kids Room · Custom', description: 'Fun and functional children\'s bedroom featuring study table, storage options, and cozy lighting.', image: '', video: '/videos/8.mp4', styles: ['Indian Contemporary', 'Warm Wood'] },
  { id: 'mr-traders-project-9', title: 'Modern Dining Space', category: 'Dining Area · Premium', description: 'A warm and inviting dining space with custom table setup, designer pendant light, and cozy seating.', image: '', video: '/videos/9.mp4', styles: ['Classic European', 'Luxe Italian', 'Modern Contemporary'] },
];

export interface ShowcaseTestimonial {
  name: string;
  role: string;
  content: string;
}

export const TESTIMONIALS: ShowcaseTestimonial[] = [
  { name: 'Rajesh Patil', role: 'Homeowner, Nashik', content: 'MR Traders completely transformed our home. The designs are beautiful, the quality is excellent, and the team was professional from start to finish. We\'re absolutely thrilled!' },
  { name: 'Priya Sharma', role: 'Apartment Owner, Nashik', content: 'Best interior designers in Nashik! Their factory outlet pricing gave us premium quality at very affordable rates. Our modular kitchen is a dream come true.' },
  { name: 'Sunil Deshmukh', role: 'Villa Owner, Nashik', content: 'Excellent work by the MR Traders team. They understood our requirements perfectly and delivered beyond expectations. The project was completed on time.' },
  { name: 'Anita Kulkarni', role: 'Homeowner, Nashik', content: 'We are very happy with MR Traders. From design to installation, everything was smooth and professional. Our living room looks wonderful!' },
  { name: 'Mahesh Pawar', role: 'Property Owner, Nashik', content: 'Outstanding service and quality. The team at MR Traders is knowledgeable and responsive. They helped us choose the right materials within our budget.' },
  { name: 'Sneha Jadhav', role: 'Residential Client, Nashik', content: 'MR Traders turned our house into a beautiful home. The factory outlet concept means we got top-quality products without inflated retail prices.' },
];

export const WHATSAPP_NUMBER = '919423640903';
export const STUDIO_PHONE = '+91 9423640903';
export const STUDIO_EMAIL = 'mrtradersofficial01@gmail.com';
export const STUDIO_INSTAGRAM = 'https://www.instagram.com/mr_traders.10';

export function rankProjects(answers: Answers): { matched: ShowcaseProject[]; rest: ShowcaseProject[] } {
  const set = new Set(buildReport(answers).philosophies);
  const scored = PROJECTS.map((p) => ({ p, score: p.styles.filter((s) => set.has(s)).length }));
  const matched = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.p);
  const rest = scored.filter((x) => x.score === 0).map((x) => x.p);
  return { matched, rest };
}

export function whatsappLink(answers: Answers): string {
  const label = buildReport(answers).label;
  const msg = `Hi MR Traders! I just completed your style quiz — my design style is "${label}". I'd love to talk about my home interiors.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
