// "use client";

// import { useAuth } from "@/context/AuthContext";
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // const { user, hasPermission } = useAuth();

  // return (
  //   <div>
  //     {/* <h1>Welcome, {user?.name}</h1>
  //     {hasPermission("user-list") && <p>You can access the file explorer</p>} */}
  //   </div>
  // );
}