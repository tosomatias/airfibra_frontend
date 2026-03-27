import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  LogOut, 
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TecnicosView from '../components/TecnicosView';
import InventarioView from '../components/InventarioView';
import { loginApi } from '../api/loginService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tecnicos');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {  
    loginApi.logout();
    navigate('/login', { replace: true }); 
  };

  const navItems = [
    { id: 'tecnicos', label: 'Técnicos', icon: <Users size={20} /> },
    { id: 'inventario', label: 'Inventario', icon: <Package size={20} /> },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">A</div>
          <span className="text-white">AirFibra</span> <span className="text-blue-400 font-light">Admin</span>
        </h1>
        {/* Botón para cerrar en móvil */}
        <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        <p className="px-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Gestión</p>
        
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false); // Cierra el menú al clickear en móvil
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-semibold transition-all border ${
              activeTab === item.id 
              ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 shadow-inner' 
              : 'text-slate-400 border-transparent hover:bg-white/5'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium w-full p-3 rounded-lg">
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      
     
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col shadow-xl fixed h-full z-40">
        <SidebarContent />
      </aside>

  
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 z-[60] shadow-2xl transition-transform duration-300 lg:hidden flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>


      <div className="flex-1 flex flex-col min-w-0">
        

        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-slate-800">AirFibra Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-slate-100 rounded-lg text-slate-600 active:bg-slate-200"
          >
            <Menu size={24} />
          </button>
        </header>

  
        <main className={`
          flex-1 p-4 sm:p-6 lg:p-10 transition-all
          lg:ml-64 /* Margen solo en desktop para no tapar el sidebar fijo */
        `}>
          <div className="max-w-7xl mx-auto">
       
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {activeTab}
              </h2>
              <p className="text-slate-500 text-sm">Sistema de gestión de fibra óptica</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[60vh]">
              {activeTab === 'tecnicos' ? <TecnicosView /> : <InventarioView />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;