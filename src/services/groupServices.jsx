import apiClient from "./apiClient";

export const groupServices = {
  addGroup: async (data) => {
    return await apiClient.post("/group/add", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getGroupMessages: async (id) => {
    return await apiClient.get("/group/message/" + id);
  },
  getGroupDetails: async (id) => {
    return await apiClient.get("/group/" + id);
  },
  addGroupMembers: async (id, data) => {
    return await apiClient.post("/group/addMembers/" + id, data);
  },
};
