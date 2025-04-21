
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Log the 404 error
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // If user is signed in and hits the 404 page, they might have been redirected after signup
    // Redirect them to home page
    if (isSignedIn) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [location.pathname, isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          {isSignedIn 
            ? "You've successfully signed in. Redirecting to homepage..." 
            : "The page you are looking for might have been removed or is temporarily unavailable."}
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="bg-primary hover:bg-primary-hover"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
