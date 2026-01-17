import axios from "axios";

const base_url = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: base_url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      return Promise.reject({
        success: false,
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      });
    }

    return {
      success: true,
      data: response.data.data,
      status: response.status,
      message: response.data.message,
    };
  },
  (error) => {
    const { response } = error;

    const errorObj = {
      success: false,
      status: response?.status,
      message:
        response?.data?.message || error.message || "Something went wrong",
    };

    if (response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }

    return Promise.reject(errorObj);
  }
);

export default apiClient;
