"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { useAuthStore } from "@/lib/auth";
import { borrowBooks } from "@/lib/borrows";
import { Button } from "@repo/ui/button";
import { X } from "lucide-react";
import { toast } from "@repo/ui/sonner";
import { useState, useEffect } from "react";
import { BASE_API } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, clearCart } = useCart();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCheckout = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    setIsCheckingOut(true);
    try {
      await borrowBooks(
        accessToken,
        items.map((item) => item.id),
      );
      toast.success("Books borrowed successfully");
      clearCart();
      router.push("/borrow");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to borrow the selected books.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-2xl font-semibold">Borrow Cart</h1>
          <div className="flex flex-col items-center justify-center border-y border-border py-12">
            <h2 className="text-lg font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Start adding books to your cart
            </p>
            <Button asChild className="mt-6 !text-white">
              <Link href="/">Continue Browsing</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-semibold">Borrow Cart</h1>

        {/* Mobile Layout */}
        <div className="block space-y-4 lg:hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-border rounded-lg p-4"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded">
                <img
                  src={`${BASE_API}/${item.coverUrl}`}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/books/${item.id}`}
                  className="font-semibold hover:underline"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">{item.isbn}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  Book
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold">
                  ISBN
                </th>
                <th className="w-16 px-4 py-4 text-right text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="px-4 py-4">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded">
                        <img
                          src={`${BASE_API}/${item.coverUrl}`}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <Link
                          href={`/books/${item.id}`}
                          className="font-semibold hover:underline"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-muted-foreground">
                    {item.isbn}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary and Actions */}
        <div className="mt-8 flex justify-between gap-4">
          <Button variant="outline" asChild>
            <Link href="/">Continue Browse</Link>
          </Button>
          <Button onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </main>
    </div>
  );
}
