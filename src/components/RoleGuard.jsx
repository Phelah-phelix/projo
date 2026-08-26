"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loading } from "@/components/ui";

/**
 * Client-side route guard. Redirects to the landing page if not authenticated,
 * or to the correct dashboard if the logged-in role doesn't match this area.
 */
export default function RoleGuard({ role, children }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/");
    else if (user.role !== role) router.replace(user.role === "LEADER" ? "/leader" : "/member");
  }, [ready, user, role, router]);

  if (!ready) return <Loading label="Checking your session…" />;
  if (!user || user.role !== role) return <Loading label="Redirecting…" />;
  return children;
}
