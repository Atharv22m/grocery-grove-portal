import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/cart";
import { products } from "@/components/FeaturedProducts";

export const fetchCartItems = async (): Promise<CartItem[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        return JSON.parse(localCart);
      }
      return [];
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

    return (data || []).map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      product: {
        name: item.products.name,
        price: item.products.price,
        image: item.products.image_url || 'https://placehold.co/200x200?text=Product',
        unit: item.products?.unit
      }
    }));
  } catch (error: any) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

export const addItemToCart = async (productId: string, quantity: number = 1): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const localCart = localStorage.getItem('cart');
    let cartItems: CartItem[] = localCart ? JSON.parse(localCart) : [];
    
    const productToAdd = products.find(p => p.id === productId);
    
    if (!productToAdd) {
      throw new Error("Product not found");
    }
    
    const newItem: CartItem = {
      id: `local-${Date.now()}`,
      product_id: productId,
      quantity: quantity,
      product: {
        name: productToAdd.name,
        price: productToAdd.price,
        image: productToAdd.image,
        unit: productToAdd.unit
      }
    };
    
    const existingItemIndex = cartItems.findIndex(item => item.product_id === productId);
    
    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push(newItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    return;
  }

  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();
  
  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);
    
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: quantity
      });
    
    if (error) throw error;
  }
};

export const removeItemFromCart = async (cartItemId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const cartItems: CartItem[] = JSON.parse(localCart);
      const updatedCart = cartItems.filter(item => item.id !== cartItemId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    return;
  }
  
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw error;
};

export const updateItemQuantity = async (cartItemId: string, quantity: number): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      const cartItems: CartItem[] = JSON.parse(localCart);
      const updatedCart = cartItems.map(item => 
        item.id === cartItemId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    return;
  }
  
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) throw error;
};

export const clearAllCartItems = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    localStorage.removeItem('cart');
    return;
  }
  
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
};
