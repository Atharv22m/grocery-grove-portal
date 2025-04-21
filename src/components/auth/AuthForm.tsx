
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

// Schema for login form
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Schema for signup form with password confirmation
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface AuthFormProps {
  isSignUp?: boolean;
}

export const AuthForm = ({ isSignUp = false }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (!signInLoaded) {
      toast.error("Authentication service is not ready yet");
      return;
    }

    try {
      setIsLoading(true);
      
      // Use Clerk for authentication
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        // Handle verification or other flows if needed
        console.log("Additional verification needed:", result);
        toast.info("Please complete the verification process");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    if (!signUpLoaded) {
      toast.error("Authentication service is not ready yet");
      return;
    }

    try {
      setIsLoading(true);
      
      // Use Clerk for registration
      const result = await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.fullName.split(' ')[0],
        lastName: values.fullName.split(' ').slice(1).join(' ') || '',
      });

      if (result.status === "complete") {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        // Handle email verification or other flows
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        toast.success("Account created! Please check your email to verify your account.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeForm = isSignUp ? signupForm : loginForm;
  const activeSchema = isSignUp ? signupSchema : loginSchema;
  const onSubmit = isSignUp ? onSignupSubmit : onLoginSubmit;

  return (
    <div className="w-full">
      <Form {...activeForm}>
        <form onSubmit={activeForm.handleSubmit(onSubmit)} className="space-y-4">
          {isSignUp && (
            <FormField
              control={signupForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={activeForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={activeForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {isSignUp && (
            <FormField
              control={signupForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              isSignUp ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
