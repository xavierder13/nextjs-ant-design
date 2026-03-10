"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export default function UserPage() {

  const params = useParams();
  const userId = params.userId as string;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.get(`/api/user/edit/${userId}`)
      .then((res) => setUser(res.data.user))
      .catch(console.error);
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return <div>{user.name}</div>;
}