
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "./CartContext";

type OrderItem = {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
};

type OrderType = {
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

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cartItems, removeFromCart } = useCart();

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
      
      const newOrder = {
        user_id: user.id,
        items,
        delivery_info: orderData.delivery,
        payment_info: orderData.payment,
        status: "pending" as const,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("orders")
        .insert(newOrder)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const createdOrder = data as OrderType;
      
      // Add to local state
      setOrders(prev => [createdOrder, ...prev]);
      
      // Clear cart after successful order
      for (const item of cartItems) {
        await removeFromCart(item.id);
      }
      
      toast.success("Order placed successfully");
      return createdOrder;
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
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setOrders(data as OrderType[]);
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
