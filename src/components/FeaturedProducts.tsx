
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

export const products = [
  {
    id: "1",
    name: "Fortune Sunlite Refined Sunflower Oil",
    price: 199,
    unit: "1L",
    image: "https://m.media-amazon.com/images/I/61eDWQe5WIL._SL1500_.jpg",
  },
  {
    id: "2",
    name: "Tata Salt",
    price: 25,
    unit: "1kg",
    image: "https://m.media-amazon.com/images/I/51ghXwgXRvL._SL1000_.jpg",
  },
  {
    id: "3",
    name: "Aashirvaad Atta with Multigrains",
    price: 325,
    unit: "5kg",
    image: "https://m.media-amazon.com/images/I/81ghNg70KaL._SL1500_.jpg",
  },
  {
    id: "4",
    name: "Saffola Active Refined Oil",
    price: 215,
    unit: "1L",
    image: "https://m.media-amazon.com/images/I/61uw5RDxKzL._SL1500_.jpg",
  },
  {
    id: "5",
    name: "Maggi 2-Minute Noodles",
    price: 72,
    unit: "pack of 6",
    image: "https://m.media-amazon.com/images/I/81Yjqcj1S5L._SL1500_.jpg",
  },
  {
    id: "6",
    name: "Daawat Basmati Rice - Premium",
    price: 299,
    unit: "1kg",
    image: "https://m.media-amazon.com/images/I/71AjRyTJ51L._SL1080_.jpg",
  },
  {
    id: "7",
    name: "Bournvita Health Drink",
    price: 245,
    unit: "500g",
    image: "https://m.media-amazon.com/images/I/71AdGBZFhbL._SL1500_.jpg",
  },
  {
    id: "8",
    name: "Red Label Tea",
    price: 170,
    unit: "500g",
    image: "https://m.media-amazon.com/images/I/61jp200ZgpL._SL1000_.jpg",
  },
];

export const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleAddToCart = async (productId: string) => {
    try {
      setLoadingProductId(productId);
      await addToCart(productId);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoadingProductId(null);
    }
  };

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
              <Link to={`/product/${product.id}`} className="block mb-4">
                <div className="mb-4 flex justify-center h-40">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="object-contain h-full w-full rounded-md"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-primary">₹{product.price}</span>
                  <span className="text-sm text-gray-500">per {product.unit}</span>
                </div>
              </Link>
              <Button 
                className="w-full bg-primary hover:bg-primary-hover"
                onClick={() => handleAddToCart(product.id)}
                disabled={loadingProductId === product.id}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {loadingProductId === product.id ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
