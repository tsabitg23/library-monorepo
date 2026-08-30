"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
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

export function TopNavBar() {
  const router = useRouter();
  const { isLoggedIn, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLoginClick = () => {
    router.push("/login");
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

          {/* Right: Login/Profile */}
          <div className="flex-shrink-0">
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
