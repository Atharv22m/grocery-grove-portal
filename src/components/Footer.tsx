
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-on-scroll opacity-0 transition-all duration-700 ease-out">
            <h3 className="text-lg font-semibold text-primary mb-4">Grocery Store</h3>
            <p className="text-gray-600 mb-4">
              Fresh groceries delivered to your doorstep. Shop from our wide selection of 
              quality products at great prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="animate-on-scroll opacity-0 transition-all duration-700 ease-out delay-100">
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Home</Link></li>
              <li><Link to="/products" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Products</Link></li>
              <li><Link to="/cart" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Cart</Link></li>
              <li><Link to="/wishlist" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Wishlist</Link></li>
            </ul>
          </div>
          
          <div className="animate-on-scroll opacity-0 transition-all duration-700 ease-out delay-200">
            <h3 className="text-lg font-semibold text-primary mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=Fruits" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Fruits</Link></li>
              <li><Link to="/products?category=Vegetables" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Vegetables</Link></li>
              <li><Link to="/products?category=Dairy" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Dairy</Link></li>
              <li><Link to="/products?category=Bakery" className="text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block">Bakery</Link></li>
            </ul>
          </div>
          
          <div className="animate-on-scroll opacity-0 transition-all duration-700 ease-out delay-300">
            <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
            <address className="not-italic text-gray-600">
              <p>123 Grocery Street</p>
              <p>Fresh City, FC 12345</p>
              <p className="mt-2">Phone: (123) 456-7890</p>
              <p>Email: info@grocerystore.com</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Grocery Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
