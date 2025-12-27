import apiClient from "./apiClient";

const authServices = {
  loginUser: async (user) => {
    const response = await apiClient.post("/auth/login", user);
    return response;
  },

  signup: async (user) => {
    const response = await apiClient.post("/auth/signup", user);
    return response;
  },

  setCurrentUser: (token, name, email) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("name", name);
  },

  getCurrentUser: () => {
    return {
      name: sessionStorage.getItem("name"),
      email: sessionStorage.getItem("email"),
    };
  },

};

export default authServices;
