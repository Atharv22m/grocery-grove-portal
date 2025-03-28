
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type UserType = "customer" | "seller";

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserType>("customer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
    };
    
    checkUser();
    
    // Setup auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
          navigate("/");
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        // Register new user
        const { data: userData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              phone_number: formData.phoneNumber,
              user_type: userType,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Create profile after successful signup
        if (userData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userData.user.id,
                full_name: formData.fullName,
                phone_number: formData.phoneNumber,
              },
            ]);

          if (profileError) throw profileError;
        }

        toast.success("Account created successfully! Please check your email to verify your account.");
        // Don't navigate away if email confirmation is required
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, show profile info
  if (user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6">Your Account</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-600">Logged in as:</p>
          <p className="font-semibold">{user.email}</p>
        </div>
        
        <Button 
          onClick={handleLogout} 
          className="w-full" 
          variant="outline"
          disabled={loading}
        >
          {loading ? "Processing..." : "Logout"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login" : "Create Account"}
      </h2>
      
      {!isLogin && (
        <div className="flex gap-4 mb-6">
          <Button
            type="button"
            variant={userType === "customer" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setUserType("customer")}
          >
            Customer
          </Button>
          <Button
            type="button"
            variant={userType === "seller" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setUserType("seller")}
          >
            Seller
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>
          </>
        )}
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isLogin
            ? "Login"
            : "Create Account"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary hover:underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
};
