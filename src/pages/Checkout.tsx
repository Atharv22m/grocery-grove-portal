
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Checkout() {
  const { cartItems, isLoading } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod"
  });
  const [processing, setProcessing] = useState(false);

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    const shipping = subtotal > 500 ? 0 : 40;
    return subtotal + shipping;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all the required fields");
      return;
    }
    setStep(2);
  };

  const handleCompleteOrder = async () => {
    try {
      setProcessing(true);
      
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to complete your order");
        navigate("/auth");
        return;
      }
      
      // In a real app, we would create an order in the database
      // and clear the cart
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Order placed successfully!");
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading checkout details...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">Your cart is empty. Please add items to checkout.</p>
          <Button onClick={() => navigate("/")}>Shop Now</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {step === 1 ? (
                <form onSubmit={handleSubmitAddress}>
                  <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Address *</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium mb-1">Pincode *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-hover">
                    Continue to Payment
                  </Button>
                </form>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="h-4 w-4"
                      />
                      <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        disabled
                        className="h-4 w-4"
                      />
                      <label htmlFor="card">Credit/Debit Card (Coming Soon)</label>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-400">
                      <input
                        type="radio"
                        id="upi"
                        name="paymentMethod"
                        value="upi"
                        disabled
                        className="h-4 w-4"
                      />
                      <label htmlFor="upi">UPI (Coming Soon)</label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handleCompleteOrder} 
                      className="flex-1 bg-primary hover:bg-primary-hover"
                      disabled={processing}
                    >
                      {processing ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 flex-shrink-0">
                      <img 
                        src={item.product.image || 'https://placehold.co/100x100?text=Product'} 
                        alt={item.product.name}
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-sm">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0) > 500 
                      ? 'Free' 
                      : '₹40.00'}
                  </span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
