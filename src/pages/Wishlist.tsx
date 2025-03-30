
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useWishlist } from '@/contexts/WishlistContext';
import { products } from '@/components/FeaturedProducts';
import { ShoppingCart, Trash2, HeartOff, MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ProductType } from '@/types/product';
import { ImageOff } from 'lucide-react';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Filter products to get only wishlist items
  const wishlistProducts = products.filter(product => 
    wishlistItems.includes(product.id)
  );

  const handleAddToCart = async (product: ProductType) => {
    try {
      setLoadingProductId(product.id);
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto py-12 px-4 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          {wishlistProducts.length > 0 && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => clearWishlist()}
            >
              <Trash2 size={16} />
              Clear Wishlist
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse text-lg">Loading wishlist...</div>
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <Card 
                key={product.id}
                className="bg-white p-6 hover:shadow-md transition-shadow"
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
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary-hover"
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingProductId === product.id}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {loadingProductId === product.id ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-gray-500"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HeartOff size={64} className="text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save items you like to your wishlist and find them here later.</p>
            <Link to="/products">
              <Button className="flex items-center gap-2">
                <MoveLeft size={16} />
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
