import axiosClient from "../../config/axiosClient";
import type { LoginData, RegisterData } from "./types";

export const authApi = {
  login: (data: LoginData) => axiosClient.post("/Auth/login", data),
  register: (data: RegisterData) => axiosClient.post("/Auth/register", data),
  logout: (refreshToken: string) =>
    axiosClient.post("/Auth/logout", refreshToken, {
      headers: { "Content-Type": "application/json" },
    }),
  refreshToken: (): Promise<{ token: string }> =>
    axiosClient.post("/auth/refresh"),
};
