import React, { useState } from 'react';
import { BarChart3, Package, ArrowRight, Calendar, Info } from 'lucide-react';
import TechStatsModal from './TechStatsModal';

const HistoryGrid = ({ materials, techId }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [dates, setDates] = useState({});

  const handleDateChange = (materialId, field, value) => {
    setDates(prev => ({
      ...prev,
      [materialId]: { ...prev[materialId], [field]: value }
    }));
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {materials.map((item) => {
        const itemDates = dates[item.id] || { start: '', end: '' };
        const isReady = itemDates.start && itemDates.end;

        return (
          <div 
            key={item.id} 
            className={`bg-white rounded-[2.2rem] p-6 border-2 transition-all duration-300 group flex flex-col justify-between min-h-[280px] ${
              isReady 
              ? "border-blue-100 shadow-xl shadow-blue-500/5" 
              : "border-slate-50 shadow-sm hover:border-slate-200"
            }`}
          >
            {/* INFO MATERIAL */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner shrink-0">
                  <Package size={22} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-slate-800 uppercase text-[11px] leading-tight tracking-tight break-words">
                    {item.name}
                  </h4>
                  <p className="text-[8px] text-slate-400 font-mono mt-1 uppercase tracking-tighter">Ref: {item.id.slice(0, 10)}</p>
                </div>
              </div>

              {/* SELECTORES DE FECHA RESPONSIVE */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 p-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase ml-1 tracking-widest">Desde</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={itemDates.start}
                      onChange={(e) => handleDateChange(item.id, 'start', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl text-[10px] font-black p-3 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 appearance-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase ml-1 tracking-widest">Hasta</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={itemDates.end}
                      onChange={(e) => handleDateChange(item.id, 'end', e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl text-[10px] font-black p-3 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 appearance-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN ACCIÓN */}
            <div className="mt-6">
              <button 
                disabled={!isReady}
                onClick={() => setSelectedMaterial({
                  ...item,
                  startDate: itemDates.start,
                  endDate: itemDates.end
                })}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  isReady 
                    ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
                }`}
              >
                <BarChart3 size={16} /> 
                <span>Analizar Historial</span>
                {isReady && <ArrowRight size={14} className="animate-pulse" />}
              </button>
            </div>
          </div>
        );
      })}

      {/* EMPTY STATE */}
      {materials.length === 0 && (
        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <Info size={40} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Este técnico no tiene materiales asignados</p>
        </div>
      )}

      {/* MODAL RESPONSIVE */}
      {selectedMaterial && (
        <TechStatsModal 
          material={selectedMaterial} 
          techId={techId} 
          startDate={selectedMaterial.startDate}
          endDate={selectedMaterial.endDate}
          onClose={() => setSelectedMaterial(null)} 
        />
      )}
    </div>
  );
};

export default HistoryGrid;