import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ArrowLeft, Star, ImageOff } from "lucide-react";
import { products } from "@/components/FeaturedProducts";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    setProduct(foundProduct);
    setLoading(false);
    setImageError(false);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex justify-center items-center h-40">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">Product not found</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="p-6 flex justify-center items-center min-h-[300px]">
              {imageError ? (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageOff size={64} />
                  <p className="mt-4">Image not available</p>
                </div>
              ) : (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-80 object-contain"
                  onError={() => setImageError(true)}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">(42 reviews)</span>
          </div>
          
          <div className="flex items-end gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">₹{product.price}</span>
            <span className="text-sm text-gray-500">per {product.unit}</span>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-600">
              Premium quality {product.name.toLowerCase()} for your daily needs. 
              Our products are sourced directly from farmers to ensure freshness and quality.
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              
              <Button 
                className="bg-primary hover:bg-primary-hover flex-1"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h2 className="font-semibold mb-2">Product Details</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex">
                <span className="w-24 text-gray-500">Unit:</span>
                <span>{product.unit}</span>
              </li>
              <li className="flex">
                <span className="w-24 text-gray-500">Category:</span>
                <span>Groceries</span>
              </li>
              <li className="flex">
                <span className="w-24 text-gray-500">Availability:</span>
                <span className="text-green-600">In Stock</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
