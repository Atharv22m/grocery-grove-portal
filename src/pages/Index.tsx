
import React, { useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { HowItWorks } from "@/components/HowItWorks";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Footer } from "@/components/Footer";

const Index: React.FC = () => {
  const { wishlistItems } = useWishlist();
  
  useEffect(() => {
    // Animate sections on load
    const sections = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <Hero />
        
        <div className="animate-on-scroll opacity-0 transition-all duration-1000 ease-out">
          <Categories />
        </div>
        
        <div className="animate-on-scroll opacity-0 transition-all duration-1000 ease-out delay-300">
          <FeaturedProducts />
        </div>
        
        <div className="animate-on-scroll opacity-0 transition-all duration-1000 ease-out delay-500">
          <HowItWorks />
        </div>
        
        {wishlistItems.length > 0 && (
          <div className="container mx-auto py-8 px-4 animate-on-scroll opacity-0 transition-all duration-1000 ease-out delay-700">
            <div className="bg-gray-50 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div>
                <h3 className="text-xl font-bold mb-2">You have {wishlistItems.length} items in your wishlist</h3>
                <p className="text-gray-600">View your saved items and add them to your cart.</p>
              </div>
              <Link to="/wishlist" className="mt-4 md:mt-0">
                <Button className="flex items-center bg-primary hover:bg-primary-hover hover:scale-105 transition-all duration-300">
                  <Heart className="mr-2 h-4 w-4" />
                  View Wishlist
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
