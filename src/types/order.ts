
export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled";

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

export type Order = {
  id: string;
  user_id: string;
  created_at: string;
  status: OrderStatus;
  delivery_address: {
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
  // These properties are for backwards compatibility with Profile.tsx
  items?: OrderItem[];
  payment_info?: {
    total: number;
    method: string;
  };
};

export type OrderContextType = {
  orders: Order[];
  currentOrder: Order | null;
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
  }) => Promise<Order | null>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  getUserOrders: () => Promise<Order[]>;
  fetchOrders: () => Promise<Order[]>; // Add this method to match what's used in Profile.tsx
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
};
