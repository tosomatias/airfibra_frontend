import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  LogOut, 
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TecnicosView from '../components/TecnicosView';
import InventarioView from '../components/InventarioView';

// Importamos los sub-componentes (los crearemos abajo)


const Dashboard = () => {
  const navigate = useNavigate();
  
  // ESTADO PARA CAMBIAR ENTRE VISTAS
  // 'tecnicos' o 'inventario'
  const [activeTab, setActiveTab] = useState('tecnicos');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">A</div>
            AirFibra <span className="text-blue-400 font-light">Admin</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Gestión</p>
          
          <button 
            onClick={() => setActiveTab('tecnicos')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === 'tecnicos' 
              ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 shadow-inner' 
              : 'text-slate-400 border-transparent hover:bg-white/5'
            }`}
          >
            <Users size={18} />
            Técnicos
          </button>

          <button 
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === 'inventario' 
              ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 shadow-inner' 
              : 'text-slate-400 border-transparent hover:bg-white/5'
            }`}
          >
            <Package size={18} />
            Inventario
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium w-full p-3 rounded-lg">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === 'tecnicos' ? <TecnicosView /> : <InventarioView />}
      </main>
    </div>
  );
};

export default Dashboard;