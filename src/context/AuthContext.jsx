"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken } from "@/lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  // Restore the session on first load using the stored JWT.
  useEffect(() => {
    (async () => {
      if (!getToken()) return setReady(true);
      try {
        const { user } = await api("/auth/me");
        setUser(user);
      } catch {
        setToken(null);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const routeForRole = (role) => (role === "LEADER" ? "/leader" : "/member");

  const login = useCallback(
    async (name, password) => {
      const { token, user } = await api("/auth/login", {
        method: "POST",
        body: { name, password },
        auth: false,
      });
      setToken(token);
      setUser(user);
      router.push(routeForRole(user.role));
      return user;
    },
    [router]
  );

  const register = useCallback(
    async (payload) => {
      const { token, user } = await api("/auth/register", {
        method: "POST",
        body: payload,
        auth: false,
      });
      setToken(token);
      setUser(user);
      router.push(routeForRole(user.role));
      return user;
    },
    [router]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthCtx.Provider value={{ user, ready, login, register, logout, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}
