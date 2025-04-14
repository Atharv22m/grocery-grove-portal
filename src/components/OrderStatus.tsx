
import React from "react";
import { Order, OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";
import { 
  Clock, 
  PackageCheck, 
  Truck, 
  CheckCircle, 
  XCircle
} from "lucide-react";

type OrderStatusProps = {
  status: OrderStatus;
  createdAt: string;
  className?: string;
};

export const OrderStatusBadge = ({ status, className }: { status: OrderStatus, className?: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <span className={cn(
      "px-3 py-1 text-xs font-medium rounded-full border",
      getStatusColor(),
      className
    )}>
      {getStatusLabel()}
    </span>
  );
};

export const OrderStatus: React.FC<OrderStatusProps> = ({ 
  status, 
  createdAt,
  className
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {getStatusIcon()}
      <div>
        <div className="flex items-center space-x-2">
          <OrderStatusBadge status={status} />
          <span className="text-sm text-gray-500">
            {formatDate(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OrderStatusTimeline = ({ order }: { order: Order }) => {
  const steps = [
    { status: "pending", label: "Order Received", icon: <Clock className="h-5 w-5" /> },
    { status: "processing", label: "Processing", icon: <PackageCheck className="h-5 w-5" /> },
    { status: "shipped", label: "Shipped", icon: <Truck className="h-5 w-5" /> },
    { status: "delivered", label: "Delivered", icon: <CheckCircle className="h-5 w-5" /> }
  ];

  const getStatusIndex = (status: OrderStatus): number => {
    if (status === "cancelled") return -1;
    return steps.findIndex(step => step.status === status);
  };

  const currentIndex = getStatusIndex(order.status);

  return (
    <div className="py-4">
      {order.status === "cancelled" ? (
        <div className="flex items-center justify-center bg-red-50 p-4 rounded-lg border border-red-100">
          <XCircle className="h-6 w-6 text-red-500 mr-2" />
          <span className="text-red-800 font-medium">This order has been cancelled</span>
        </div>
      ) : (
        <div className="relative">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div 
                key={step.status} 
                className={cn(
                  "flex flex-col items-center", 
                  { "text-gray-400": index > currentIndex },
                  { "text-primary font-medium": index <= currentIndex }
                )}
              >
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center z-10",
                    index <= currentIndex ? "bg-primary text-white" : "bg-gray-200"
                  )}
                >
                  {step.icon}
                </div>
                <span className="text-xs mt-1">{step.label}</span>
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-primary" 
              style={{ 
                width: currentIndex >= 0 ? `${(currentIndex / (steps.length - 1)) * 100}%` : "0%" 
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
