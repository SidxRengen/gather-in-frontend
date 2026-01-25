import apiClient from "./apiClient";

export const messageServices = {
  getMessages: async (receiverEmail) => {
    return await apiClient.get("/message/chat/" + receiverEmail);
  },
  getImageUrl: async (formData) => {
    return await apiClient.post("/message/upload-image", formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
