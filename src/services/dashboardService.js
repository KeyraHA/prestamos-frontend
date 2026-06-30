// src/services/dashboardService.js
import api from './api';

export const getStats      = () => api.get('/clientes/stats');
export const getPagos      = () => api.get('/pagos');
export const getSolicitudes = () => api.get('/solicitudes');