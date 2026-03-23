import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const catalogApi = {
  // Trae todo el material agrupado por categoría (podes usar el endpoint de inventory o uno nuevo)
  getFullInventory: () => axios.get(`${API_URL}/inventory/full`), // Endpoint sugerido basado en tu CatalogService
  
  // Actualización manual de stock global
  updateGlobalStock: (materialId, quantityToAdd) => 
    axios.post(`${API_URL}/inventory/bulk`, { 
      updates: [{ materialId, quantityToAdd }] 
    })
};