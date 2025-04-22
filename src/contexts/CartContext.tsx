import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType } from "@/types/cart";
import { fetchCartItems, addItemToCart, removeItemFromCart, updateItemQuantity, clearAllCartItems } from "@/services/CartService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isSignedIn } = useAuth();

  useEffect(() => {
    const loadCartItems = async () => {
      setIsLoading(true);
      try {
        const items = await fetchCartItems();
        setCartItems(items);
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCartItems();
  }, [isSignedIn, user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true);
      await addItemToCart(productId, quantity);
      const updatedCart = await fetchCartItems();
      setCartItems(updatedCart);
      toast.success("Item added to cart");
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
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

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await clearAllCartItems();
      setCartItems([]);
      toast.success("Cart cleared successfully");
    } catch (error: any) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isLoading }}>
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
