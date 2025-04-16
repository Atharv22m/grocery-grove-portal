
import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { OrderStatusDisplay, OrderStatusTimeline } from "@/components/OrderStatus";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    // If we don't have order details, redirect to home
    if (!orderDetails) {
      navigate("/");
      return;
    }
    
    // Clear the cart items
    const clearCart = async () => {
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
    };
    
    clearCart();
  }, [navigate, orderDetails, removeFromCart]);

  if (!orderDetails) {
    return null; // Will redirect in useEffect
  }

  const { 
    items, 
    delivery, 
    payment, 
    orderNumber, 
    orderDate 
  } = orderDetails;

  const formattedDate = new Date(orderDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(orderDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your order. We've received your order and will begin processing it soon.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Order #{orderNumber}</h2>
                <p className="text-gray-600">{formattedDate} at {formattedTime}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>

            <Separator className="mb-6" />
            
            <div className="mb-6">
              <OrderStatusDisplay status="pending" createdAt={orderDate} />
              <OrderStatusTimeline order={{ 
                id: orderNumber, 
                user_id: "", 
                created_at: orderDate, 
                status: "pending", 
                delivery_address: delivery, 
                payment: payment 
              }} />
            </div>

            <Separator className="mb-6" />

            <div className="mb-6">
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span>
                        {item.quantity} x {item.product.name}
                      </span>
                    </div>
                    <span className="font-medium">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="mb-6">
              <h3 className="font-semibold mb-4">Delivery Address</h3>
              <address className="not-italic">
                <p>{delivery.fullName}</p>
                <p>{delivery.address}</p>
                <p>{delivery.city}, {delivery.state} {delivery.zipCode}</p>
                <p>Phone: {delivery.phoneNumber}</p>
              </address>
            </div>

            <Separator className="mb-6" />

            <div className="mb-6">
              <h3 className="font-semibold mb-4">Payment Information</h3>
              <p>
                <span className="text-gray-600">Payment Method: </span>
                <span className="font-medium">
                  {payment.method === "cod" ? "Cash on Delivery" : payment.method}
                </span>
              </p>
              <p>
                <span className="text-gray-600">Total Amount: </span>
                <span className="font-medium">₹{payment.total.toFixed(2)}</span>
              </p>
            </div>

            <Separator className="mb-6" />

            <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You'll receive an email with your order details shortly. For Cash on Delivery orders, please keep the exact amount ready.
              </p>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4" />
              Return to Home
            </Button>
            <Button 
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
