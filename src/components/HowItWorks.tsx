import { Truck, CreditCard, Package } from "lucide-react";

const steps = [
  {
    icon: <Package className="h-8 w-8 text-primary" />,
    title: "Choose Your Products",
    description: "Browse through our wide selection of fresh groceries",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-primary" />,
    title: "Easy Payment",
    description: "Secure payment with UPI or cash on delivery",
  },
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: "Fast Delivery",
    description: "Get your groceries delivered to your doorstep",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6 p-4 bg-primary-light rounded-full">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};