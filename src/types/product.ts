
export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  rating: number;
  stock: number;
  weight?: string;
  discount?: number;
}
