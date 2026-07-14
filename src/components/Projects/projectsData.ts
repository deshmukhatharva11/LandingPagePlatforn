import { LucideIcon, HomeIcon, Layout, Bed, Tv, Box, Layers, User, Briefcase } from 'lucide-react';

export interface Designer {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  videoUrl: string;
  mainImage: string;
  images: string[];
  features: string[];
  designer: Designer;
  stats: {
    area: string;
    duration: string;
    cost: string;
  };
}

export const projects: Project[] = [
  {
    id: 'mr-traders-project-1',
    title: "Elegant Master Bedroom",
    category: "Bedroom Interior · Nashik",
    location: "Nashik, India",
    year: "2024",
    description: "Spacious master bedroom featuring custom drapery, ambient lighting, and premium finishes. Perfect layout designed for premium comfort.",
    videoUrl: "/videos/1.mp4",
    mainImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1000",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1000"
    ],
    features: [
      "Plush velvet upholstered headboard",
      "Custom wall paneling",
      "Warm wooden texture flooring",
      "Bedside custom pendants"
    ],
    designer: {
      name: "Neha Kulkarni",
      role: "Senior Designer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
      bio: "Neha is known for her warm, livable design concepts and detailed space styling."
    },
    stats: {
      area: "220 sq ft",
      duration: "3 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-2',
    title: "Divine Pooja Room",
    category: "Mandir Design · Nashik",
    location: "Nashik, India",
    year: "2024",
    description: "Exquisite custom backlit wooden jaali panels and mandir design for a serene prayer space. Tailored to fit elegantly into modern Indian homes.",
    videoUrl: "/videos/2.mp4",
    mainImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000"
    ],
    features: [
      "Custom wood carving",
      "Integrated warm LED backlight panels",
      "Drawer storage for prayer items",
      "Premium lacquer finish"
    ],
    designer: {
      name: "Siddharth Shah",
      role: "Lead Interior Designer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      bio: "Siddharth specializes in space-saving layout solutions and premium details."
    },
    stats: {
      area: "40 sq ft",
      duration: "2 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-3',
    title: "Modern Modular Kitchen",
    category: "Kitchen Interior · Nashik",
    location: "Nashik, India",
    year: "2024",
    description: "Sleek modular kitchen featuring high-gloss shutters, profile handles, and an elegant arch entrance. The layout optimizes the work triangle for maximum efficiency.",
    videoUrl: "/videos/3.mp4",
    mainImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1000",
      "https://images.unsplash.com/photo-1556909212-d5b604ad0567?q=80&w=1000"
    ],
    features: [
      "Soft-close tandem drawers",
      "Quartz countertop & backsplash",
      "Integrated chimney & hob",
      "LED under-cabinet profile lighting"
    ],
    designer: {
      name: "Siddharth Shah",
      role: "Lead Interior Designer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      bio: "Siddharth specializes in ergonomic kitchen planning and premium space optimization."
    },
    stats: {
      area: "180 sq ft",
      duration: "4 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-4',
    title: "Contemporary Living Room",
    category: "Living Room · Contemporary",
    location: "Nashik, India",
    year: "2024",
    description: "A gorgeous contemporary living room with a feature marble-finish TV wall panel, integrated LED cove lighting, custom L-shaped sofa, and stylish wooden partition.",
    videoUrl: "/videos/4.mp4",
    mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000"
    ],
    features: [
      "Marble-finish fluted wall paneling",
      "Floating TV console unit",
      "Custom designer partition",
      "Smart ambient automation lighting"
    ],
    designer: {
      name: "Siddharth Shah",
      role: "Lead Interior Designer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      bio: "Siddharth specializes in ergonomic kitchen planning and premium space optimization."
    },
    stats: {
      area: "350 sq ft",
      duration: "4 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-5',
    title: "Italian Modular Kitchen",
    category: "Kitchen Interior · Premium",
    location: "Nashik, India",
    year: "2024",
    description: "An ultra-luxurious Italian style kitchen with premium lacquer finish cabinets, high-end built-in microwave & oven, quartz island counter, and automatic touch-open cabinet doors.",
    videoUrl: "/videos/5.mp4",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1000",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000"
    ],
    features: [
      "Premium glass shutters with aluminum frames",
      "Island breakfast counter",
      "Built-in pantry unit",
      "Integrated double sink"
    ],
    designer: {
      name: "Neha Kulkarni",
      role: "Senior Designer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
      bio: "Neha is known for her warm, livable design concepts and detailed space styling."
    },
    stats: {
      area: "240 sq ft",
      duration: "5 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-6',
    title: "Wardrobe & Dressing Unit",
    category: "Wardrobe · Custom",
    location: "Nashik, India",
    year: "2024",
    description: "Space-saving sliding wardrobe utilizing high-quality glass and laminate panels. Designed with internal drawers, custom accessory organizers, and a full-length dressing mirror unit.",
    videoUrl: "/videos/6.mp4",
    mainImage: "https://images.unsplash.com/photo-1558882224-cca166733360?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000"
    ],
    features: [
      "Heavy duty silent sliding track",
      "Internal motion-sensor LED lighting",
      "Pull-out trouser racks & tray drawers",
      "Integrated dressing mirror panel"
    ],
    designer: {
      name: "Rahul Verma",
      role: "Residential Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
      bio: "Rahul specializes in luxury bedroom designs and custom wardrobe solutions."
    },
    stats: {
      area: "120 sq ft",
      duration: "3 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-7',
    title: "False Ceiling & Rafters",
    category: "Ceiling Design · Nashik",
    location: "Nashik, India",
    year: "2024",
    description: "Premium gypsum board ceiling work featuring detailed wooden rafters, concealed LED strips, magnetic tracks, and spot light fixtures that instantly add warmth to the entire home.",
    videoUrl: "/videos/7.mp4",
    mainImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1000",
      "https://images.unsplash.com/photo-1536532185004-2ee3d454ef02?q=80&w=1000"
    ],
    features: [
      "Gypsum sheet suspended ceiling design",
      "Concealed LED cove lighting",
      "Wooden finish designer rafters",
      "Premium magnetic tracks & spot spotlights"
    ],
    designer: {
      name: "Siddharth Shah",
      role: "Lead Interior Designer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
      bio: "Siddharth specializes in ergonomic kitchen planning and premium space optimization."
    },
    stats: {
      area: "800 sq ft",
      duration: "2 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-8',
    title: "Kids Room & Study Unit",
    category: "Kids Room · Custom",
    location: "Nashik, India",
    year: "2024",
    description: "Creative, functional kids bedroom design containing a themed bunk bed, modular study table with overhead bookshelves, and smart built-in wardrobe storage options.",
    videoUrl: "/videos/8.mp4",
    mainImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=1000",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1000"
    ],
    features: [
      "Space-saving storage bed",
      "Ergonomic modular study desk",
      "Colorful laminate finishes",
      "Safety rounded edges"
    ],
    designer: {
      name: "Neha Kulkarni",
      role: "Senior Designer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
      bio: "Neha is known for her warm, livable design concepts and detailed space styling."
    },
    stats: {
      area: "160 sq ft",
      duration: "3 weeks",
      cost: "Factory Pricing"
    }
  },
  {
    id: 'mr-traders-project-9',
    title: "Modern Dining Space",
    category: "Dining Area · Premium",
    location: "Nashik, India",
    year: "2024",
    description: "A warm and inviting dining space with custom table setup, designer pendant light, and cozy seating.",
    videoUrl: "/videos/9.mp4",
    mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1000",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1000"
    ],
    features: [
      "Designer pendant hanging lights",
      "Custom dining table layout",
      "Cozy upholstered seating",
      "Ambient wall sconces"
    ],
    designer: {
      name: "Rahul Verma",
      role: "Residential Specialist",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
      bio: "Rahul specializes in custom dining and living layouts."
    },
    stats: {
      area: "140 sq ft",
      duration: "3 weeks",
      cost: "Factory Pricing"
    }
  }
];