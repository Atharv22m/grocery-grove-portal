
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductType } from "@/types/product";
import { useOrders } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { ShoppingCart, CreditCard } from "lucide-react";

const BuyNow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    // Get product from navigation state
    if (location.state?.product) {
      setProduct(location.state.product);
      // Get quantity from navigation state or default to 1
      setQuantity(location.state.quantity || 1);
    } else {
      // Redirect if no product data
      navigate("/products");
      toast.error("Product information not available");
    }
  }, [location.state, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;
    
    try {
      setIsLoading(true);
      
      // Create cart-like items array for a single product
      const orderItems = [{
        id: "direct-buy",
        product_id: product.id,
        quantity: quantity,
        product: product
      }];
      
      // Calculate total
      const total = product.price * quantity;
      
      // Create order using the OrderContext
      const order = await createOrder({
        delivery: deliveryInfo,
        payment: {
          method: paymentMethod,
          total: total
        }
      });
      
      if (order) {
        navigate("/order-confirmation", { 
          state: { 
            orderDetails: {
              items: orderItems,
              delivery: deliveryInfo,
              payment: {
                method: paymentMethod,
                total: total
              },
              orderNumber: order.id,
              orderDate: order.created_at
            }
          }
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto py-12 px-4 pt-24">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-8 px-4 pt-24">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <div className="flex gap-4 mb-4">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-24 h-24 object-cover rounded-md"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/200x200?text=Product';
                }}
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <div className="flex items-center mt-2">
                  <span className="font-medium">₹{product.price}</span>
                  <span className="mx-2 text-gray-400">×</span>
                  <div className="flex items-center border rounded">
                    <button 
                      className="px-2 py-1 border-r"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >-</button>
                    <span className="px-3">{quantity}</span>
                    <button 
                      className="px-2 py-1 border-l"
                      onClick={() => setQuantity(quantity + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span>Price ({quantity} {quantity > 1 ? 'items' : 'item'})</span>
                <span>₹{(product.price * quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{(product.price * quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Order Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Delivery & Payment</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={deliveryInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                  <Textarea
                    id="address"
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                    <Input
                      id="city"
                      name="city"
                      value={deliveryInfo.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                    <Input
                      id="state"
                      name="state"
                      value={deliveryInfo.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-1">ZIP Code</label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={deliveryInfo.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={deliveryInfo.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mr-2"
                      />
                      <label htmlFor="cod" className="flex items-center">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="mr-2"
                      />
                      <label htmlFor="card" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hover"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BuyNow;
