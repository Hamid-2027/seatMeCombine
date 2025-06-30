import axios from 'axios';

// Create a new Axios instance with a base URL
const apiClient = axios.create({
  // IMPORTANT: Replace this with your actual backend API URL
  baseURL: 'http://localhost:3001/api',
  // baseURL: 'http://127.0.0.1:5050',

  headers: {
    'Content-Type': 'application/json',
  },
});

// You can also intercept requests or responses here if needed
// For example, to automatically add an auth token to every request:
// apiClient.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
