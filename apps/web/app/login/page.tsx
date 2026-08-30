"use client";

import { TopNavBar } from "@/components/top-nav-bar";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await login(values.email, values.password);
      router.push("/");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to log in.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
        <div className="w-full rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Log in to manage your library account.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Email</label>
              <Input id="email" type="email" autoComplete="email" {...register("email", { required: "Email is required." })} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <Input id="password" type="password" autoComplete="current-password" {...register("password", { required: "Password is required." })} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            {loginError && <p className="text-sm text-destructive" role="alert">{loginError}</p>}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link className="font-medium text-primary hover:underline" href="/register">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
