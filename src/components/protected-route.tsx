"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!isLoading && !authenticated) {
      const next =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [authenticated, isLoading, router]);

  // If not authenticated, don't render children
  if (isLoading || !authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ooi-second-blue"></div>
      </div>
    );
  }

  // If authenticated, render children
  return <>{children}</>;
}
