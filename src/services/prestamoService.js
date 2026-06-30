import api from './api';

export const getPrestamos       = ()    => api.get('/prestamos');
export const getPrestamosStats  = ()    => api.get('/prestamos/stats');
export const getCronograma      = (id)  => api.get(`/prestamos/${id}/cronograma`);
