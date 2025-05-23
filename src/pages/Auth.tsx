
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useSearchParams } from "react-router-dom";

const Auth: React.FC = () => {
  const { isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";

  // Redirect to home page if the user is already signed in
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-12 pt-24">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <AuthForm isSignUp={isSignUp} />
          <div className="mt-4 text-center text-sm text-gray-600">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <a href="/auth" className="text-primary hover:underline">
                  Sign in
                </a>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <a href="/auth?mode=signup" className="text-primary hover:underline">
                  Create one
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
