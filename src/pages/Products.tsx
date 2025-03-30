import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ImageOff, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/components/FeaturedProducts";
import { toast } from "sonner";
import { categories } from "@/components/Categories";
import { Input } from "@/components/ui/input";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<string>("All Products");
  const { addToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState(searchParam || "");

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary-hover">
            Search
          </Button>
        </form>
        
        <div className="flex flex-wrap gap-2 mb-8">
          <Button 
            variant={activeCategory === "All Products" ? "default" : "outline"}
            className={`${activeCategory === "All Products" ? "bg-primary" : ""}`}
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
          
          {categories.map(category => (
            <Button 
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              className={`${activeCategory === category.name ? "bg-primary" : ""}`}
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
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <Link to={`/product/${product.id}`} className="block mb-4">
                <div className="mb-4 flex justify-center h-40">
                  {imageErrors[product.id] ? (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ImageOff size={32} />
                      <p className="text-sm mt-2">Image not available</p>
                    </div>
                  ) : (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-contain h-full w-full rounded-md"
                      onError={() => handleImageError(product.id)}
                    />
                  )}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
            {searchParam && (
              <Button 
                variant="outline" 
                className="mt-4"
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
    </div>
  );
}
