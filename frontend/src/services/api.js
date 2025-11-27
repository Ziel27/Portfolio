import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await api.get("/projects");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  create: async (projectData) => {
    const response = await api.post("/projects", projectData);
    return response.data;
  },
  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadProjectImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/upload/project-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// User API
export const userAPI = {
  getStatus: async () => {
    const response = await api.get("/user/status");
    return response.data;
  },
  updateStatus: async (availableToWork, themeMode) => {
    const response = await api.put("/user/status", {
      availableToWork,
      themeMode,
    });
    return response.data;
  },
  getTheme: async () => {
    const response = await api.get("/user/theme");
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  sendMessage: async (formData) => {
    const response = await api.post("/contact", formData);
    return response.data;
  },
};

export default api;
