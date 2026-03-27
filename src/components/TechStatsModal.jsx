import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, Activity, Clock } from 'lucide-react';
import { catalogApi } from '../api/inventoryService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TechStatsModal = ({ material, techId, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const end = new Date().toISOString();
      const start = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
      
      try {
        const res = await catalogApi.getStats(material.id, start, end, techId);
        // Filtro de seguridad por si el backend no lo trae filtrado
        const filteredData = res.data.filter(item => item.technicianId === techId || !item.hasOwnProperty('technicianId'));
        setData(filteredData);
      } catch (err) {
        console.error("Error al traer stats del técnico:", err);
      } finally {
        setLoading(false);
      }
    };

    if (material?.id && techId) fetchStats();
  }, [material.id, techId]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl lg:max-w-3xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 max-h-[95dvh] flex flex-col">
        
        {/* HEADER RESPONSIVE */}
        <div className="p-5 sm:p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
              <Activity size={20} className="sm:hidden" />
              <Activity size={24} className="hidden sm:block" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter truncate leading-tight">
                {material.name}
              </h3>
              <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <Clock size={10} /> <span className="truncate">Últimos 15 días</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 sm:p-4 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-slate-100 shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* CUERPO CON SCROLL PARA MÓVILES BAJOS */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          <div className="h-[250px] sm:h-[300px] w-full bg-slate-50/30 rounded-[1.5rem] sm:rounded-[2rem] p-2 sm:p-4 border border-slate-100/50 relative">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="font-black text-slate-300 text-[9px] sm:text-[10px] uppercase tracking-widest text-center">Analizando datos...</span>
              </div>
            ) : data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={8} 
                    fontWeight="bold" 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(str) => str.split('-').slice(2).join('/')} 
                  />
                  <YAxis fontSize={8} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9', radius: 8 }}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px', fontSize: '10px' }}
                  />
                  <Bar dataKey="quantity" radius={[4, 4, 4, 4]} barSize={20}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#2563eb" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 px-4">
                 <TrendingUp size={40} className="opacity-20 mb-2" />
                 <p className="font-black text-[9px] sm:text-[10px] uppercase text-center tracking-widest leading-relaxed">
                   Sin movimientos registrados <br/> para este técnico
                 </p>
              </div>
            )}
          </div>

          {/* RESUMEN RESPONSIVE (Cards) */}
          {!loading && data.length > 0 && (
            <div className="mt-5 sm:mt-6 grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-50/50 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] border border-blue-100/50 flex flex-col">
                <p className="text-[7px] sm:text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1.5">Total Recibido</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-blue-600">
                    {data.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">unidades</span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 sm:p-5 rounded-[1.2rem] sm:rounded-[1.5rem] border border-slate-100 flex flex-col">
                <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pico de Carga</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-slate-700">
                    {Math.max(...data.map(d => d.quantity))}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">unidades</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* FOOTER DECORATIVO (Opcional, ayuda a dar peso visual) */}
        <div className="hidden sm:block p-4 bg-slate-50/30 text-center">
             <p className="text-[7px] text-slate-300 font-bold uppercase tracking-[0.3em]">AirFibra Inventory Intelligence System</p>
        </div>
      </div>
    </div>
  );
};

export default TechStatsModal;