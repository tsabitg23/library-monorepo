"use client";

import { createContext, useContext, type ReactNode } from "react";

import { type AuthUser, useAuthStore } from "@/lib/auth";

type AuthContextValue = {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  return (
    <AuthContext.Provider value={{ isLoggedIn: Boolean(accessToken && user), user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return auth;
}