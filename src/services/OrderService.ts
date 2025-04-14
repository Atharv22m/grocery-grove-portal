
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/order";
import { CartItem } from "@/types/cart";

export const createOrder = async (
  userId: string,
  cartItems: CartItem[],
  deliveryInfo: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  },
  paymentInfo: {
    method: string;
    total: number;
  }
): Promise<Order | null> => {
  try {
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending" as OrderStatus,
        delivery_address: deliveryInfo,
        payment: paymentInfo,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return orders || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
};

export const cancelOrder = async (orderId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" as OrderStatus })
      .eq("id", orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error cancelling order:", error);
    return false;
  }
};

export const getOrderItems = async (orderId: string) => {
  try {
    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select(`
        id,
        order_id,
        product_id,
        quantity,
        price,
        products (
          name,
          image_url,
          unit
        )
      `)
      .eq("order_id", orderId);

    if (error) throw error;
    
    return orderItems.map(item => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product: {
        name: item.products.name,
        image: item.products.image_url || 'https://placehold.co/200x200?text=Product',
        unit: item.products.unit
      }
    }));
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};
