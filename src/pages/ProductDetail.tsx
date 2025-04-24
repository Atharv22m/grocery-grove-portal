
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import ProductRating from '@/components/ProductRating';
import ProductRecommendations from '@/components/ProductRecommendations';
import { products } from '@/components/FeaturedProducts';
import { ProductType } from '@/types/product';
import { Loader2 } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we're getting product from our static products list
    const foundProduct = products.find(p => p.id === id);
    
    // Simulate loading
    setTimeout(() => {
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h1>
            <p>Sorry, the product you are looking for does not exist.</p>
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
        <ProductDetails product={product} />
        
        <div className="mt-12">
          <ProductRating productId={product.id} />
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <ProductRecommendations currentProductId={product.id} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
