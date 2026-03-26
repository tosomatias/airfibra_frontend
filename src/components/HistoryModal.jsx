import React, { useState } from 'react';
import { X, Calendar, BarChart3, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Historial de Stock</h3>
            <p className="text-[10px] font-bold text-blue-600 uppercase">{material.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8">
          {/* Inputs Custom de Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha Inicio</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all"
                  value={dates.start}
                  onChange={(e) => setDates({...dates, start: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Fecha Fin</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all"
                  value={dates.end}
                  onChange={(e) => setDates({...dates, end: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={fetchStats}
            disabled={loading || !dates.start || !dates.end}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-100 disabled:bg-slate-200 disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <BarChart3 size={18} />}
            Aplicar y Generar Gráfico
          </button>

          {/* Área del Gráfico */}
          <div className="mt-10 h-64 w-full">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.quantity >= 0 ? '#3b82f6' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                <AlertCircle size={32} className="mb-2 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">Sin datos para este rango</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;