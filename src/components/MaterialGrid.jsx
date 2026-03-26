import React from 'react';
import { Package } from 'lucide-react';

const MaterialGrid = ({ materials, inputValues, onInputChange, techInventory }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {materials.map((item) => {
        // Buscamos si el técnico ya tiene este material para referencia visual
        const inHand = techInventory?.find(i => i.materialId === item.id)?.quantity || 0;

        return (
          <div key={item.id} className="bg-white rounded-[1.5rem] p-5 border border-slate-100 hover:border-blue-200 transition-all shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-black text-slate-700 uppercase text-[10px] leading-tight tracking-tight flex-1 pr-2">
                {item.name}
              </h4>
        
            </div>

            <div className="relative">
              <input 
                type="number"
                placeholder="CANTIDAD"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[11px] font-black outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={inputValues[item.id] || ""}
                onChange={(e) => onInputChange(item.id, e.target.value)}
              />
            </div>
          </div>
        );
      })}
      
      {materials.length === 0 && (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No se encontraron materiales</p>
        </div>
      )}
    </div>
  );
};

export default MaterialGrid;