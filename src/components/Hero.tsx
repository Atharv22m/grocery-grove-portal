
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/components/FeaturedProducts";

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Filter products based on search query
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Navigate to products page with search query
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };
  
  return (
    <div className="relative bg-primary-light min-h-[600px] flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-2xl transition-all duration-1000 ease-out transform ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fresh Groceries,
            <br />
            <span className="text-primary">Delivered to Your Door</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Shop from our wide selection of fresh produce, pantry essentials, and household items.
            Get same-day delivery!
          </p>
          
          <form onSubmit={handleSearch} className="relative max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover rounded-full px-6 transition-all duration-300 transform hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/products?category=Fruits')}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              🍎 Fruits
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/products?category=Vegetables')}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              🥦 Vegetables
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/products?category=Dairy')}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              🥛 Dairy
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/products?category=Bakery')}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              🍞 Bakery
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={`absolute -bottom-10 right-0 w-full md:w-1/3 h-80 transition-all duration-1000 delay-500 transform ${animateIn ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}`}>
        <div className="relative w-full h-full">
          {/* You could add an abstract grocery-related SVG or pattern here */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-accent/20 rounded-full transform animate-pulse"></div>
          <div className="absolute bottom-20 right-32 w-20 h-20 bg-primary/30 rounded-full transform animate-bounce" style={{animationDuration: "3s"}}></div>
        </div>
      </div>
    </div>
  );
};
