import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toUpperCase();
  const isStateChangingRequest = method && !["GET", "HEAD", "OPTIONS"].includes(method);

  if (isStateChangingRequest && config.url !== "/auth/csrf") {
    if (!getCookie("csrf_token")) {
      await api.get("/auth/csrf");
    }

    const csrfToken = getCookie("csrf_token");
    if (csrfToken) {
      config.headers.set("X-CSRF-Token", decodeURIComponent(csrfToken));
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        await api.post("auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
