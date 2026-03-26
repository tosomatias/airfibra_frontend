import React from 'react';
import { BarChart3, Package, ArrowRight } from 'lucide-react';

const HistoryGrid = ({ materials, onOpenStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {materials.map((item) => (
        <div key={item.id} className="bg-white rounded-[1.8rem] p-5 border border-slate-100 hover:border-blue-200 transition-all shadow-sm group flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Package size={20} />
            </div>
            <h4 className="font-black text-slate-700 uppercase text-[11px] leading-tight tracking-tight pt-1">
              {item.name}
            </h4>
          </div>

          <button 
            onClick={() => onOpenStats(item)}
            className="w-full py-3.5 bg-slate-100 text-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
          >
            <BarChart3 size={14} /> 
            Ver Estadísticas
            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </button>
          
        </div>
      ))}
    </div>
  );
};

export default HistoryGrid;