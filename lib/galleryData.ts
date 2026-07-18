export interface GalleryImage {
  id: string;
  src: string;
  category: "halls" | "events" | "food" | "botanical" | "setup";
  title: string;
  uploadedAt: string;
}

// Gradient placeholders backup in case of missing asset
const gradients = [
  "linear-gradient(135deg, #102E4A 0%, #1a4a3a 50%, #D4AF37 100%)",
  "linear-gradient(135deg, #8BA89B 0%, #102E4A 100%)",
  "linear-gradient(135deg, #D4AF37 0%, #1a3f5f 100%)",
  "linear-gradient(135deg, #1a4a3a 0%, #8BA89B 60%, #FFF7E6 100%)",
  "linear-gradient(135deg, #102E4A 0%, #D4AF37 50%, #8BA89B 100%)",
  "linear-gradient(135deg, #2C2C2A 0%, #102E4A 100%)",
  "linear-gradient(135deg, #D4AF37 0%, #102E4A 50%, #1a4a3a 100%)",
  "linear-gradient(135deg, #8BA89B 0%, #D4AF37 100%)",
];

const icons: Record<string, string> = {
  halls: "🏛️",
  events: "🎊",
  food: "🍽️",
  botanical: "🌺",
  setup: "✨",
};

export const galleryImages: GalleryImage[] = [
  // Halls
  { id: "h1", src: "/images/indoor.png", category: "halls", title: "Indoor Banquet Hall", uploadedAt: "2025-06-15" },
  { id: "h2", src: "/images/indoor2.png", category: "halls", title: "AC Hall Interior", uploadedAt: "2025-06-12" },
  { id: "h3", src: "/images/outdoor.jpeg", category: "halls", title: "Outdoor Seating Area", uploadedAt: "2025-05-28" },
  { id: "h4", src: "/images/scene1.webp", category: "halls", title: "Garden Hall Entrance", uploadedAt: "2025-05-20" },
  
  // Events
  { id: "e1", src: "/images/scene2.webp", category: "events", title: "Wedding Ceremony", uploadedAt: "2025-06-08" },
  { id: "e3", src: "/images/scene4.webp", category: "events", title: "Family Celebration", uploadedAt: "2025-05-25" },
  
  // Food
  { id: "f1", src: "/images/food.webp", category: "food", title: "Multi-Cuisine Buffet", uploadedAt: "2025-06-10" },
  { id: "f2", src: "/images/food2.webp", category: "food", title: "Savory Starters", uploadedAt: "2025-06-05" },
  { id: "f3", src: "/images/food3.webp", category: "food", title: "Signature Dishes", uploadedAt: "2025-05-30" },
  { id: "f4", src: "/images/food4.webp", category: "food", title: "Appetizer Platter", uploadedAt: "2025-05-20" },
  { id: "f5", src: "/images/food5.webp", category: "food", title: "Live Food Counter", uploadedAt: "2025-05-15" },
  
  // Botanical
  { id: "b1", src: "/images/scene5.webp", category: "botanical", title: "Garden Pathway", uploadedAt: "2025-06-14" },
  { id: "b2", src: "/images/scene6.webp", category: "botanical", title: "Flowering Corner", uploadedAt: "2025-06-07" },
  
  // Setup
  { id: "s1", src: "/images/scene7.webp", category: "setup", title: "Table Arrangement", uploadedAt: "2025-06-11" },
  { id: "s2", src: "/images/scene8.webp", category: "setup", title: "Lighting Décor", uploadedAt: "2025-06-03" },
];

export function getGradient(index: number): string {
  return gradients[index % gradients.length];
}

export function getCategoryIcon(category: string): string {
  return icons[category] || "📷";
}

export const categories = [
  { key: "all", label: "All Events" },
  { key: "halls", label: "Halls" },
  { key: "events", label: "Events" },
  { key: "food", label: "Food" },
  { key: "botanical", label: "Botanical" },
  { key: "setup", label: "Setup" },
] as const;
