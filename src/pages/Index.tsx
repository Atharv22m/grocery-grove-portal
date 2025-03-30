
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { HowItWorks } from "@/components/HowItWorks";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Index: React.FC = () => {
  const { wishlistItems } = useWishlist();
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <HowItWorks />
        
        {wishlistItems.length > 0 && (
          <div className="container mx-auto py-8 px-4">
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">You have {wishlistItems.length} items in your wishlist</h3>
                <p className="text-gray-600">View your saved items and add them to your cart.</p>
              </div>
              <Link to="/wishlist" className="mt-4 md:mt-0">
                <Button className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  View Wishlist
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
