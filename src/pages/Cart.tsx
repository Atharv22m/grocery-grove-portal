import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ImageOff, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, isLoading } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      setRemovingId(cartItemId);
      await removeFromCart(cartItemId);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(cartItemId);
      await updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + 40; // 40 rupees delivery fee
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-6">
                  {cartItems.map(item => (
                    <div key={item.id}>
                      <div className="flex items-center gap-4">
                        {/* Product image */}
                        <div className="w-20 h-20 flex-shrink-0">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = "w-full h-full flex flex-col items-center justify-center text-gray-400";
                                  fallback.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><line x1="2" y1="2" x2="22" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/><path d="M14 14v6"/><path d="M14 14h6"/><path d="M6 14v3"/><path d="M6 14h3"/><path d="M2 6h12"/><path d="M20 12v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6"/></svg>
                                  `;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <ImageOff size={24} />
                            </div>
                          )}
                        </div>

                        {/* Product details */}
                        <div className="flex-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.product.unit && `Per ${item.product.unit}`}
                          </p>
                          <div className="flex items-center mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updatingId === item.id || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-3">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingId === item.id}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Price and remove button */}
                        <div className="text-right">
                          <p className="font-bold text-primary">₹{item.product.price * item.quantity}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-600 mt-2"
                            onClick={() => handleRemoveFromCart(item.id)}
                            disabled={removingId === item.id}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {removingId === item.id ? "Removing..." : "Remove"}
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>₹{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>₹40.00</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between py-4 font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary-hover"
                  onClick={() => navigate("/checkout")}
                  disabled={isLoading || cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <ShoppingCart className="h-24 w-24 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              className="bg-primary hover:bg-primary-hover"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
