import React from 'react';
import { ProductType } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { PackageCheck, ShoppingBag, Box, Info } from 'lucide-react';

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Box className="text-gray-500 mt-1" size={18} />
            <div>
              <p className="font-medium">Category</p>
              <p className="text-gray-600">{product.category}</p>
            </div>
          </div>
          {product.weight && (
            <div className="flex items-start gap-2">
              <ShoppingBag className="text-gray-500 mt-1" size={18} />
              <div>
                <p className="font-medium">Weight/Volume</p>
                <p className="text-gray-600">{product.weight}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2">
            <PackageCheck className="text-gray-500 mt-1" size={18} />
            <div>
              <p className="font-medium">Stock Status</p>
              <p className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Info className="text-gray-500 mt-1" size={18} />
            <div>
              <p className="font-medium">Unit</p>
              <p className="text-gray-600">{product.unit}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;

interface ProductDetailsProps {
  product: ProductType;
}
