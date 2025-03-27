
import React from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, isLoading } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
    toast.success("Proceeding to checkout...");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-6">Your cart is currently empty</p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="p-6 pb-3">
                  <h2 className="text-lg font-semibold">Cart Items ({cartItems.length})</h2>
                </div>
                <Separator />
                
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 border-b last:border-b-0">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img 
                          src={item.product.image || 'https://placehold.co/200x200?text=Product'} 
                          alt={item.product.name}
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium text-lg mb-1">{item.product.name}</h3>
                        <p className="text-primary font-semibold mb-2">₹{item.product.price}</p>
                        
                        <div className="flex items-center gap-6 mt-3">
                          <div className="flex items-center border rounded-md">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-l-md rounded-r-none"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                }
                              }}
                              disabled={isLoading || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-r-md rounded-l-none"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFromCart(item.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{calculateTotal() > 500 ? 'Free' : '₹40.00'}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between mb-6">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    ₹{(calculateTotal() + (calculateTotal() > 500 ? 0 : 40)).toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  className="w-full bg-primary hover:bg-primary-hover"
                  onClick={handleCheckout}
                  disabled={isLoading || cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
