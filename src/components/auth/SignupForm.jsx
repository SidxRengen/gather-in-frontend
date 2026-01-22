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

function SignupForm({ handleSignup, loading }) {
  const [user, setUser] = useState({ userName: "", email: "", password: "" });
  const onChangeHandle = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignup(user);
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
          <CardTitle className="text-lg sm:text-xl lg:text-2xl">
            Create a user in Gather-In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-4 sm:space-y-6">
              {/* Name Field */}
              <Field>
                <FieldLabel htmlFor="userName" className="text-sm sm:text-base">
                  Name
                </FieldLabel>
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Peter.."
                  value={user?.userName}
                  onChange={onChangeHandle}
                  required
                  className="text-sm sm:text-base"
                />
              </Field>

              {/* Email Field */}
              <Field>
                <FieldLabel htmlFor="email" className="text-sm sm:text-base">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={user?.email}
                  onChange={onChangeHandle}
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
                  {loading ? <>Creating New User...</> : <>Create New User</>}
                </Button>
                <FieldDescription className="text-center text-xs sm:text-sm mt-2">
                  Already have an account?{" "}
                  <Link to="/" className="hover:underline">
                    Sign in
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

export default SignupForm;
