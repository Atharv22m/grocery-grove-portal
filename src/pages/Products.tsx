import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer"; 
import { Button } from "@/components/ui/button";
import { ShoppingCart, ImageOff, Search, Heart, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { products } from "@/components/FeaturedProducts";
import { toast } from "sonner";
import { categories } from "@/components/Categories";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<string>("All Products");
  const { addToCart } = useCart();
  const { isSignedIn } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [animateProducts, setAnimateProducts] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateProducts(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setAnimateProducts(false);
    
    let result = [...products];
    
    if (searchParam) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchParam.toLowerCase())
      );
      setSearchQuery(searchParam);
    }
    
    if (categoryParam) {
      setActiveCategory(categoryParam);
      
      const selectedCategory = categories.find(cat => cat.name === categoryParam);
      
      if (selectedCategory) {
        result = result.filter(selectedCategory.filter);
      }
    } else {
      setActiveCategory("All Products");
    }
    
    setFilteredProducts(result);
    
    const timer = setTimeout(() => {
      setAnimateProducts(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [categoryParam, searchParam]);

  const handleAddToCart = async (productId: string) => {
    try {
      setLoadingProductId(productId);
      await addToCart(productId, 1);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set("search", searchQuery);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleBuyNow = (product: typeof products[0]) => {
    if (!isSignedIn) {
      toast.error("Please sign in to continue with purchase");
      navigate("/auth");
      return;
    }
    navigate("/buy-now", { state: { product, quantity: 1 } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6 animate-fade-in">Products</h1>
        
        <form onSubmit={handleSearch} className="mb-6 flex gap-2 animate-fade-in" style={{animationDelay: "200ms"}}>
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 transition-all duration-300 focus:ring-2 focus:ring-primary/30"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105"
          >
            Search
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2 mb-8 animate-fade-in" style={{animationDelay: "400ms"}}>
          <Button 
            variant={activeCategory === "All Products" ? "default" : "outline"}
            className={`${activeCategory === "All Products" ? "bg-primary" : ""} transition-all duration-300 transform hover:scale-105`}
            onClick={() => {
              setActiveCategory("All Products");
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("category");
              if (searchQuery) newParams.set("search", searchQuery);
              setSearchParams(newParams);
            }}
          >
            All Products
          </Button>
          
          {categories.map((category, index) => (
            <Button 
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              className={`${activeCategory === category.name ? "bg-primary" : ""} transition-all duration-300 transform hover:scale-105`}
              onClick={() => {
                setActiveCategory(category.name);
                const newParams = new URLSearchParams(searchParams);
                newParams.set("category", category.name);
                if (searchQuery) newParams.set("search", searchQuery);
                setSearchParams(newParams);
              }}
            >
              <span className="mr-2">{category.image}</span>
              {category.name}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-lg transition-all duration-500 relative transform ${
                animateProducts 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 hover:bg-gray-100 transition-colors duration-300"
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart 
                  size={20} 
                  className={`transition-colors duration-300 ${isInWishlist(product.id) ? "text-red-500" : "text-gray-400"}`} 
                  fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                />
              </Button>
              <Link to={`/product/${product.id}`} className="block mb-4 group">
                <div className="mb-4 flex justify-center h-40 overflow-hidden">
                  {imageErrors[product.id] ? (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageOff size={32} />
                      <p className="text-sm mt-2">Image not available</p>
                    </div>
                  ) : (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-contain h-full w-full rounded-md transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(product.id)}
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-primary">₹{product.price}</span>
                  <span className="text-sm text-gray-500">per {product.unit}</span>
                </div>
              </Link>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={loadingProductId === product.id}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {loadingProductId === product.id ? (
                    <>
                      <span className="animate-pulse">Adding</span>
                      <span className="inline-block animate-bounce">.</span>
                      <span className="inline-block animate-bounce" style={{animationDelay: "200ms"}}>.</span>
                      <span className="inline-block animate-bounce" style={{animationDelay: "400ms"}}>.</span>
                    </>
                  ) : "Add to Cart"}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleBuyNow(product)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-500">No products found.</p>
            {searchParam && (
              <Button 
                variant="outline" 
                className="mt-4 transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("search");
                  setSearchParams(newParams);
                  setSearchQuery("");
                }}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
