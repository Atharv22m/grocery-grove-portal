
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (isSignedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
    setIsLoading(false);
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AuthForm />
        )}
      </main>
    </div>
  );
};

export default Auth;
