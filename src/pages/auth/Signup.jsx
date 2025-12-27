import SignupForm from "@/components/auth/SignupForm";
import axios from "axios";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";

import { useNavigate } from "react-router-dom";
import authServices from "@/services/authServices";

function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignup = async (user) => {
    setLoading(true);
    try {
      const response = await authServices.signup(user);
      const { data, success,message } = response;
      if (success) {
        toast.success(message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
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
      <SignupForm loading={loading} handleSignup={handleSignup} />
    </div>
  );
}

export default Signup;
