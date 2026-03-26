import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, Activity, Clock } from 'lucide-react';
import { catalogApi } from '../api/inventoryService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TechStatsModal = ({ material, techId, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Pedimos los últimos 15 días para que el gráfico no se vea amontonado
      const end = new Date().toISOString();
      const start = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
      
      try {
        const res = await catalogApi.getStats(material.id, start, end);
        // El backend ya nos devuelve { date, quantity } agrupado por día
        setData(res.data);
      } catch (err) {
        console.error("Error al traer stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [material.id]);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* HEADER DEL MODAL */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{material.name}</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> Flujo de carga: Últimos 15 días
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 border border-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* CUERPO: GRÁFICO */}
        <div className="p-8">
          <div className="h-[300px] w-full bg-slate-50/30 rounded-[2rem] p-4 border border-slate-100/50">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="font-black text-slate-300 text-[10px] uppercase tracking-widest">Analizando registros...</span>
              </div>
            ) : data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={9} 
                    fontWeight="bold" 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(str) => str.split('-').slice(1).reverse().join('/')} 
                  />
                  <YAxis fontSize={9} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9', radius: 10 }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    labelStyle={{ fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', color: '#64748b' }}
                  />
                  <Bar dataKey="quantity" radius={[6, 6, 6, 6]} barSize={30}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.quantity > 0 ? '#2563eb' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 font-black text-[10px] uppercase">
                No hay movimientos registrados en este periodo
              </div>
            )}
          </div>

          {/* RESUMEN RÁPIDO ABAJO DEL GRÁFICO */}
          {!loading && data.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50/50 p-4 rounded-[1.5rem] border border-blue-100">
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Asignado</p>
                <p className="text-2xl font-black text-blue-600">
                  {data.reduce((acc, curr) => acc + curr.quantity, 0)} <span className="text-[10px]">unid.</span>
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Día de mayor carga</p>
                <p className="text-2xl font-black text-slate-700">
                  {Math.max(...data.map(d => d.quantity))} <span className="text-[10px]">unid.</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechStatsModal;