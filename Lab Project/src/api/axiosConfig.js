import axios from "axios";
const pro = "http://80.225.246.52:5000";
const dev = "http://localhost:5000";
let run = dev;
const api = axios.create({
  baseURL: `${run}/api`,
  // ✅ NO withCredentials - JWT tokens in localStorage only
});

// ✅ Request interceptor: Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor: Handle 401 and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
