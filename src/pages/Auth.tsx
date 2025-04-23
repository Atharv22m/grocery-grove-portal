
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthForm } from "@/components/auth/AuthForm";
import { Footer } from "@/components/Footer";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("login");
  const { isSignedIn } = useAuth();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (isSignedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
    setIsLoading(false);
    
    // Trigger animation after a small delay
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <div 
              className={`w-full max-w-md transition-all duration-1000 ease-out ${
                animateIn 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 z-0" />
                  <div className="p-8 relative z-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      {activeTab === "login" ? "Welcome Back" : "Join Our Community"}
                    </h1>
                    <p className="text-gray-600">
                      {activeTab === "login" 
                        ? "Sign in to access your account" 
                        : "Create an account to get started"}
                    </p>
                  </div>
                </div>

                <Tabs 
                  defaultValue="login"
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger 
                        value="login" 
                        className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                      >
                        Login
                      </TabsTrigger>
                      <TabsTrigger 
                        value="signup"
                        className="data-[state=active]:bg-primary data-[state=active]:text-white transition-all duration-200"
                      >
                        Sign Up
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="px-6 pb-8">
                    <TabsContent 
                      value="login" 
                      className="rounded-md p-6 transition-all duration-500 data-[state=active]:animate-fade-in"
                    >
                      <AuthForm />
                    </TabsContent>
                    
                    <TabsContent 
                      value="signup" 
                      className="rounded-md p-6 transition-all duration-500 data-[state=active]:animate-fade-in"
                    >
                      <AuthForm isSignUp={true} />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
              
              <div className="mt-8 text-center text-gray-500 text-sm animate-fade-in opacity-0" style={{animationDelay: "500ms", animationFillMode: "forwards"}}>
                By signing up, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
