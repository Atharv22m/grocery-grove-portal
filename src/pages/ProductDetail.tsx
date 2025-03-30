
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { ProductType } from '@/types/product';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity);
        toast.success(`Added ${quantity} ${product.name} to cart`);
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart");
      }
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-96 object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-primary mr-4">
              ₹{product.price}
            </span>
            <span className="text-gray-500">per {product.unit}</span>
          </div>

          {product.discount && (
            <div className="mb-4">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {product.discount}% OFF
              </span>
            </div>
          )}

          <div className="flex items-center mb-4">
            <span className="mr-4">Quantity:</span>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="mx-4">{quantity}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setQuantity(quantity + 1)}
                disabled={product.stock && quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          {product.stock !== undefined && (
            <p className="mb-4 text-gray-600">
              {product.stock > 0 
                ? `${product.stock} items left in stock` 
                : 'Out of stock'}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="w-full bg-primary hover:bg-primary-hover"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
