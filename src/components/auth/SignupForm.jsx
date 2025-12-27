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
    <div className={cn(" w-1/2 items-center bg-background text-foreground")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create a user in Gather-In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Name</FieldLabel>
                <Input
                  id="userName"
                  type="userName"
                  placeholder="Peter.."
                  value={user?.userName}
                  onChange={onChangeHandle}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={user?.email}
                  onChange={onChangeHandle}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={user?.password}
                  onChange={onChangeHandle}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">
                  {loading ? <>Creating New User...</> : <>Create New User</>}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}

export default SignupForm;
