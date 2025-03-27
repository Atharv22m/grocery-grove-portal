
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { products } from "@/components/FeaturedProducts";

// Updated categories based on actual products
export const categories = [
  { name: "Cooking Oils", image: "🫒", color: "bg-yellow-100", filter: (p: any) => p.name.toLowerCase().includes("oil") },
  { name: "Spices & Seasonings", image: "🧂", color: "bg-red-100", filter: (p: any) => p.name.toLowerCase().includes("salt") },
  { name: "Grains & Flours", image: "🌾", color: "bg-amber-100", filter: (p: any) => p.name.toLowerCase().includes("atta") || p.name.toLowerCase().includes("rice") },
  { name: "Instant Foods", image: "🍜", color: "bg-orange-100", filter: (p: any) => p.name.toLowerCase().includes("maggi") || p.name.toLowerCase().includes("noodles") },
  { name: "Beverages", image: "☕", color: "bg-green-100", filter: (p: any) => p.name.toLowerCase().includes("tea") || p.name.toLowerCase().includes("drink") },
  { name: "All Products", image: "🛒", color: "bg-blue-100", filter: (p: any) => true },
];

export const Categories = () => {
  // Get product counts for each category
  const getCategoryCount = (filter: (p: any) => boolean) => {
    return products.filter(filter).length;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="block"
            >
              <Button
                variant="ghost"
                className={`h-auto w-full flex flex-col items-center p-6 rounded-lg ${category.color} hover:scale-105 transition-transform`}
              >
                <span className="text-4xl mb-4">{category.image}</span>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <span className="text-xs text-gray-500 mt-1">
                  {getCategoryCount(category.filter)} items
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
