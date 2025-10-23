import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Menghubungkan ke backend di localhost:8000
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 (Unauthorized) specifically for token expiration/invalidation
    if (error.response?.status === 401) {
      if (localStorage.getItem("token")) {
        // The AuthContext will handle the logout logic.
        // This prevents circular dependencies or race conditions.
      }
    }

    return Promise.reject(error);
  }
);

export default api;
