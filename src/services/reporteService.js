import api from './api';

export const getConsultas       = ()    => api.get('/reportes/consultas');
export const ejecutarConsulta   = (id)  => api.get(`/reportes/ejecutar/${id}`);