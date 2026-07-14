export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  video: string;
  poster: string;
  images: string[];
  details: {
    client: string;
    location: string;
    year: string;
    size: string;
    scope: string[];
  };
}

export const projects: Project[] = [
  {
    id: 'mr-traders-project-1',
    title: "Elegant Master Bedroom",
    category: "Bedroom Interior · Nashik",
    description: "Spacious master bedroom featuring custom drapery, ambient lighting, and premium finishes.",
    video: "/videos/1.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "220 sq.ft",
      scope: ["Master Bedroom", "Lighting Design", "Custom Drapery"]
    }
  },
  {
    id: 'mr-traders-project-2',
    title: "Divine Pooja Room",
    category: "Mandir Design · Nashik",
    description: "Exquisite custom backlit wooden jaali panels and mandir design for a serene prayer space.",
    video: "/videos/2.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "40 sq.ft",
      scope: ["Pooja Mandir", "Wooden Carving", "Backlighting"]
    }
  },
  {
    id: 'mr-traders-project-3',
    title: "Modern Modular Kitchen",
    category: "Kitchen Interior · Nashik",
    description: "Sleek modular kitchen featuring high-gloss shutters, profile handles, and an elegant arch entrance.",
    video: "/videos/3.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "180 sq.ft",
      scope: ["Modular Kitchen", "Space Planning", "Arch Entrance"]
    }
  },
  {
    id: 'mr-traders-project-4',
    title: "Contemporary Living Room",
    category: "Living Room · Contemporary",
    description: "Luxury TV unit featuring fluted wooden panels, marble backdrops, and floating cabinets.",
    video: "/videos/4.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "350 sq.ft",
      scope: ["Living Room", "TV Unit Design", "Wall Paneling"]
    }
  },
  {
    id: 'mr-traders-project-5',
    title: "Italian Modular Kitchen",
    category: "Kitchen Interior · Premium",
    description: "High-gloss finish modular kitchen layout with built-in appliances and optimal work triangle.",
    video: "/videos/5.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "240 sq.ft",
      scope: ["Italian Modular Kitchen", "Island Counter", "Built-in Appliances"]
    }
  },
  {
    id: 'mr-traders-project-6',
    title: "Wardrobe & Dressing Unit",
    category: "Wardrobe · Custom",
    description: "Sliding wardrobe design with integrated dresser, custom shelving, and warm internal lighting.",
    video: "/videos/6.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "120 sq.ft",
      scope: ["Sliding Wardrobe", "Dressing Unit", "Storage Solutions"]
    }
  },
  {
    id: 'mr-traders-project-7',
    title: "False Ceiling & Rafters",
    category: "Ceiling Design · Nashik",
    description: "Modern gypsum board false ceiling featuring wooden rafters and concealed LED cove lighting.",
    video: "/videos/7.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "800 sq.ft",
      scope: ["False Ceiling", "Gypsum Board Ceiling", "Cove Lighting"]
    }
  },
  {
    id: 'mr-traders-project-8',
    title: "Kids Room & Study Unit",
    category: "Kids Room · Custom",
    description: "Fun and functional children's bedroom featuring study table, storage options, and cozy lighting.",
    video: "/videos/8.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "160 sq.ft",
      scope: ["Kids Bedroom", "Study Table", "Bunk Bed"]
    }
  },
  {
    id: 'mr-traders-project-9',
    title: "Modern Dining Space",
    category: "Dining Area · Premium",
    description: "A warm and inviting dining space with custom table setup, designer pendant light, and cozy seating.",
    video: "/videos/9.mp4",
    poster: "",
    images: [],
    details: {
      client: "Private Client",
      location: "Nashik, India",
      year: "2024",
      size: "140 sq.ft",
      scope: ["Dining Space", "Custom Table", "Lighting"]
    }
  }
];
