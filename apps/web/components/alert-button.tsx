"use client";

import { Button } from "@/components/ui/button";

export function AlertButton({ children }: { children: React.ReactNode }) {
  return (
    <Button onClick={() => alert("Hello from shadcn/ui")}>{children}</Button>
  );
}
