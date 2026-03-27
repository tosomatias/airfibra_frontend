
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export const loginApi = {

  login: (credentials) => 
    axios.post(`${API_BASE}/airFibra/auth/login`, {
      username: credentials.username,
      password: credentials.password
    }),


  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_name');

  }
};