import axios from "axios";
import { getIdToken } from "../cognitoServices";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
