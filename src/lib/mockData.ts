export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  year?: number;
  rating?: string;
  duration?: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export const profiles: Profile[] = [
  { id: "1", name: "Amlan", avatar: "A", color: "#e50914" },
  { id: "2", name: "Priya", avatar: "P", color: "#b45bff" },
  { id: "3", name: "Rahul", avatar: "R", color: "#00c6ff" },
  { id: "4", name: "Sneha", avatar: "S", color: "#ffc107" },
];

export const heroContent: ContentItem = {
  id: "hero-1",
  title: "Beyond the Horizon",
  description:
    "A breathtaking journey through uncharted territories, where every step reveals a new wonder. Follow the expedition as they push the limits of human exploration into the unknown.",
  image: "/images/hero-banner.png",
  category: "Featured",
  year: 2025,
  rating: "4K Ultra HD",
  duration: "2h 15m",
};

export const topPicks: ContentItem[] = [
  {
    id: "tp-1",
    title: "Golden Shores",
    description: "A cinematic journey along the world's most breathtaking coastlines at sunset.",
    image: "/images/thumb-sunset.png",
    category: "Documentary",
    year: 2024,
    rating: "HD",
    duration: "1h 42m",
  },
  {
    id: "tp-2",
    title: "Neon Dreams",
    description: "Navigate the sprawling cyberpunk metropolis where technology meets humanity.",
    image: "/images/thumb-city.png",
    category: "Sci-Fi",
    year: 2025,
    rating: "4K",
    duration: "2h 08m",
  },
  {
    id: "tp-3",
    title: "Whispering Woods",
    description: "Ancient forests hold secrets that have been kept for millennia.",
    image: "/images/thumb-forest.png",
    category: "Fantasy",
    year: 2024,
    rating: "HD",
    duration: "1h 55m",
  },
  {
    id: "tp-4",
    title: "Northern Lights",
    description: "Witness the aurora borealis like never before in this stunning visual experience.",
    image: "/images/thumb-mountain.png",
    category: "Nature",
    year: 2025,
    rating: "4K",
    duration: "1h 30m",
  },
  {
    id: "tp-5",
    title: "Midnight Tides",
    description: "The raw power of the ocean captured in its most dramatic moments.",
    image: "/images/thumb-ocean.png",
    category: "Documentary",
    year: 2024,
    rating: "HD",
    duration: "1h 48m",
  },
  {
    id: "tp-6",
    title: "Stargazer",
    description: "A solitary journey through the cosmos, told from a desert campfire.",
    image: "/images/thumb-stars.png",
    category: "Adventure",
    year: 2025,
    rating: "4K",
    duration: "2h 22m",
  },
];

export const memories: ContentItem[] = [
  {
    id: "mem-1",
    title: "Summer Memories",
    description: "Relive the warmth of golden summer days by the shore.",
    image: "/images/thumb-sunset.png",
    category: "Personal",
    year: 2023,
  },
  {
    id: "mem-2",
    title: "City Adventures",
    description: "Night explorations through vibrant city streets.",
    image: "/images/thumb-city.png",
    category: "Personal",
    year: 2024,
  },
  {
    id: "mem-3",
    title: "Forest Retreat",
    description: "Peaceful weekends surrounded by nature.",
    image: "/images/thumb-forest.png",
    category: "Personal",
    year: 2023,
  },
  {
    id: "mem-4",
    title: "Mountain Escape",
    description: "Adventures at the peak of the world.",
    image: "/images/thumb-mountain.png",
    category: "Personal",
    year: 2024,
  },
  {
    id: "mem-5",
    title: "Ocean Vibes",
    description: "Calming moments by the crashing waves.",
    image: "/images/thumb-ocean.png",
    category: "Personal",
    year: 2023,
  },
  {
    id: "mem-6",
    title: "Under the Stars",
    description: "Camping trips that left us starry-eyed.",
    image: "/images/thumb-stars.png",
    category: "Personal",
    year: 2024,
  },
];

export const favorites: ContentItem[] = [
  {
    id: "fav-1",
    title: "Eternal Sunset",
    description: "A timeless classic that captures the essence of a perfect evening.",
    image: "/images/thumb-sunset.png",
    category: "Romance",
    year: 2022,
    rating: "HD",
    duration: "1h 58m",
  },
  {
    id: "fav-2",
    title: "Cyber Nights",
    description: "A thrilling ride through a neon-lit underworld.",
    image: "/images/thumb-city.png",
    category: "Thriller",
    year: 2023,
    rating: "4K",
    duration: "2h 10m",
  },
  {
    id: "fav-3",
    title: "Enchanted Path",
    description: "Follow the trail that leads to wonders beyond imagination.",
    image: "/images/thumb-forest.png",
    category: "Fantasy",
    year: 2024,
    rating: "HD",
    duration: "1h 45m",
  },
  {
    id: "fav-4",
    title: "Frozen Peak",
    description: "Survive the harshest conditions at the top of the world.",
    image: "/images/thumb-mountain.png",
    category: "Action",
    year: 2025,
    rating: "4K",
    duration: "2h 05m",
  },
  {
    id: "fav-5",
    title: "Deep Blue",
    description: "Explore the mysteries that lie beneath the surface.",
    image: "/images/thumb-ocean.png",
    category: "Documentary",
    year: 2024,
    rating: "HD",
    duration: "1h 35m",
  },
  {
    id: "fav-6",
    title: "Cosmos",
    description: "An epic journey through space and time.",
    image: "/images/thumb-stars.png",
    category: "Sci-Fi",
    year: 2025,
    rating: "4K",
    duration: "2h 30m",
  },
];

export const specialMoments: ContentItem[] = [
  {
    id: "sm-1",
    title: "Our Anniversary",
    description: "A special day, captured forever.",
    image: "/images/thumb-sunset.png",
    category: "Special",
    year: 2024,
  },
  {
    id: "sm-2",
    title: "Surprise Trip",
    description: "When spontaneity created the best memories.",
    image: "/images/thumb-city.png",
    category: "Special",
    year: 2023,
  },
  {
    id: "sm-3",
    title: "First Hike Together",
    description: "The beginning of countless adventures.",
    image: "/images/thumb-forest.png",
    category: "Special",
    year: 2022,
  },
  {
    id: "sm-4",
    title: "Mountain Promise",
    description: "Words spoken at the highest point on earth.",
    image: "/images/thumb-mountain.png",
    category: "Special",
    year: 2024,
  },
  {
    id: "sm-5",
    title: "Beach Day",
    description: "Laughter, waves, and pure joy.",
    image: "/images/thumb-ocean.png",
    category: "Special",
    year: 2023,
  },
  {
    id: "sm-6",
    title: "Starlit Proposal",
    description: "A moment that changed everything, under a blanket of stars.",
    image: "/images/thumb-stars.png",
    category: "Special",
    year: 2024,
  },
];

export const categories = [
  "All",
  "Documentary",
  "Sci-Fi",
  "Fantasy",
  "Nature",
  "Adventure",
  "Romance",
  "Thriller",
  "Action",
  "Personal",
  "Special",
];

export const adminContent: ContentItem[] = [
  ...topPicks.slice(0, 3),
  ...favorites.slice(0, 3),
];
