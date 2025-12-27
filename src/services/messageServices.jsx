import apiClient from "./apiClient";

export const messageServices = {
  getMessages: async (receiverEmail) => {
    return await apiClient.get("/message/chat/" + receiverEmail);
  },
};
