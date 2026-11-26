import { api } from "./api";

import type LoginData from "../Typescript/LoginData";
import type LoginResponse from "../Typescript/LoginResponse";
import type SignupData from "../Typescript/SignupData";
import type SignupResponse from "../Typescript/SignupResponse";

export const authuser = {
  async register(userdata: SignupData) {
    try {
      const { data } = await api.post<SignupResponse>(
        "auth/register",
        userdata,
      );
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Registration Failed");
    }
  },
  async login(userdata: LoginData) {
    try {
      const { data } = await api.post<LoginResponse>("auth/login", userdata);
      return data;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Login Failed");
    }
  },
  async logout() {
    try {
      const { data } = await api.post("/auth/logout");
      return data.message;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || "Logout Failed");
    }
  },
};
