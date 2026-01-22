import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../ui/field";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function LoginForm({ handleSignIn, loading }) {
  const [user, setUser] = useState({ email: "", password: "" });
  const onChangeHandle = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignIn(user);
  };

  return (
    <div
      className={cn(
        "w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl", // Responsive max-width
        "mx-auto", // Center horizontally
        "px-4 sm:px-6 lg:px-8", // Responsive horizontal padding
        "py-4 sm:py-6 lg:py-8", // Responsive vertical padding
        "items-center bg-background text-foreground",
      )}
    >
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl">Welcome back</CardTitle>
         
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email" className="text-sm sm:text-base">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email}
                  onChange={onChangeHandle}
                  placeholder="m@example.com"
                  required
                  className="text-sm sm:text-base"
                />
              </Field>

              {/* Password Field */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm sm:text-base"
                  >
                    Password
                  </FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-xs sm:text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={user?.password}
                  onChange={onChangeHandle}
                  required
                  className="text-sm sm:text-base"
                />
              </Field>

              {/* Submit Button */}
              <Field>
                <Button type="submit" className="w-full text-sm sm:text-base">
                  {loading ? <>Loging in...</> : <>Login</>}
                </Button>
                <FieldDescription className="text-center text-xs sm:text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="hover:underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-4 sm:px-6 text-center text-xs sm:text-sm mt-4">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}

export default LoginForm;
