import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE}/airFibra/technicians`;

// Helper para obtener el token del localStorage
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export const technicianApi = {
  // Buscar técnicos por nombre/apellido: /search?q=...
  search: (query) => 
    axios.get(`${API_URL}/search`, { 
      params: { q: query },
      ...getHeaders() 
    }),

  // Ver detalle de un técnico e inventario personal: /:id
  getById: (id) => 
    axios.get(`${API_URL}/${id}`, getHeaders()),

  // Crear nuevo técnico: /
  create: (data) => 
    axios.post(API_URL, data, getHeaders()),

  // Modificar datos (nombre/apellido): /:id
  update: (id, data) => 
    axios.patch(`${API_URL}/${id}`, data, getHeaders()),

  // Eliminar técnico: /:id
  remove: (id) => 
    axios.delete(`${API_URL}/${id}`, getHeaders()),
};