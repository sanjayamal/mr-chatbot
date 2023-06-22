import axios from "axios";

const API = axios.create({
  baseURL: "https://api.example.com", // Replace with your API base URL
  timeout: 5000, // Set a reasonable timeout value
  headers: {
    "Content-Type": "application/json",
    // Add any common headers you may need
  },
});

export default API;
