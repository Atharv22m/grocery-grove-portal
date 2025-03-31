
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "./CartContext";
import { OrderService } from "@/services/OrderService";

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
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, removeFromCart } = useCart();

  // Fetch orders when the user logs in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchOrders();
      } else if (event === 'SIGNED_OUT') {
        setOrders([]);
      }
    });

    // Initial fetch
    fetchOrders();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper to save orders to localStorage (for non-logged in users)
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
      
      // Create the order using our service
      const newOrder = await OrderService.createOrder({
        userId: user.id,
        items,
        deliveryInfo: orderData.delivery,
        paymentInfo: orderData.payment
      });
      
      if (!newOrder) {
        throw new Error("Failed to create order");
      }
      
      // Update local state
      setOrders(prev => [newOrder, ...prev]);
      
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
        // Not logged in, try to get orders from local storage
        const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
        return;
      }
      
      // Fetch orders using our service
      const userOrders = await OrderService.fetchUserOrders(user.id);
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
