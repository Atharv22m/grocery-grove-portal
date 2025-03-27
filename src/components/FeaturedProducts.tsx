
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
    image: "https://images.unsplash.com/photo-1620705043135-7524af6ee7c2?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "2",
    name: "Tata Salt",
    price: 25,
    unit: "1kg",
    image: "https://images.unsplash.com/photo-1578240599704-d29dde6b7e61?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "3",
    name: "Aashirvaad Atta with Multigrains",
    price: 325,
    unit: "5kg",
    image: "https://images.unsplash.com/photo-1586444248879-bc604bc77e3b?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "4",
    name: "Saffola Active Refined Oil",
    price: 215,
    unit: "1L",
    image: "https://images.unsplash.com/photo-1567346245492-5c8319207055?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "5",
    name: "Maggi 2-Minute Noodles",
    price: 72,
    unit: "pack of 6",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "6",
    name: "Daawat Basmati Rice - Premium",
    price: 299,
    unit: "1kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "7",
    name: "Bournvita Health Drink",
    price: 245,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1605548109944-9040d0f88644?auto=format&fit=crop&q=80&w=300&h=300",
  },
  {
    id: "8",
    name: "Red Label Tea",
    price: 170,
    unit: "500g",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=300&h=300",
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
