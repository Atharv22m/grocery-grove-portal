
import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImageOff } from "lucide-react";
import { useOrders } from "@/contexts/OrderContext";
import { OrderStatusDisplay, OrderStatusTimeline, OrderStatusBadge } from "@/components/OrderStatus";
import { getOrderItems } from "@/services/OrderService";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
    unit?: string;
  };
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, currentOrder, isLoading, cancelOrder, updateOrderStatus } = useOrders();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      if (id) {
        await getOrderById(id);
      }
    };
    
    loadOrder();
  }, [id, getOrderById]);

  useEffect(() => {
    const loadOrderItems = async () => {
      if (id) {
        try {
          setLoadingItems(true);
          const items = await getOrderItems(id);
          setOrderItems(items);
        } catch (error) {
          console.error("Error loading order items:", error);
        } finally {
          setLoadingItems(false);
        }
      }
    };
    
    loadOrderItems();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!currentOrder || !id) return;
    
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        setCancellingOrder(true);
        const success = await cancelOrder(id);
        if (success) {
          toast.success("Order cancelled successfully");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      } finally {
        setCancellingOrder(false);
      }
    }
  };

  const canCancelOrder = currentOrder?.status === "pending" || currentOrder?.status === "processing";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
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
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Order not found</h2>
            <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate("/orders")}>View All Orders</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">Order #{currentOrder.id.slice(0, 8).toUpperCase()}</h1>
                    <OrderStatusBadge status={currentOrder.status} />
                  </div>
                  <p className="text-gray-600">
                    {formatDate(currentOrder.created_at)}
                  </p>
                </div>
                
                {canCancelOrder && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleCancelOrder}
                    disabled={cancellingOrder}
                  >
                    {cancellingOrder ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </div>
              
              <div className="mb-6">
                <OrderStatusDisplay status={currentOrder.status} createdAt={currentOrder.created_at} />
                <OrderStatusTimeline order={currentOrder} />
              </div>
              
              <Separator className="mb-6" />
              
              <h2 className="text-lg font-semibold mb-4">Items</h2>
              {loadingItems ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="bg-gray-200 h-16 w-16 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : orderItems.length === 0 ? (
                <p className="text-gray-500">No items found for this order.</p>
              ) : (
                <div className="space-y-4">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain rounded-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = "w-full h-full flex items-center justify-center bg-gray-100 rounded-md";
                                fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/></svg>`;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md">
                            <ImageOff className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ₹{item.price.toFixed(2)}
                          {item.product.unit && ` (per ${item.product.unit})`}
                        </p>
                      </div>
                      <div className="font-bold text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
                  <address className="not-italic">
                    <p className="font-medium">{currentOrder.delivery_address.fullName}</p>
                    <p>{currentOrder.delivery_address.address}</p>
                    <p>{currentOrder.delivery_address.city}, {currentOrder.delivery_address.state} {currentOrder.delivery_address.zipCode}</p>
                    <p className="mt-2">Phone: {currentOrder.delivery_address.phoneNumber}</p>
                  </address>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">
                        {currentOrder.payment.method === "cod" ? "Cash on Delivery" : currentOrder.payment.method}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₹{currentOrder.payment.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
