import LoginForm from "@/components/auth/LoginForm";
import { useAuthContext } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import authServices from "@/services/authServices";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const handleSignIn = async (user) => {
    setLoading(true);
    try {
      const response = await authServices.loginUser(user);
      const { data, message, success } = response;
      if (success) {
        authServices.setCurrentUser(data?.token, data?.username, data?.email);
        toast.success(message);
        setIsAuthenticated(true);
        navigate("/home");
      }
    } catch (error) {
      toast.error(error.message);
      // console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={cn(
        "w-lvw flex justify-center items-center dark min-h-screen bg-background text-foreground"
      )}
    >
      <LoginForm loading={loading} handleSignIn={handleSignIn} />
    </div>
  );
}

export default Login;
