import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ProductType } from '@/types/product';
import { Card } from '@/components/ui/card';
import ProductRating from '@/components/ProductRating';
import ProductDetails from '@/components/ProductDetails';
import ProductRecommendations from '@/components/ProductRecommendations';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1); // Reset quantity when product changes
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity); // Pass quantity as second argument
        toast.success(`Added ${product.name} to cart`);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart");
      }
    }
  };

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4 flex justify-center items-center">
        <div className="animate-pulse text-lg">Loading product details...</div>
      </div>
    );
  }

  // Calculate the original price if there's a discount
  const originalPrice = product?.discount 
    ? Math.round(product.price / (1 - product.discount / 100)) 
    : null;

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Breadcrumb navigation could go here */}
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6 flex justify-center items-center bg-white">
          <img 
            src={product?.image} 
            alt={product?.name} 
            className="max-h-96 object-contain"
          />
        </Card>
        
        <div>
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
            <div className="mb-6">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.discount}% OFF
              </span>
            </div>
          )}

          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 h-auto"
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={product?.stock && quantity >= product.stock}
                className="px-3 py-1 h-auto"
              >
                +
              </Button>
            </div>
          </div>

          {product?.stock !== undefined && (
            <p className="mb-6 text-sm">
              {product.stock > 0 
                ? <span className="text-green-600">In stock and ready to ship</span>
                : <span className="text-red-600">Out of stock</span>}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="w-full"
              onClick={handleAddToCart}
              disabled={product?.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={toggleWishlist}
            >
              <Heart 
                className="mr-2 h-4 w-4" 
                fill={isWishlist ? "currentColor" : "none"} 
              />
              {isWishlist ? "Saved" : "Save for Later"}
            </Button>
          </div>
        </div>
      </div>
      
      {product && <ProductDetails product={product} />}
      
      {product && (
        <ProductRecommendations 
          currentProductId={product.id}
          category={product.category}
        />
      )}
    </div>
  );
};

export default ProductDetail;
