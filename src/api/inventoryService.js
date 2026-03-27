import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/airFibra/inventory`;

// Agregamos la función de headers aquí también
const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export const catalogApi = {
  getFullInventory: (type) => 
    axios.get(`${API_URL}/catalog`, { 
      params: { type },
      ...getHeaders() // <--- IMPORTANTE
    }),

  updateGlobalStock: (payload) => 
    axios.post(`${API_URL}/update`, payload, getHeaders()), // <--- IMPORTANTE

  getStats: (materialId, start, end, techId) => 
    axios.get(`${API_URL}/range/${materialId}`, { 
      params: { start, end, techId },
      ...getHeaders() // <--- IMPORTANTE
    }),

  createMaterial: (data) => 
    axios.post(`${API_URL}/material`, data, getHeaders()) // <--- IMPORTANTE
};