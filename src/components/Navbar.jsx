import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Package, LogOut, Radio } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Inicio', path: '/home', icon: <Home size={18} /> },
    { name: 'Técnicos', path: '/allTech', icon: <Users size={18} /> },
    { name: 'Inventario', path: '/inventario', icon: <Package size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-[200] w-full">
      {/* Eliminamos max-w-7xl para que sea 100% ancho */}
      <div className="w-full px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-xl text-white shadow-lg shadow-blue-200">
              <Radio size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 tracking-tighter uppercase text-sm leading-none">
                AirFibra <span className="text-blue-600">Admin</span>
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">SISTEMA CENTRAL</span>
            </div>
          </div>

          {/* LINKS DE NAVEGACIÓN */}
          <div className="flex items-center gap-1 sm:gap-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:block">{item.name}</span>
                </Link>
              );
            })}

            <div className="w-px h-6 bg-slate-100 mx-2 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
              title="Cerrar Sesión"
            >
              <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;