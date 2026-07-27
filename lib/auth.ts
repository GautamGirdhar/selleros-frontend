import { getAccessToken, clearTokens } from "./token";

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
}

// Save User
export const setUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get User
export const getUser = (): User | null => {
  const user = localStorage.getItem("user");

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// Remove User
export const clearUser = () => {
  localStorage.removeItem("user");
};

// Check Login
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Logout
export const logout = () => {
  clearTokens();
  clearUser();
};
