import api from "@/lib/api";
import { setTokens, clearTokens, getRefreshToken } from "@/lib/token";

export interface RegisterData {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface VerifyOTPData {
  identifier: string;
  code: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export const authService = {
  async register(data: RegisterData) {
    const response = await api.post("/auth/register", {
      ...data,
      verification_channel: "email",
    });

    return response.data;
  },

  async verifyOTP(data: VerifyOTPData) {
    const response = await api.post<AuthResponse>("/auth/verify-otp", {
      identifier: data.identifier,
      code: data.code,
      verification_channel: "email",
    });

    setTokens(response.data.tokens.access, response.data.tokens.refresh);

    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data.user;
  },

  async resendOTP(identifier: string) {
    const response = await api.post("/auth/resend-otp", {
      identifier,
      verification_channel: "email",
    });

    return response.data;
  },

  async login(data: LoginData) {
    const response = await api.post<AuthResponse>("/auth/login", data);

    setTokens(response.data.tokens.access, response.data.tokens.refresh);

    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data.user;
  },

  async googleLogin(code: string) {
    const response = await api.post<AuthResponse>("/auth/google", {
      code,
    });

    setTokens(response.data.tokens.access, response.data.tokens.refresh);

    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data.user;
  },

  async logout() {
    try {
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        await api.post("/auth/logout", {
          refresh_token: refreshToken,
        });
      }
    } finally {
      clearTokens();
      localStorage.removeItem("user");
    }
  },

  async getMe() {
    const response = await api.get<User>("/auth/me");

    localStorage.setItem("user", JSON.stringify(response.data));

    return response.data;
  },
};
