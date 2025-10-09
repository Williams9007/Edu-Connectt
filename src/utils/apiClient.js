// src/utils/api.js
import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

