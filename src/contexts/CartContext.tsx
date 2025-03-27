
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { products } from "@/components/FeaturedProducts";

type CartItem = {
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

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // For demo purposes, we'll use localStorage for cart when user is not logged in
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
        return;
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      // Map the Supabase response to match our CartItem type
      const mappedCartItems: CartItem[] = (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          name: item.products.name,
          price: item.products.price,
          image: item.products.image_url || 'https://placehold.co/200x200?text=Product'
        }
      }));

      setCartItems(mappedCartItems);
    } catch (error: any) {
      console.error("Error fetching cart items:", error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle guest cart with local storage
        const productToAdd = products.find(p => p.id === productId);
        
        if (!productToAdd) {
          toast.error("Product not found");
          return;
        }
        
        const newItem: CartItem = {
          id: `local-${Date.now()}`,
          product_id: productId,
          quantity: 1,
          product: {
            name: productToAdd.name,
            price: productToAdd.price,
            image: productToAdd.image,
            unit: productToAdd.unit
          }
        };
        
        const updatedCart = [...cartItems];
        const existingItemIndex = updatedCart.findIndex(item => item.product_id === productId);
        
        if (existingItemIndex >= 0) {
          updatedCart[existingItemIndex].quantity += 1;
        } else {
          updatedCart.push(newItem);
        }
        
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return;
      }

      const { data, error } = await supabase
        .from("cart_items")
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        }, {
          onConflict: 'user_id,product_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) throw error;
      
      await fetchCartItems();
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
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle local storage cart for guest users
        const updatedCart = cartItems.filter(item => item.id !== cartItemId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return;
      }
      
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) throw error;
      
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
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle local storage cart for guest users
        const updatedCart = cartItems.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return;
      }
      
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", cartItemId);

      if (error) throw error;
      
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
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
