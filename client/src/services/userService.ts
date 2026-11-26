import { api } from "./api";

export const currentUser = {
  async getCurrentUserId() {
    const { data } = await api.get("/user/me");
    return data;
  },
};
