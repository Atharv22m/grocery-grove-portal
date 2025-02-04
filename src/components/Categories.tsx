import { Button } from "@/components/ui/button";

const categories = [
  { name: "Fruits & Vegetables", image: "🥬", color: "bg-green-100" },
  { name: "Dairy & Eggs", image: "🥛", color: "bg-blue-100" },
  { name: "Bakery", image: "🥖", color: "bg-yellow-100" },
  { name: "Meat & Fish", image: "🥩", color: "bg-red-100" },
  { name: "Beverages", image: "🥤", color: "bg-purple-100" },
  { name: "Snacks", image: "🍪", color: "bg-orange-100" },
];

export const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              className={`h-auto flex flex-col items-center p-6 rounded-lg ${category.color} hover:scale-105 transition-transform`}
            >
              <span className="text-4xl mb-4">{category.image}</span>
              <span className="text-sm font-medium text-gray-900">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};