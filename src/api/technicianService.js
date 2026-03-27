import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/airFibra/technicians`;

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export const technicianApi = {
  search: (query) => 
    axios.get(`${API_URL}/search`, { 
      params: { q: query },
      ...getHeaders() 
    }),

  getById: (id) => 
    axios.get(`${API_URL}/${id}`, getHeaders()),

  create: (data) => 
    axios.post(API_URL, data, getHeaders()),

  update: (id, data) => 
    axios.patch(`${API_URL}/${id}`, data, getHeaders()),

  remove: (id) => 
    axios.delete(`${API_URL}/${id}`, getHeaders()),
};