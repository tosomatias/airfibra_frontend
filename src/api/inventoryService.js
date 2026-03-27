import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/airFibra/inventory`;

export const catalogApi = {
  // Trae sub-items filtrados: /catalog?type=OBRA o VARIOS
  getFullInventory: (type) => 
  
    axios.get(`${API_URL}/catalog`, { params: { type } }),

  // Actualización de stock: /update
  updateGlobalStock: (payload) => 
    axios.post(`${API_URL}/update`, payload),

  // Consumo histórico: /range/:id?start=...&end=...
  getStats: (materialId, start, end,techId) => 
   
    axios.get(`${API_URL}/range/${materialId}`, { 
      params: { start, end ,techId} 
    }),
    

  createMaterial: (data) => 
    axios.post(`${API_URL}/material`, data)
};