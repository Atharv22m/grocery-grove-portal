
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType } from "@/types/cart";
import { fetchCartItems, addItemToCart, removeItemFromCart, updateItemQuantity } from "@/services/CartService";
import { toast } from "sonner";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCartItems = async () => {
      const items = await fetchCartItems();
      setCartItems(items);
    };
    
    loadCartItems();
  }, []);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      await addItemToCart(productId, quantity);
      const updatedCart = await fetchCartItems();
      setCartItems(updatedCart);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      setIsLoading(true);
      await removeItemFromCart(cartItemId);
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
    } catch (error: any) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setIsLoading(true);
      await updateItemQuantity(cartItemId, quantity);
      setCartItems(cartItems.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      ));
    } catch (error: any) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
