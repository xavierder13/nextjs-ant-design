"use client";

import LoginView from "./LoginView";
import { useLogin } from "./useLogin";

export default function LoginPage() {
  const {
    loading,
    isInvalid,
    showPassword,
    setShowPassword,
    login,
  } = useLogin();

  return (
    <LoginView
      loading={loading}
      isInvalid={isInvalid}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      onSubmit={login}
    />
  );
}