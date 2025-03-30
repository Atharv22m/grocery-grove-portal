
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductType } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { products } from '@/components/FeaturedProducts';
import { toast } from 'sonner';

type WishlistContextType = {
  wishlistItems: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load wishlist from local storage on initial render
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        // Try to get user session
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // If logged in, get wishlist from database
          // This is just placeholder - in a real app, we would fetch from a wishlists table
          // For now, we'll use localStorage for all users
        }
        
        // For all users (or if not logged in), get from localStorage
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const addToWishlist = async (productId: string) => {
    try {
      setWishlistItems(prev => {
        if (!prev.includes(productId)) {
          const product = products.find(p => p.id === productId);
          if (product) {
            toast.success(`${product.name} added to wishlist`);
            return [...prev, productId];
          }
        }
        return prev;
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      setWishlistItems(prev => {
        const product = products.find(p => p.id === productId);
        if (product) {
          toast.success(`${product.name} removed from wishlist`);
        }
        return prev.filter(id => id !== productId);
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    try {
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
