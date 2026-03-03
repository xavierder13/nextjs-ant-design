"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  permissions: string[];
  roles: string[];
  loading: boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user once on app start
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    if (!loading) {
      if (!user) {
        router.replace("/login");
        return;
      }
    }

    // api where to fetch user and roles and permissions
    api
      .get("/api/auth/init")
      .then((res) => {
        const data = res.data;
        
        // Adjust this depending on your backend structure
        setUser(data.user);
        setPermissions(data.user_permissions ?? []);
        setRoles(data.user_roles ?? []);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setPermissions([]);
    setRoles([]);
    router.push("/login");
  };

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasRole = (role: string) => {
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        roles,
        loading,
        logout,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}