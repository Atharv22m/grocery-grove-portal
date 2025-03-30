
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft, PlusCircle, MinusCircle, Star, Clock } from "lucide-react";
import { products } from "@/components/FeaturedProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  stock: number;
  weight?: string;
  discount?: number;
  unit?: string; // Added unit property to match the data
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the API/database
    // For now, we'll use our mock data
    const fetchProduct = () => {
      setIsLoading(true);
      try {
        const foundProduct = products.find(p => p.id === id);
        if (foundProduct) {
          // Make sure we're creating a complete ProductType object
          setProduct({
            id: foundProduct.id,
            name: foundProduct.name,
            description: foundProduct.description || "No description available", // Provide defaults for required fields
            price: foundProduct.price,
            image: foundProduct.image,
            category: foundProduct.category || "General", // Default category
            rating: foundProduct.rating || 4, // Default rating
            stock: foundProduct.stock || 10, // Default stock
            unit: foundProduct.unit,
            weight: foundProduct.weight,
            discount: foundProduct.discount,
          });
        } else {
          toast.error("Product not found");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      // Pass only the product ID as expected by the addToCart function
      addToCart(product.id);
      toast.success(`${product.name} added to cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-xl bg-gray-200 h-96 w-96"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate("/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate discounted price if applicable
  const actualPrice = product?.discount
    ? product.price - (product.price * product.discount / 100)
    : product?.price;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/products")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full h-auto object-contain rounded-md"
              style={{ maxHeight: "400px" }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {product?.category}
                </span>
                <div className="flex items-center ml-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (product?.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({product?.rating})</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mt-2">{product?.name}</h1>
              <div className="mt-2">
                {product?.discount ? (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">₹{actualPrice?.toFixed(2)}</span>
                    <span className="ml-2 text-lg text-gray-400 line-through">₹{product?.price.toFixed(2)}</span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-primary">₹{product?.price.toFixed(2)}</span>
                )}
              </div>
            </div>

            {product?.weight && (
              <div className="text-sm text-gray-500">Weight: {product.weight}</div>
            )}

            <div className="border-t border-b border-gray-200 py-4">
              <div className="prose max-w-none">
                <p className="text-gray-700">{product?.description}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-r-none"
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <div className="px-4 py-2 border-l border-r border-gray-300">
                  {quantity}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= (product?.stock || 0)}
                  className="h-10 w-10 rounded-l-none"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <span className="ml-4 text-sm text-gray-500">
                {product?.stock} items available
              </span>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                <span>Same day delivery available</span>
              </div>
            </div>

            {/* Product Details Card */}
            <Card className="mt-8">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Product Details</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex">
                    <span className="font-medium w-28">Category:</span>
                    <span className="text-gray-600">{product?.category}</span>
                  </li>
                  {product?.weight && (
                    <li className="flex">
                      <span className="font-medium w-28">Weight:</span>
                      <span className="text-gray-600">{product.weight}</span>
                    </li>
                  )}
                  {product?.unit && (
                    <li className="flex">
                      <span className="font-medium w-28">Unit:</span>
                      <span className="text-gray-600">{product.unit}</span>
                    </li>
                  )}
                  <li className="flex">
                    <span className="font-medium w-28">Stock:</span>
                    <span className="text-gray-600">{product?.stock} items</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
