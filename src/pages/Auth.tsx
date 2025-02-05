import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/Navbar";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <AuthForm />
      </main>
    </div>
  );
};

export default Auth;