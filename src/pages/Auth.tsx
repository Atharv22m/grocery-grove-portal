
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("login");
  const { isSignedIn } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (isSignedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
    setIsLoading(false);
  }, [isSignedIn, navigate]);

  // Custom appearance to remove Clerk branding
  const appearance = {
    layout: {
      logoPlacement: "none",
      showOptionalFields: true,
      socialButtonsPlacement: "bottom"
    },
    elements: {
      logoImage: {
        display: "none"
      },
      footer: {
        display: "none"
      },
      powerButton: {
        display: "none"
      },
      dividerLine: {
        display: "none"
      },
      dividerText: {
        display: "none"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
              {/* Use Clerk components with custom appearance to hide branding */}
              <Tabs 
                defaultValue="login"
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="rounded-md bg-white p-6 shadow-md">
                  <SignIn 
                    routing="path" 
                    path="/auth" 
                    signUpUrl="/auth"
                    fallbackRedirectUrl="/"
                    appearance={appearance}
                  />
                </TabsContent>
                
                <TabsContent value="signup" className="rounded-md bg-white p-6 shadow-md">
                  <SignUp 
                    routing="path" 
                    path="/auth" 
                    signInUrl="/auth"
                    fallbackRedirectUrl="/"
                    appearance={appearance}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Auth;
