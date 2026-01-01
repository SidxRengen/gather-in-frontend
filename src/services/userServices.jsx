import apiClient from "./apiClient";

export const userServices = {
  getAllUsers: async () => {
    return await apiClient.get("/user/allUsers");
  },
  getActiveUsers: async () => {
    return await apiClient.get("/user/activeUsers");
  },
  uploadProfilePicture: async (formData) => {
    return await apiClient.post("/user/uploadPhoto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getProfile: async () => {
    return await apiClient.get("/user/profile");
  },
};
