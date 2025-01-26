import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function getUser() {
  try {
    const response = await api.get('/getUser');
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
  }
}

async function healCheck() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
  }
}

export { api, getUser, healCheck };
