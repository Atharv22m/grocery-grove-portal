
import React, { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, User, LogOut, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, isLoading, signOut, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const cartItemCount = cartItems.length;
  const wishlistItemCount = wishlistItems.length;

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`bg-white shadow-sm fixed w-full z-50 navbar-container ${scrolled ? 'navbar-scroll' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="text-2xl font-bold text-primary">
              Grocery Store
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-gray-700 hover:text-primary transition-colors nav-item ${isActive("/")}`}>
              Home
            </Link>
            <Link to="/products" className={`text-gray-700 hover:text-primary transition-colors nav-item ${isActive("/products")}`}>
              Products
            </Link>
            
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                    {user?.primaryEmailAddress?.emailAddress ? (
                      <span className="max-w-[120px] truncate">
                        {user.primaryEmailAddress.emailAddress.split('@')[0]}
                      </span>
                    ) : (
                      <UserButton afterSignOutUrl="/" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/auth">
                  <Button variant="outline" className="hover:bg-gray-100 hover:border-primary">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </motion.div>
            )}
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/wishlist">
                <Button variant="outline" className="relative hover:bg-gray-100 hover:border-primary">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                  {wishlistItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {wishlistItemCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/cart">
                <Button className="bg-primary hover:bg-primary-hover text-white relative">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
            </motion.div>
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
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 animate-fade-in"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary transition-colors nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary transition-colors nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              <Link 
                to="/wishlist" 
                className="text-gray-700 hover:text-primary transition-colors flex items-center nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="inline mr-2 h-4 w-4" />
                Wishlist
                {wishlistItemCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              
              {isLoading ? (
                <div className="h-8 w-24 rounded bg-gray-200 animate-pulse"></div>
              ) : isSignedIn ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary transition-colors nav-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="inline mr-2 h-4 w-4" />
                    My Account
                  </Link>
                  <Button 
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-gray-700 hover:text-primary transition-colors nav-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="inline mr-2 h-4 w-4" />
                  Login
                </Link>
              )}
              
              <Link 
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button className="bg-primary hover:bg-primary-hover text-white relative w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute top-1/2 -translate-y-1/2 ml-12 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
