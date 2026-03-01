"use client";

import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, hasPermission } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {hasPermission("user-list") && <p>You can access the file explorer</p>}
    </div>
  );
}