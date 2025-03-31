
import { supabase } from "@/integrations/supabase/client";
import { OrderType, OrderItem } from "@/contexts/OrderContext";

export const OrderService = {
  async createOrder(order: {
    userId: string;
    items: OrderItem[];
    deliveryInfo: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      phoneNumber: string;
    };
    paymentInfo: {
      method: string;
      total: number;
    };
  }): Promise<OrderType | null> {
    try {
      // Generate a unique ID for the order (let Supabase handle this)
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: order.userId,
          status: "pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;
      if (!orderData) throw new Error("Failed to create order");
      
      const orderId = orderData.id;

      // Insert order items
      const orderItems = order.items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Insert delivery info
      const { error: deliveryError } = await supabase
        .from("order_delivery_info")
        .insert({
          order_id: orderId,
          full_name: order.deliveryInfo.fullName,
          address: order.deliveryInfo.address,
          city: order.deliveryInfo.city,
          state: order.deliveryInfo.state,
          zip_code: order.deliveryInfo.zipCode,
          phone_number: order.deliveryInfo.phoneNumber
        });

      if (deliveryError) throw deliveryError;

      // Insert payment info
      const { error: paymentError } = await supabase
        .from("order_payment_info")
        .insert({
          order_id: orderId,
          method: order.paymentInfo.method,
          total: order.paymentInfo.total
        });

      if (paymentError) throw paymentError;

      // Return the complete order object
      return {
        id: orderId,
        user_id: order.userId,
        items: order.items,
        delivery_info: {
          fullName: order.deliveryInfo.fullName,
          address: order.deliveryInfo.address,
          city: order.deliveryInfo.city,
          state: order.deliveryInfo.state,
          zipCode: order.deliveryInfo.zipCode,
          phoneNumber: order.deliveryInfo.phoneNumber
        },
        payment_info: {
          method: order.paymentInfo.method,
          total: order.paymentInfo.total
        },
        status: "pending",
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  },

  async fetchUserOrders(userId: string): Promise<OrderType[]> {
    try {
      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      if (!orders) return [];

      // For each order, fetch items, delivery info, and payment info
      const orderDetailsPromises = orders.map(async (order) => {
        // Fetch order items
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        if (itemsError) throw itemsError;

        // Fetch delivery info
        const { data: deliveryInfo, error: deliveryError } = await supabase
          .from("order_delivery_info")
          .select("*")
          .eq("order_id", order.id)
          .single();

        if (deliveryError) throw deliveryError;

        // Fetch payment info
        const { data: paymentInfo, error: paymentError } = await supabase
          .from("order_payment_info")
          .select("*")
          .eq("order_id", order.id)
          .single();

        if (paymentError) throw paymentError;

        // Construct and return the order object
        return {
          id: order.id,
          user_id: order.user_id,
          items: items?.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            name: item.name
          })) || [],
          delivery_info: {
            fullName: deliveryInfo?.full_name || "",
            address: deliveryInfo?.address || "",
            city: deliveryInfo?.city || "",
            state: deliveryInfo?.state || "",
            zipCode: deliveryInfo?.zip_code || "",
            phoneNumber: deliveryInfo?.phone_number || ""
          },
          payment_info: {
            method: paymentInfo?.method || "",
            total: paymentInfo?.total || 0
          },
          status: order.status,
          created_at: order.created_at
        };
      });

      return Promise.all(orderDetailsPromises);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }
};
