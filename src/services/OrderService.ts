
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/order";
import { CartItem } from "@/types/cart";

// We need to update the database schema types to include orders tables
// This is a temporary fix until the database schema is properly updated
const supabaseCustom = supabase as any;

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
    const { data: order, error: orderError } = await supabaseCustom
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending" as OrderStatus,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Add delivery information
    const { error: deliveryError } = await supabaseCustom
      .from("order_delivery_info")
      .insert({
        order_id: order.id,
        full_name: deliveryInfo.fullName,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        zip_code: deliveryInfo.zipCode,
        phone_number: deliveryInfo.phoneNumber,
      });

    if (deliveryError) throw deliveryError;

    // Add payment information
    const { error: paymentError } = await supabaseCustom
      .from("order_payment_info")
      .insert({
        order_id: order.id,
        method: paymentInfo.method,
        total: paymentInfo.total,
      });

    if (paymentError) throw paymentError;

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
    }));

    const { error: itemsError } = await supabaseCustom
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Format and return the complete order object
    return {
      id: order.id,
      user_id: order.user_id,
      created_at: order.created_at,
      status: order.status,
      delivery_address: deliveryInfo,
      payment: paymentInfo,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    // Get the basic order information
    const { data: order, error } = await supabaseCustom
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) throw error;

    // Get delivery information
    const { data: deliveryInfo, error: deliveryError } = await supabaseCustom
      .from("order_delivery_info")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (deliveryError) throw deliveryError;

    // Get payment information
    const { data: paymentInfo, error: paymentError } = await supabaseCustom
      .from("order_payment_info")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (paymentError) throw paymentError;

    // Format and return the complete order object
    return {
      id: order.id,
      user_id: order.user_id,
      created_at: order.created_at,
      status: order.status,
      delivery_address: {
        fullName: deliveryInfo.full_name,
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        state: deliveryInfo.state,
        zipCode: deliveryInfo.zip_code,
        phoneNumber: deliveryInfo.phone_number,
      },
      payment: {
        method: paymentInfo.method,
        total: paymentInfo.total,
      },
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    // Get all orders for the user
    const { data: orders, error } = await supabaseCustom
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Create an array to hold the complete order objects
    const completeOrders: Order[] = [];

    // For each order, get the delivery and payment information
    for (const order of orders) {
      // Get delivery information
      const { data: deliveryInfo, error: deliveryError } = await supabaseCustom
        .from("order_delivery_info")
        .select("*")
        .eq("order_id", order.id)
        .single();

      if (deliveryError) {
        console.error("Error fetching delivery info:", deliveryError);
        continue;
      }

      // Get payment information
      const { data: paymentInfo, error: paymentError } = await supabaseCustom
        .from("order_payment_info")
        .select("*")
        .eq("order_id", order.id)
        .single();

      if (paymentError) {
        console.error("Error fetching payment info:", paymentError);
        continue;
      }

      // Get order items for compatibility with Profile.tsx
      const orderItems = await getOrderItems(order.id);

      // Format and add the complete order object
      completeOrders.push({
        id: order.id,
        user_id: order.user_id,
        created_at: order.created_at,
        status: order.status,
        delivery_address: {
          fullName: deliveryInfo.full_name,
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state,
          zipCode: deliveryInfo.zip_code,
          phoneNumber: deliveryInfo.phone_number,
        },
        payment: {
          method: paymentInfo.method,
          total: paymentInfo.total,
        },
        // Add these for compatibility with Profile.tsx
        items: orderItems,
        payment_info: {
          method: paymentInfo.method,
          total: paymentInfo.total,
        },
      });
    }

    return completeOrders;
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
    const { error } = await supabaseCustom
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
    const { error } = await supabaseCustom
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
    const { data: orderItems, error } = await supabaseCustom
      .from("order_items")
      .select(`
        id,
        order_id,
        product_id,
        quantity,
        price,
        name,
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
      name: item.name,
      product: {
        name: item.products?.name || item.name,
        image: item.products?.image_url || 'https://placehold.co/200x200?text=Product',
        unit: item.products?.unit
      }
    }));
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};
