import React, { useState } from 'react';
import { X, Calendar, BarChart3, Loader2, AlertCircle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { catalogApi } from '../api/inventoryService';

const HistoryModal = ({ material, onClose }) => {
  const [dates, setDates] = useState({ start: '', end: '' });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    if (!dates.start || !dates.end) return;
    setLoading(true);
    try {
      const res = await catalogApi.getStats(material.id, dates.start, dates.end);
      setData(res.data);
    } catch (err) {
      console.error("Error al obtener estadísticas", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[300] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95dvh]">
        
        {/* HEADER RESPONSIVE */}
        <div className="p-5 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter truncate leading-tight">
              Historial de Stock
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Info size={12} className="text-blue-500 shrink-0" />
              <p className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase truncate tracking-widest">
                {material.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white hover:bg-red-50 hover:text-red-500 rounded-full transition-all border border-slate-100 shadow-sm active:scale-90 ml-4 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENIDO CON SCROLL */}
        <div className="p-5 sm:p-8 overflow-y-auto">
          
          {/* SELECTORES DE FECHA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Fecha Inicio</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-[11px] font-black outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                  value={dates.start}
                  onChange={(e) => setDates({...dates, start: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-widest">Fecha Fin</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl sm:rounded-2xl pl-11 pr-4 py-3 text-[11px] font-black outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                  value={dates.end}
                  onChange={(e) => setDates({...dates, end: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={fetchStats}
            disabled={loading || !dates.start || !dates.end}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <BarChart3 size={16} />}
            Generar Reporte Visual
          </button>

          {/* ÁREA DEL GRÁFICO ADAPTABLE */}
          <div className="mt-8 sm:mt-10 h-64 w-full bg-slate-50/50 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 border border-slate-100/50">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: '900', fill: '#94a3b8'}}
                    tickFormatter={(val) => val.split('-').slice(2).join('/')}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 9, fontWeight: '900', fill: '#94a3b8'}}
                  />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9', radius: 10}}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900' }}
                  />
                  <Bar dataKey="quantity" radius={[4, 4, 4, 4]} barSize={20}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.quantity >= 0 ? '#2563eb' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <AlertCircle size={32} className="opacity-10" />
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-center px-4">
                  {loading ? 'Consultando base de datos...' : 'Seleccioná un rango de fechas'}
                </p>
              </div>
            )}
          </div>
          
          {/* LEYENDA (Solo si hay datos) */}
          {!loading && data.length > 0 && (
            <div className="flex justify-center gap-6 mt-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Entradas</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Salidas</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;