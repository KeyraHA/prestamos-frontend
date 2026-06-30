import api from './api';

export const getSolicitudes      = () => api.get('/solicitudes');
export const getSolicitudesStats = () => api.get('/solicitudes/stats');