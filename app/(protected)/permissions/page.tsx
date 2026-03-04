"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios"

export default function PermissionListPage() {
  const [permissions, setPermissions] = useState<any[]> ([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {

      try {
        // const [usersRes, rolesRes, permissionsRes] = await Promise.all([
        //   api.get("/api/user/index"),
        //   api.get("/api/roles/index"),
        //   api.get("/api/permission/index")
        // ]);

        const rolesRes = await api.get("/api/role/index");
        const permissionsRes = await api.get("/api/permission/index");
        // api.get("/api/permission/index")
        console.log(rolesRes);
        console.log(permissionsRes);          
        setPermissions(permissionsRes.data.permissions);
        setRoles(rolesRes.data.roles);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData(); 
    console.log(permissions);
    console.log(roles);

    // console.log(permissions);
    // console.log(roles);
    

  //   api.get('/api/permission/index').then(
  //     (response) => {
  //       console.log(response);
  //     }
  //   )
  //   .finally(() => setLoading(false));
  }, []);
  
  if(loading) return <div>Loading</div>;

  return (
    <div>
      <h1>Permission List</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {permissions.map(permission => <li key={permission.id}>{permission.name}</li>)}
        </ul>
      )}
    </div>
  );
}