"use client";

import { registerUser } from "@/lib/users";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { toast } from "@repo/ui/sonner";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type RegisterFormValues = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const registerMutation = useMutation({
    mutationFn: (values: RegisterFormValues) =>
      registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      }),
    onSuccess: () => {
      toast.success("Account created successfully. Please log in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to register.");
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-10">
        <div className="w-full rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Create an account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Register to manage your library account.</p>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" autoComplete="name" {...register("name", { required: "Name is required." })} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email", { required: "Email is required." })} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="text" autoComplete="tel" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 8, message: "Password must be at least 8 characters." },
                })}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: "Please confirm your password.",
                  validate: (value) => value === watch("password") || "Passwords do not match.",
                })}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button className="w-full" type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link className="font-medium text-primary hover:underline" href="/login">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}