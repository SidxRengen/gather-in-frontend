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
  uploadWallpaper: async (formData) => {
    return await apiClient.post("/user/update-wallpaper", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateProfileSettings: async (body) => {
    return await apiClient.post("/user/update-profile-settings", body);
  },
  getProfile: async () => {
    return await apiClient.get("/user/profile");
  },
  getActiveGroups: async () => {
    return await apiClient.get("/group/user");
  },
};
