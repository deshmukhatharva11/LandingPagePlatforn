interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  posterImage: string;
  images: string[];
}

export const projectsData: Record<string, Project> = {
  'mr-traders-project-1': {
    id: 'mr-traders-project-1',
    title: "Elegant Master Bedroom",
    category: "Bedroom Interior · Nashik",
    description: "Spacious master bedroom featuring custom drapery, ambient lighting, and premium finishes.",
    videoUrl: "/videos/1.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-2': {
    id: 'mr-traders-project-2',
    title: "Divine Pooja Room",
    category: "Mandir Design · Nashik",
    description: "Exquisite custom backlit wooden jaali panels and mandir design for a serene prayer space.",
    videoUrl: "/videos/2.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-3': {
    id: 'mr-traders-project-3',
    title: "Modern Modular Kitchen",
    category: "Kitchen Interior · Nashik",
    description: "Sleek modular kitchen featuring high-gloss shutters, profile handles, and an elegant arch entrance.",
    videoUrl: "/videos/3.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-4': {
    id: 'mr-traders-project-4',
    title: "Contemporary Living Room",
    category: "Living Room · Contemporary",
    description: "Luxury TV unit featuring fluted wooden panels, marble backdrops, and floating cabinets.",
    videoUrl: "/videos/4.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-5': {
    id: 'mr-traders-project-5',
    title: "Italian Modular Kitchen",
    category: "Kitchen Interior · Premium",
    description: "High-gloss finish modular kitchen layout with built-in appliances and optimal work triangle.",
    videoUrl: "/videos/5.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-6': {
    id: 'mr-traders-project-6',
    title: "Wardrobe & Dressing Unit",
    category: "Wardrobe · Custom",
    description: "Sliding wardrobe design with integrated dresser, custom shelving, and warm internal lighting.",
    videoUrl: "/videos/6.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-7': {
    id: 'mr-traders-project-7',
    title: "False Ceiling & Rafters",
    category: "Ceiling Design · Nashik",
    description: "Modern gypsum board false ceiling featuring wooden rafters and concealed LED cove lighting.",
    videoUrl: "/videos/7.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-8': {
    id: 'mr-traders-project-8',
    title: "Kids Room & Study Unit",
    category: "Kids Room · Custom",
    description: "Fun and functional children's bedroom featuring study table, storage options, and cozy lighting.",
    videoUrl: "/videos/8.mp4",
    posterImage: "",
    images: []
  },
  'mr-traders-project-9': {
    id: 'mr-traders-project-9',
    title: "Modern Dining Space",
    category: "Dining Area · Premium",
    description: "A warm and inviting dining space with custom table setup, designer pendant light, and cozy seating.",
    videoUrl: "/videos/9.mp4",
    posterImage: "",
    images: []
  }
};
