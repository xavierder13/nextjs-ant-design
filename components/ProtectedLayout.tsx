"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// 1. Define the props interface
interface ProtectedLayoutProps {
  children: ReactNode;
  permission?: string | string[];
}

export default function ProtectedLayout({ children, permission }: ProtectedLayoutProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();
  useEffect(() => {
    
    if (permission && !hasPermission(permission)) 
    {
      router.push("/unauthorized");
    }
  }, [permission]);

  return <div>{children}</div>;
}