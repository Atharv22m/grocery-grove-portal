
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "./CartContext";

export type OrderItem = {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
};

export type OrderType = {
  id: string;
  user_id: string;
  items: OrderItem[];
  delivery_info: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  };
  payment_info: {
    method: string;
    total: number;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

type OrderContextType = {
  orders: OrderType[];
  isLoading: boolean;
  createOrder: (orderData: {
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
  }) => Promise<OrderType | null>;
  fetchOrders: () => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// For local storage persistence
const ORDERS_STORAGE_KEY = "grocery_app_orders";

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<OrderType[]>(() => {
    // Initialize from localStorage if available
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  // Helper to save orders to localStorage
  const saveOrdersToStorage = (ordersList: OrderType[]) => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersList));
  };

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
  }): Promise<OrderType | null> => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to place an order");
        return null;
      }
      
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name
      }));
      
      if (items.length === 0) {
        toast.error("Your cart is empty");
        return null;
      }
      
      // Generate a unique ID for the order
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      const newOrder: OrderType = {
        id: orderId,
        user_id: user.id,
        items,
        delivery_info: orderData.delivery,
        payment_info: orderData.payment,
        status: "pending",
        created_at: new Date().toISOString()
      };
      
      // In a real app, we would save this to the database
      // Since we don't have an orders table yet, we'll just save to state and localStorage
      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      saveOrdersToStorage(updatedOrders);
      
      // Clear cart after successful order
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
      
      toast.success("Order placed successfully");
      return newOrder;
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error("Failed to place order: " + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in, no orders to fetch
        return;
      }
      
      // In a real app, we would fetch from the database
      // For now, filter the orders from localStorage for the current user
      const userOrders = orders.filter(order => order.user_id === user.id);
      setOrders(userOrders);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        createOrder,
        fetchOrders
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
