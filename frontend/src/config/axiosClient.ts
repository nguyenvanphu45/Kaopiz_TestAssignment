import axios from "axios";
import {
  getLocalStorage,
  removeLocalStorage,
  KEY_LOCAL_STORAGE,
} from "./storage";

const apiUrl = import.meta.env.API_URL;

const axiosClient = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getLocalStorage(KEY_LOCAL_STORAGE.ACCESS_TOKEN);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/Auth/login");
    if (error.response?.status === 401 && !isLoginRequest) {
      removeLocalStorage(KEY_LOCAL_STORAGE.ACCESS_TOKEN);
      removeLocalStorage(KEY_LOCAL_STORAGE.USER_DATA);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
