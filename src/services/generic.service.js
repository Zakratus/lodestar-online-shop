import axios from "axios";

export const API_URL = import.meta.env.VITE__API_URL + "/api/v1";
export const CLIENT_URL = "http://localhost:8080"

export const request = async ({ url, method, data = {} }) => {
  const response = await axios[method](`${API_URL}/${url}`, data);
  return response.data;
}

// Authentication requests 
const authRequest = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}`,
});

authRequest.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config;
})

authRequest.interceptors.response.use((config) => {
  return config;
}, async (error) => {
  const originalRequest = error.config;
  if (error.response.status === 401 && error.config && !error.config._isRetry) {
    originalRequest._isRetry = true;
    try {
      const response = await axios.get(`${API_URL}/authentication/refresh`, { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      return authRequest.request(originalRequest);

    } catch (err) {
      console.log('Не авторизирован');
    }
  }
  throw error;
})

export default authRequest;
