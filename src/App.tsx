import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Products from "@/pages/Products";
import ProductForm from "@/pages/ProductForm";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import BuyNow from "@/pages/BuyNow";
import Wishlist from "@/pages/Wishlist";
import NotFound from "@/pages/NotFound";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <OrderProvider>
                <UserRoleProvider>
                  <Router>
                    <div className="min-h-screen flex flex-col">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/new" element={
                          <ProtectedRoute>
                            <ProductForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/products/edit/:id" element={
                          <ProtectedRoute>
                            <ProductForm />
                          </ProtectedRoute>
                        } />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/buy-now" element={
                          <ProtectedRoute>
                            <BuyNow />
                          </ProtectedRoute>
                        } />
                        <Route path="/order-confirmation" element={
                          <ProtectedRoute>
                            <OrderConfirmation />
                          </ProtectedRoute>
                        } />
                        <Route path="/orders" element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        } />
                        <Route path="/order/:id" element={
                          <ProtectedRoute>
                            <OrderDetail />
                          </ProtectedRoute>
                        } />
                        <Route path="/wishlist" element={
                          <ProtectedRoute>
                            <Wishlist />
                          </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <Toaster />
                    </div>
                  </Router>
                </UserRoleProvider>
              </OrderProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
