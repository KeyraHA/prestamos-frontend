import api from './api';

export const getPagos      = () => api.get('/pagos');
export const getMoras      = () => api.get('/moras');
export const getPagosStats = () => api.get('/pagos/stats');