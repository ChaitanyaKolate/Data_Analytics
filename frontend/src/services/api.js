import axios from "axios";
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const uploadFile = (formData, token) =>
  API.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });