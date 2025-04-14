
export type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
    unit?: string;
  };
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
};
