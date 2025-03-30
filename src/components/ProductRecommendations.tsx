
import React from 'react';
import { ProductType } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import ProductRating from './ProductRating';

interface ProductRecommendationsProps {
  currentProductId: string;
  category: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ 
  currentProductId, 
  category 
}) => {
  // Import products from the same file that ProductDetail uses
  const { products } = require('@/components/FeaturedProducts');
  
  // Get products from the same category, excluding the current one
  const recommendations = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 4);
  
  if (recommendations.length === 0) return null;
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product: ProductType) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <Link to={`/product/${product.id}`}>
              <div className="p-4 h-40 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full object-contain" 
                />
              </div>
              <CardContent>
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                <ProductRating rating={product.rating} size={14} showText={false} />
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-semibold">₹{product.price}</span>
                  <span className="text-xs text-gray-500">{product.unit}</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;
