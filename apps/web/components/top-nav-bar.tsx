"use client";

import Link from "next/link";
import { User, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { SearchInput } from "./search-input";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { useCart } from "@/lib/cart-store";
import { useState, useEffect } from "react";

export function TopNavBar() {
  const router = useRouter();
  const { isLoggedIn, logout, user } = useAuth();
  const { items } = useCart();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              Librarian
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md">
            <SearchInput />
          </div>

          {/* Right: Cart and Login/Profile */}
          <div className="flex-shrink-0 flex items-center gap-2">
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCartClick}
              className="relative hover:bg-muted"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {isHydrated && items.length > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Button>

            {/* Login/Profile */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted"
                    aria-label="Open account menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/borrow">Borrow List</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLoginClick} variant="default">
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
