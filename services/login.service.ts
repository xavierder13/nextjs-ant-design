import { api } from "../lib/axios"; // go up two levels from /app/login

export const loginRequest = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/api/auth/login", data);
    return response.data; // contains access_token etc.
  } catch (error: any) {
    // You can handle backend error messages if your API returns them
    throw new Error(error.response?.data?.message || "Login failed");
  }
};