// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://prestamos-backend-p43y.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;