
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '@/components/FeaturedProducts';
import { ProductType } from '@/types/product';
import { toast } from 'sonner';

const Wishlist: React.FC = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<ProductType[]>([]);
  
  useEffect(() => {
    // Filter products to only include those in the wishlist
    const filteredProducts = products.filter(product => 
      wishlistItems.includes(product.id)
    );
    setWishlistProducts(filteredProducts);
  }, [wishlistItems]);

  const handleAddToCart = async (product: ProductType) => {
    try {
      await addToCart(product.id);
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    await clearWishlist();
    toast.success('Wishlist cleared');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center pt-16">
            <Heart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-6 text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500">Add items to your wishlist to save them for later</p>
            <Button 
              className="mt-6 bg-primary hover:bg-primary-hover"
              onClick={() => navigate('/products')}
            >
              Browse Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Wishlist</h1>
          <Button 
            variant="outline" 
            className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
            onClick={handleClearWishlist}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Wishlist
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <Link to={`/product/${product.id}`} className="block">
                <img 
                  src={product.image || 'https://placehold.co/300x200?text=Product'} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              
              <div className="p-4">
                <Link 
                  to={`/product/${product.id}`}
                  className="block font-medium hover:text-primary transition-colors truncate"
                >
                  {product.name}
                </Link>
                
                <p className="text-gray-600 mt-1">₹{product.price} per {product.unit}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(product.id)}
                    className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary-hover"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/products')}
            className="hover:bg-gray-100"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
