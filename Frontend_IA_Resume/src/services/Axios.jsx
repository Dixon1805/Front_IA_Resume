import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Esta es la URL que querés usar
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance; // ✅ exportás la instancia configurada
