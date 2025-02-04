import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative bg-primary-light min-h-[600px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Fresh Groceries,
            <br />
            Delivered to Your Door
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Shop from our wide selection of fresh produce, pantry essentials, and household items.
            Get same-day delivery!
          </p>
          
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-hover rounded-full px-6">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};