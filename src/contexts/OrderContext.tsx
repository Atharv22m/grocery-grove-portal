
import React, { createContext, useContext, useState } from "react";
import { Order, OrderContextType, OrderStatus } from "@/types/order";
import { 
  createOrder as createOrderService, 
  getOrderById as getOrderByIdService,
  getUserOrders as getUserOrdersService, 
  updateOrderStatus as updateOrderStatusService,
  cancelOrder as cancelOrderService,
  getOrderItems
} from "@/services/OrderService";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define OrderItem type
export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name: string;
  product?: {
    name: string;
    image: string;
    unit?: string;
  };
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, clearCart } = useCart();

  const createOrder = async (orderData: {
    delivery: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phoneNumber: string;
    };
    payment: {
      method: string;
      total: number;
    };
  }) => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to place an order");
        return null;
      }
      
      console.log("Creating order with items:", cartItems);
      console.log("User ID:", user.id);
      console.log("Order data:", orderData);
      
      const order = await createOrderService(
        user.id, 
        cartItems, 
        orderData.delivery, 
        orderData.payment
      );
      
      if (order) {
        await clearCart();
        setCurrentOrder(order);
        
        // Add the new order to the orders list
        setOrders(prevOrders => [order, ...prevOrders]);
        
        toast.success("Order placed successfully!");
        return order;
      } else {
        toast.error("Failed to place order");
        return null;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An error occurred while placing your order");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderById = async (orderId: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching order by ID:", orderId);
      const order = await getOrderByIdService(orderId);
      
      if (order) {
        console.log("Found order:", order);
        setCurrentOrder(order);
      } else {
        console.log("No order found with ID:", orderId);
      }
      
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to fetch order details");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserOrders = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return [];
      }
      
      console.log("Fetching orders for user ID:", user.id);
      const userOrders = await getUserOrdersService(user.id);
      console.log("Fetched orders:", userOrders);
      
      setOrders(userOrders);
      return userOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Add this method to match what's used in Profile.tsx
  const fetchOrders = async () => {
    return await getUserOrders();
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setIsLoading(true);
      const success = await updateOrderStatusService(orderId, status);
      
      if (success) {
        // Update the orders state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        );
        
        // Update current order if it's the one being modified
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder({ ...currentOrder, status });
        }
        
        toast.success(`Order status updated to ${status}`);
        return true;
      } else {
        toast.error("Failed to update order status");
        return false;
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("An error occurred while updating order status");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      setIsLoading(true);
      const success = await cancelOrderService(orderId);
      
      if (success) {
        // Update the orders state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: "cancelled" as OrderStatus } : order
          )
        );
        
        // Update current order if it's the one being cancelled
        if (currentOrder && currentOrder.id === orderId) {
          setCurrentOrder({ ...currentOrder, status: "cancelled" as OrderStatus });
        }
        
        toast.success("Order cancelled successfully");
        return true;
      } else {
        toast.error("Failed to cancel order");
        return false;
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("An error occurred while cancelling the order");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider 
      value={{ 
        orders, 
        currentOrder, 
        isLoading, 
        createOrder, 
        getOrderById, 
        getUserOrders,
        fetchOrders, 
        updateOrderStatus,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
