// src/services/clienteService.js
import api from './api';

export const getClientes = () => api.get('/clientes');
export const getCliente  = (id) => api.get(`/clientes/${id}`);