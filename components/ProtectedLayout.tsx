"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ProtectedLayoutProps {
  children: ReactNode;
  role?: string;
  permission?: string;
}

export default function ProtectedLayout({
  children,
  role,
  permission,
}: ProtectedLayoutProps) {
  const router = useRouter();
  const { loading, hasRole, hasPermission } = useAuth();

  const unauthorized =
    (!loading && role && !hasRole(role)) ||
    (!loading && permission && !hasPermission(permission));

  useEffect(() => {
    if (unauthorized) {
      router.replace("/unauthorized");
    }
  }, [unauthorized, router]);

  // While loading or redirecting → render nothing
  if (loading || unauthorized) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}