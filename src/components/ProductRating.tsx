
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface ProductRatingProps {
  rating?: number;
  showText?: boolean;
  size?: number;
  productId?: string;
}

const ProductRating: React.FC<ProductRatingProps> = ({ 
  rating,
  productId, 
  showText = true,
  size = 16 
}) => {
  // If productId is provided but no rating, we would fetch the rating here
  // For now, just use a default rating of 0 if not provided
  const starRating = rating || 0;
  
  // Calculate full and half stars
  const fullStars = Math.floor(starRating);
  const hasHalfStar = starRating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} fill="#FFD700" color="#FFD700" size={size} />;
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} fill="#FFD700" color="#FFD700" size={size} />;
          } else {
            return <Star key={i} color="#D1D5DB" size={size} />;
          }
        })}
      </div>
      {showText && <span className="ml-2 text-sm text-gray-600">({starRating.toFixed(1)})</span>}
    </div>
  );
};

export default ProductRating;
