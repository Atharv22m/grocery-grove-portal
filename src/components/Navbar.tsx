import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary">
              Grocery Store
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </a>
            <a href="/categories" className="text-gray-700 hover:text-primary transition-colors">
              Categories
            </a>
            <a href="/login" className="text-gray-700 hover:text-primary transition-colors">
              Login
            </a>
            <Button className="bg-primary hover:bg-primary-hover text-white">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </a>
              <a href="/categories" className="text-gray-700 hover:text-primary transition-colors">
                Categories
              </a>
              <a href="/login" className="text-gray-700 hover:text-primary transition-colors">
                Login
              </a>
              <Button className="bg-primary hover:bg-primary-hover text-white">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};