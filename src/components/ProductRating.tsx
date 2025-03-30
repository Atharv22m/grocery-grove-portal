
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface ProductRatingProps {
  rating: number;
  showText?: boolean;
  size?: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ 
  rating, 
  showText = true,
  size = 16 
}) => {
  // Calculate full and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
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
      {showText && <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>}
    </div>
  );
};

export default ProductRating;
