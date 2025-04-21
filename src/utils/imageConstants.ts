
export const PRODUCT_IMAGES = {
  "Fortune Sunlite Refined Sunflower Oil": "/images/sunflower oil.jpeg",
  "Tata Salt": "/images/tata salt.jpeg",
  "Aashirvaad Atta with Multigrains": "/images/aashirvaad atta.jpeg",
  "Saffola Active Refined Oil": "/images/saffola oil.jpeg",
  "Maggi 2-Minute Noodles": "/images/maggi.jpg",
  "Daawat Basmati Rice - Premium": "/images/daawat basmati.jpg",
  "Bournvita Health Drink": "/images/bournvita.jpeg",
  "Red Label Tea": "/images/red label tea.jpg",
} as const;

export type ProductImageKey = keyof typeof PRODUCT_IMAGES;
