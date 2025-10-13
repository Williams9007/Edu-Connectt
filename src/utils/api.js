// src/utils/api.js
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // 👈 local backend API
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // optional
});
