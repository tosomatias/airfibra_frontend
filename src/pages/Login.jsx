import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../utils/validations';
import { loginApi } from '../api/loginService'; 

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginApi.login(data);
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('admin_role', response.data.user.role);
        }
        navigate('/home');
      }
    } catch (error) {

      const status = error.response?.status;
      if (status === 404) alert("❌ Error 404: Ruta no encontrada.");
      else if (status === 401) alert("❌ Usuario o contraseña incorrectos");
      else alert("🚀 Error de conexión con el servidor");
    }
  };

  return (

    <div className="relative min-h-[100dvh] bg-slate-950 text-white font-sans antialiased flex flex-col overflow-y-auto">
      
  
      <div className="fixed inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center" />

  
      <header className="relative z-10 w-full p-4 sm:p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg shadow-blue-500/20">
            A
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            AirFibra <span className="text-blue-400 font-light italic">Pro</span>
          </h1>
        </div>
      </header>


      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-slate-700/50 shadow-2xl">
          
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full mb-4 text-blue-400">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Acceso Administrativo</h3>
            <p className="text-slate-400 mt-2 text-sm">Ingresá tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300 ml-1" htmlFor="username">
                Usuario de red
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                <input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="admin_nombre"
                  className={`w-full bg-slate-950/50 border ${errors.username ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base outline-none transition-all placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500`}
                />
              </div>
              {errors.username && <p className="text-red-400 text-[11px] sm:text-xs mt-1 ml-1">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-slate-300 ml-1" htmlFor="password">
                Contraseña segura
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                className={`w-full bg-slate-950/50 border ${errors.password ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-3 sm:py-3.5 text-sm sm:text-base outline-none transition-all placeholder:text-slate-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500`}
              />
              {errors.password && <p className="text-red-400 text-[11px] sm:text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.97] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none mt-4 text-sm sm:text-base"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </main>


      <footer className="relative z-10 w-full p-6 sm:p-8 text-center border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <p className="text-[10px] sm:text-xs text-slate-500 max-w-xs sm:max-w-lg mx-auto leading-relaxed">
          SISTEMA DE GESTIÓN DE INVENTARIO - AIRFIBRA S.A.<br/>
          Uso restringido a personal autorizado. IP detectada y registrada.
        </p>
      </footer>
    </div>
  );
};

export default Login;