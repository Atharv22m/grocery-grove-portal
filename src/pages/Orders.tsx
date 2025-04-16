
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useOrders } from "@/contexts/OrderContext";
import { OrderStatusDisplay, OrderStatusBadge } from "@/components/OrderStatus";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Package, ChevronRight, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { OrderStatus as OrderStatusType } from "@/types/order";

export default function Orders() {
  const { orders, getUserOrders, isLoading, cancelOrder } = useOrders();
  const navigate = useNavigate();
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      await getUserOrders();
    };
    
    loadOrders();
  }, [getUserOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancellingOrderId(orderId);
        const success = await cancelOrder(orderId);
        if (success) {
          toast.success("Order cancelled successfully");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      } finally {
        setCancellingOrderId(null);
      }
    }
  };

  const canCancelOrder = (status: OrderStatusType) => {
    return status === "pending" || status === "processing";
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-6">
              <Package className="h-24 w-24 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to place your first order.
            </p>
            <Button 
              className="bg-primary hover:bg-primary-hover"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-500">
                        Placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {canCancelOrder(order.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                        >
                          {cancellingOrderId === order.id ? "Cancelling..." : "Cancel Order"}
                        </Button>
                      )}
                      <Link to={`/order/${order.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center">
                          View Details
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold mb-2">Delivery Address</h4>
                      <address className="not-italic text-sm text-gray-600">
                        <p>{order.delivery_address.fullName}</p>
                        <p>{order.delivery_address.address}</p>
                        <p>{order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zipCode}</p>
                      </address>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold mb-2">Order Summary</h4>
                      <p className="text-sm text-gray-600">
                        Payment Method: {order.payment.method === "cod" ? "Cash on Delivery" : order.payment.method}
                      </p>
                      <p className="text-sm font-medium">
                        Total Amount: ₹{order.payment.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
