
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import { ProductType } from '@/types/product';
import { Card } from '@/components/ui/card';
import ProductRating from '@/components/ProductRating';
import ProductDetails from '@/components/ProductDetails';
import ProductRecommendations from '@/components/ProductRecommendations';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Reset states on product change
    setIsLoaded(false);
    setImageLoaded(false);
    setImageError(false);
    setQuantity(1);
    
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Simulate product data loading
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity);
        toast.success(`Added ${product.name} to cart`);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart");
      }
    }
  };

  const handleToggleWishlist = async () => {
    if (product) {
      await toggleWishlist(product.id);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-16 px-4 flex justify-center items-center">
          <div className="animate-pulse text-lg">Loading product details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate the original price if there's a discount
  const originalPrice = product?.discount 
    ? Math.round(product.price / (1 - product.discount / 100)) 
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4 pt-24">
        {/* Breadcrumb navigation could go here */}
        
        <div 
          className={`grid md:grid-cols-2 gap-8 mb-8 transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Card className="p-6 flex justify-center items-center bg-white overflow-hidden relative">
            {imageError ? (
              <div className="flex flex-col items-center justify-center text-gray-400 h-96 w-full animate-fade-in">
                <ImageOff size={64} />
                <p className="text-sm mt-4">Image not available</p>
              </div>
            ) : (
              <div className="relative h-96 w-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img 
                  src={product?.image} 
                  alt={product?.name} 
                  className={`max-h-96 object-contain w-full h-full transition-all duration-500 transform ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  onError={() => setImageError(true)}
                  onLoad={handleImageLoad}
                />
              </div>
            )}
          </Card>
          
          <div className={`transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
            
            <div className="mb-4">
              <ProductRating rating={product?.rating || 0} size={20} />
            </div>
            
            <p className="text-gray-700 mb-6">{product?.description}</p>
            
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold text-primary mr-3">
                ₹{product?.price}
              </span>
              <span className="text-gray-500">per {product?.unit}</span>
              
              {originalPrice && (
                <span className="ml-4 text-gray-500 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {product?.discount && (
              <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.discount}% OFF
                </span>
              </div>
            )}

            <div className="flex items-center mb-6">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md overflow-hidden shadow-sm">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 h-auto hover:bg-gray-100 transition-colors"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={product?.stock && quantity >= product.stock}
                  className="px-3 py-1 h-auto hover:bg-gray-100 transition-colors"
                >
                  +
                </Button>
              </div>
            </div>

            {product?.stock !== undefined && (
              <p className="mb-6 text-sm animate-fade-in">
                {product.stock > 0 
                  ? <span className="text-green-600">In stock and ready to ship</span>
                  : <span className="text-red-600">Out of stock</span>}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="w-full bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={handleAddToCart}
                disabled={product?.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className="w-full transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                onClick={handleToggleWishlist}
              >
                <Heart 
                  className="mr-2 h-4 w-4" 
                  fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                />
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
        
        {product && (
          <div className="animate-on-scroll opacity-0 transition-all duration-700 ease-out">
            <ProductDetails product={product} />
          </div>
        )}
        
        {product && (
          <div className="animate-on-scroll opacity-0 transition-all duration-700 ease-out delay-300">
            <ProductRecommendations 
              currentProductId={product.id}
              category={product.category}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
