import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
});

// Attach token from localStorage as fallback
client.interceptors.request.use(config => {
  const token = localStorage.getItem('mrt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → redirect to login
client.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mrt_token');
      localStorage.removeItem('mrt_user');
      if (!window.location.pathname.includes('/app/login')) {
        window.location.href = '/app/login';
      }
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default client;
