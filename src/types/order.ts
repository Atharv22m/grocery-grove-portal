
export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled";

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
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
};
