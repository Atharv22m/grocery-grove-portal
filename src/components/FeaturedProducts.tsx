
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const products = [
  {
    id: "1",
    name: "Fortune Sunlite Refined Sunflower Oil",
    price: 199,
    unit: "1L",
    image: "🌻",
  },
  {
    id: "2",
    name: "Tata Salt",
    price: 25,
    unit: "1kg",
    image: "🧂",
  },
  {
    id: "3",
    name: "Aashirvaad Atta with Multigrains",
    price: 325,
    unit: "5kg",
    image: "🌾",
  },
  {
    id: "4",
    name: "Saffola Active Refined Oil",
    price: 215,
    unit: "1L",
    image: "🍳",
  },
  {
    id: "5",
    name: "Maggi 2-Minute Noodles",
    price: 72,
    unit: "pack of 6",
    image: "🍜",
  },
  {
    id: "6",
    name: "Daawat Basmati Rice - Premium",
    price: 299,
    unit: "1kg",
    image: "🍚",
  },
  {
    id: "7",
    name: "Bournvita Health Drink",
    price: 245,
    unit: "500g",
    image: "🥛",
  },
  {
    id: "8",
    name: "Red Label Tea",
    price: 170,
    unit: "500g",
    image: "🍵",
  },
];

export const FeaturedProducts = () => {
  const { addToCart, isLoading } = useCart();

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow animate-fade-in"
            >
              <div className="text-6xl mb-4 flex justify-center">{product.image}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-primary">₹{product.price}</span>
                <span className="text-sm text-gray-500">per {product.unit}</span>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary-hover"
                onClick={() => addToCart(product.id)}
                disabled={isLoading}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
