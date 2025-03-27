
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const orderNumber = `GG-${Math.floor(100000 + Math.random() * 900000)}`;
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">Thank you for your purchase</p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-semibold">{orderNumber}</p>
            </div>
            
            <p className="text-gray-600 mb-6">
              We've sent a confirmation email with your order details.
              Your items will be delivered soon!
            </p>
            
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/")} className="bg-primary hover:bg-primary-hover">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate("/products")}>
                View My Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
