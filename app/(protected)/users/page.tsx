"use client"

import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.get("/api/user/index").then(
      (response) => {
        console.log(response.data.users);
        const data = response.data;
        setUsers(data.users);
        setBranches(data.branches);
        setPositions(data.positions);
        setRoles(data.roles);
        setLoading(false);
    });

  }, [])
  if(loading) return <div>Loading...</div>
  return (
    
    <div>
      {" "}
      <h1>User List</h1>
      <ul>
        {
          users.map((user: { id: number; name: string}) => (
            <li key={user.id}>
              <h3>{user.name}</h3>
            </li>
          ))
        }
        <li></li>
      </ul>
      User Page
      {" "}
    </div>
    
  )

}