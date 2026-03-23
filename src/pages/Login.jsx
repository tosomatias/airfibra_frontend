import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2 } from 'lucide-react'; // Removed unused ArrowLeft/Link for brevity
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import Axios
import { loginSchema } from '../utils/validations';

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  });

  /**
   * ON SUBMIT EVENT
   * Sends credentials to the Express backend via Axios.
   */
const onSubmit = async (data) => {
  try {
    // Forzamos la URL completa para descartar errores de variables de entorno por ahora
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    
    // IMPORTANTE: Asegurate que la ruta coincida con el backend EXACTAMENTE
    // Si tu backend usa /airFibra (mayúscula F), el front DEBE usarla igual.
    const response = await axios.post(`${API_URL}/airFibra/auth/login`, {
      username: data.username, 
      password: data.password
    });

    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      navigate('/dashboard'); 
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("❌ Error 404: La ruta no existe en el backend.");
      alert("Error interno: La ruta de login no coincide. Revisá la consola.");
    } else if (error.response && error.response.status === 401) {
      console.log(error)
      alert("❌ Usuario o contraseña incorrectos");
    } else {
      alert("🚀 Error de conexión con el servidor");
    }
  }
};
  return (
    <div className="relative min-h-screen bg-slate-950 text-white font-sans antialiased overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://source.unsplash.com/featured/?technology,abstract')] bg-cover bg-center" />

      <header className="relative z-10 w-full p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/10 text-white">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            AirFibra <span className="text-blue-400 font-light">Pro</span>
          </h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/40 backdrop-blur-xl rounded-3xl p-10 border border-slate-700/50 shadow-2xl">
          <div className="mb-10 text-center">
            <h3 className="text-2xl font-bold text-white tracking-tight">Iniciá tu sesión</h3>
            <p className="text-slate-400 mt-1 text-sm">Gestioná empleados</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300" htmlFor="username">
                Mail de administrador
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="admin@airfibra.com"
                  className={`w-full bg-slate-900/60 border ${errors.username ? 'border-red-600' : 'border-slate-700'} text-white rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1 px-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300" htmlFor="password">
                Contraseña
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full bg-slate-900/60 border ${errors.password ? 'border-red-600' : 'border-slate-700'} text-white rounded-xl px-4 py-3.5 outline-none transition-all placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 px-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Continuar"}
            </button>
          </form>
        </div>
      </main>

      <footer className="relative z-10 w-full p-8 text-center border-t border-slate-800 bg-slate-950 mt-auto">
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Este sistema es de uso exclusivo para el personal administrativo autorizado de la provincia.
        </p>
      </footer>
    </div>
  );
};

export default Login;