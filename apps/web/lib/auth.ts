"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BASE_API } from "./utils";

type JwtPayload = {
  sub: string;
  email: string;
  exp?: number;
};

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

function getUserFromToken(accessToken: string): AuthUser {
  const payload = accessToken.split(".")[1];
  if (!payload) {
    throw new Error("Invalid login response.");
  }

  const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as JwtPayload;
  if (!decoded.sub || !decoded.email) {
    throw new Error("Invalid login response.");
  }

  return { id: decoded.sub, email: decoded.email };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: async (email, password) => {
        const response = await fetch(`${BASE_API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid email or password.");
        }

        const { accessToken } = (await response.json()) as LoginResponse;
        set({ accessToken, user: getUserFromToken(accessToken) });
      },
      logout: () => set({ accessToken: null, user: null }),
    }),
    { name: "librarian-auth" },
  ),
);