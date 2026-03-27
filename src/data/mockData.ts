export interface Product {
  id: number;
  name: string;
  price: number;
  category: "frames" | "sunglasses";
  gender: "men" | "women" | "unisex";
  image: string;
  description: string;
  specs: { label: string; value: string }[];
  stock_quantity?: number;
  is_out_of_stock?: boolean;
}

export const products: Product[] = [
  { id: 1, name: "Classic Aviator", price: 4500, category: "frames", gender: "unisex", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop", description: "Timeless aviator frames crafted with lightweight titanium for all-day comfort.", specs: [{ label: "Material", value: "Titanium" }, { label: "Weight", value: "22g" }, { label: "Lens Width", value: "55mm" }, { label: "Bridge", value: "16mm" }] },
  { id: 2, name: "Round Retro", price: 3800, category: "frames", gender: "unisex", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop", description: "Vintage-inspired round frames with a modern twist for effortless style.", specs: [{ label: "Material", value: "Acetate" }, { label: "Weight", value: "28g" }, { label: "Lens Width", value: "50mm" }, { label: "Bridge", value: "20mm" }] },
  { id: 3, name: "Wayfarer Bold", price: 5200, category: "sunglasses", gender: "men", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", description: "Bold wayfarer sunglasses with UV400 protection and polarized lenses.", specs: [{ label: "Material", value: "Acetate" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "54mm" }, { label: "Polarized", value: "Yes" }] },
  { id: 4, name: "Square Elite", price: 6000, category: "frames", gender: "men", image: "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=400&h=400&fit=crop", description: "Premium square frames with spring hinges for a perfect fit.", specs: [{ label: "Material", value: "Stainless Steel" }, { label: "Weight", value: "25g" }, { label: "Lens Width", value: "52mm" }, { label: "Bridge", value: "18mm" }] },
  { id: 5, name: "Cat Eye Luxe", price: 4800, category: "sunglasses", gender: "women", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop", description: "Elegant cat-eye sunglasses with gradient lenses and gold accents.", specs: [{ label: "Material", value: "Metal & Acetate" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "56mm" }, { label: "Polarized", value: "Yes" }] },
  { id: 6, name: "Sport Shield", price: 5500, category: "sunglasses", gender: "men", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop", description: "Wraparound sport sunglasses designed for active lifestyles.", specs: [{ label: "Material", value: "TR90 Nylon" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "68mm" }, { label: "Polarized", value: "Yes" }] },
  { id: 7, name: "Rimless Feather", price: 7000, category: "frames", gender: "women", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop", description: "Ultra-lightweight rimless frames that feel invisible on your face.", specs: [{ label: "Material", value: "Titanium" }, { label: "Weight", value: "15g" }, { label: "Lens Width", value: "53mm" }, { label: "Bridge", value: "17mm" }] },
  { id: 8, name: "Oversized Glam", price: 5800, category: "sunglasses", gender: "women", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop", description: "Statement oversized sunglasses with full UV protection.", specs: [{ label: "Material", value: "Acetate" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "62mm" }, { label: "Polarized", value: "No" }] },
  { id: 9, name: "Classic Rectangle", price: 3500, category: "frames", gender: "men", image: "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=400&h=400&fit=crop", description: "Smart rectangular frames for a professional look.", specs: [{ label: "Material", value: "Metal" }, { label: "Weight", value: "24g" }, { label: "Lens Width", value: "54mm" }, { label: "Bridge", value: "18mm" }] },
  { id: 10, name: "Round Crystal", price: 4200, category: "frames", gender: "women", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop", description: "Chic transparent round frames with subtle detailing.", specs: [{ label: "Material", value: "Acetate" }, { label: "Weight", value: "26g" }, { label: "Lens Width", value: "48mm" }, { label: "Bridge", value: "19mm" }] },
  { id: 11, name: "Sport Wrap", price: 5400, category: "sunglasses", gender: "men", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400&h=400&fit=crop", description: "Performance wrap sunglasses for outdoor sports.", specs: [{ label: "Material", value: "Polycarbonate" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "65mm" }, { label: "Polarized", value: "Yes" }] },
  { id: 12, name: "Butterfly Elegance", price: 4900, category: "sunglasses", gender: "women", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop", description: "Feminine butterfly sunglasses with a gradient tint.", specs: [{ label: "Material", value: "Acetate" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "58mm" }, { label: "Polarized", value: "No" }] },
  { id: 13, name: "Geometric Chic", price: 6500, category: "frames", gender: "women", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop", description: "Modern geometric frames that make a bold statement.", specs: [{ label: "Material", value: "Titanium & Acetate" }, { label: "Weight", value: "20g" }, { label: "Lens Width", value: "54mm" }, { label: "Bridge", value: "17mm" }] },
  { id: 14, name: "Everyday Essential", price: 3200, category: "frames", gender: "men", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop", description: "Durable everyday frames for reliable comfort and style.", specs: [{ label: "Material", value: "TR90 Flex" }, { label: "Weight", value: "18g" }, { label: "Lens Width", value: "55mm" }, { label: "Bridge", value: "16mm" }] },
  { id: 15, name: "Pilot Classic", price: 4100, category: "sunglasses", gender: "men", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", description: "Classic pilot teardrop shape with mirror lenses.", specs: [{ label: "Material", value: "Metal Alloy" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "58mm" }, { label: "Polarized", value: "Yes" }] },
  { id: 16, name: "Rose Gold Mirage", price: 5100, category: "sunglasses", gender: "women", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop", description: "Elegant rose gold frames with tinted gradient lenses.", specs: [{ label: "Material", value: "Stainless Steel" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "55mm" }, { label: "Polarized", value: "No" }] },
  { id: 17, name: "Tortoiseshell Classic", price: 3950, category: "frames", gender: "unisex", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop", description: "Iconic tortoiseshell pattern for a vintage intellectual look.", specs: [{ label: "Material", value: "Acetate" }, { label: "Weight", value: "26g" }, { label: "Lens Width", value: "51mm" }, { label: "Bridge", value: "19mm" }] },
  { id: 18, name: "Browline Master", price: 4600, category: "frames", gender: "men", image: "https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=400&h=400&fit=crop", description: "Distinct browline frames combining retro and professional styles.", specs: [{ label: "Material", value: "Metal & Acetate" }, { label: "Weight", value: "23g" }, { label: "Lens Width", value: "52mm" }, { label: "Bridge", value: "20mm" }] },
  { id: 19, name: "Cat Eye Dazzle", price: 6200, category: "frames", gender: "women", image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=400&h=400&fit=crop", description: "Sharp cat eye profile embellished with subtle crystal details.", specs: [{ label: "Material", value: "Premium Acetate" }, { label: "Weight", value: "28g" }, { label: "Lens Width", value: "53mm" }, { label: "Bridge", value: "16mm" }] },
  { id: 20, name: "Hexagon Matrix", price: 5800, category: "sunglasses", gender: "unisex", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop", description: "Unique hexagonal lenses with minimalist wire frames.", specs: [{ label: "Material", value: "Titanium" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "50mm" }, { label: "Polarized", value: "Yes" }] },
  { id: 21, name: "Oversized Shield", price: 7500, category: "sunglasses", gender: "women", image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=400&fit=crop", description: "Dramatic mask-style shield sunglasses for maximum coverage and style.", specs: [{ label: "Material", value: "Polycarbonate" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "135mm" }, { label: "Polarized", value: "No" }] },
  { id: 22, name: "Navigator Pro", price: 6800, category: "sunglasses", gender: "men", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", description: "Square navigator style shades with premium polarized coating.", specs: [{ label: "Material", value: "Stainless Steel" }, { label: "UV Protection", value: "UV400" }, { label: "Lens Width", value: "57mm" }, { label: "Polarized", value: "Yes" }] }
];

const defaultStoreInfo = {
  phones: ["0309 04 111 66", "0313 60 640 67"],
  emails: ["specswear23@gmail.com"],
  address: "Servaid Pharmacy, Plaza No 7, Shaheen Commercial, Opposite Bahria International Hospital, Lahore.",
  whatsapp: "923090411166",
  owner: "Ahmad Shahzad",
  ownerTitle: "Proprietor",
  tagline: "SPECS WEAR | SEE CLEAR",
};

export const storeInfo = (() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem("admin_store_info");
    if (saved) return { ...defaultStoreInfo, ...JSON.parse(saved) };
  }
  return defaultStoreInfo;
})();

export const testimonials = [
  { name: "Ali Hassan", text: "SPECS WEAR gave me the perfect pair of glasses. The quality and service are unmatched in Lahore!", rating: 5 },
  { name: "Fatima Khan", text: "I love my new sunglasses! Ahmad bhai helped me choose the perfect style. Highly recommended!", rating: 5 },
  { name: "Usman Malik", text: "Best optical store in the area. Great prices and genuine products. Will definitely come again.", rating: 4 },
  { name: "Sara Ahmed", text: "Professional eye testing and beautiful frames collection. My whole family gets their glasses here.", rating: 5 },
];

export const adminStats = {
  totalProducts: 48,
  totalInquiries: 156,
  monthlyVisitors: 2340,
  pendingOrders: 12,
};

export const inquiries = [
  { id: 1, name: "Bilal Ahmed", phone: "+92 321 1234567", product: "Classic Aviator", date: "2026-02-25", status: "New" },
  { id: 2, name: "Ayesha Noor", phone: "+92 300 9876543", product: "Cat Eye Luxe", date: "2026-02-24", status: "Responded" },
  { id: 3, name: "Hassan Raza", phone: "+92 333 4567890", product: "Rimless Feather", date: "2026-02-23", status: "New" },
  { id: 4, name: "Zainab Ali", phone: "+92 312 7654321", product: "Wayfarer Bold", date: "2026-02-22", status: "Closed" },
];
