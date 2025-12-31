import apiClient from "./apiClient";

export const userServices = {
  getAllUsers: async () => {
    return await apiClient.get("/user/allUsers");
  },
  getActiveUsers: async () => {
    return await apiClient.get("/user/activeUsers");
  },
};
