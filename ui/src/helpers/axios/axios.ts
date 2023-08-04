import { Auth } from "aws-amplify";
import axios from "axios";
import { getAccessTokenFormLocalStorage } from "../Functions";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessTokenFormLocalStorage();
    if (accessToken) {
      // If an access token exists, append it to the request headers
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the access token using the current session
        const currentSession = await Auth.currentSession();
        const newAccessToken = currentSession.getAccessToken();
        // Update the access token in localStorage
        localStorage.setItem('accessToken', newAccessToken.getJwtToken());
        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log('Token Refresh Error:', refreshError);
        // If token refresh fails, redirect to the login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


