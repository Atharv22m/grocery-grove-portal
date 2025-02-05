import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Organic Bananas",
    price: "₹99",
    unit: "bunch",
    image: "🍌",
  },
  {
    id: 2,
    name: "Fresh Milk",
    price: "₹79",
    unit: "1L",
    image: "🥛",
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    price: "₹59",
    unit: "loaf",
    image: "🍞",
  },
  {
    id: 4,
    name: "Farm Eggs",
    price: "₹119",
    unit: "dozen",
    image: "🥚",
  },
];

export const FeaturedProducts = () => {
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
                <span className="text-lg font-bold text-primary">{product.price}</span>
                <span className="text-sm text-gray-500">per {product.unit}</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary-hover">
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