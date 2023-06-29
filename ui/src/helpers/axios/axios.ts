import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
    
  },
});

export default API;
