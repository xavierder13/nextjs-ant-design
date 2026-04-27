import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "../../services/login.service";

export function useLogin() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async (data: any) => {
    setLoading(true);
    setIsInvalid(false);

    try {
      let response = await loginRequest(data);
      
      if(response.access_token)
      {
        localStorage.setItem("access_token", response.access_token);
        router.push("/dashboard");
      }
      else
      {
        setIsInvalid(true);
      }
      
    } catch (error) {
      setIsInvalid(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    isInvalid,
    showPassword,
    setShowPassword,
    login,
  };
}