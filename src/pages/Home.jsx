import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, BarChart3, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Gestión de Técnicos',
      desc: 'Control de stock por operario y entregas.',
      icon: <Users size={24} />,
      path: '/dashboard',
      color: 'bg-blue-600',
    },
    {
      title: 'Inventario Global',
      desc: 'Administrar catálogo y stock general.',
      icon: <Package size={24} />,
      path: '/inventario',
      color: 'bg-slate-900',
    },
    {
      title: 'Estadísticas',
      desc: 'Reportes de consumo y movimientos.',
      icon: <BarChart3 size={24} />,
      path: '/home',
      color: 'bg-indigo-600',
    }
  ];

  return (
    /* h-screen para ocupar el alto total, w-full para el ancho total */
    <div className="w-full min-h-screen pt-20 pb-6 px-2 sm:px-4 animate-in fade-in duration-700">
      
      <header className="mb-8 pl-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 uppercase tracking-tighter">
          Bienvenido, <span className="text-blue-600">Admin</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
          Panel Central de Control AirFibra
        </p>
      </header>

      {/* Grid configurado para expandirse al máximo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => navigate(card.path)}
            className="group bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all text-left flex flex-col justify-between min-h-[250px] w-full"
          >
            <div className={`w-16 h-16 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            
            <div>
              <h3 className="font-black text-slate-800 uppercase text-base tracking-tight group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase leading-relaxed max-w-xs">
                {card.desc}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                Acceder al módulo <ArrowRight size={14} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;