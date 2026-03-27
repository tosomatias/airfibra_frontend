import React from 'react';
import { Package, Hash, PlusCircle } from 'lucide-react';

const MaterialGrid = ({ materials, inputValues, onInputChange, techInventory }) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in duration-500">
      {materials.map((item) => {
        // Cantidad que el técnico ya tiene asignada
        const inHand = techInventory?.find(i => i.materialId === item.id)?.quantity || 0;
        const isSelected = inputValues[item.id] && inputValues[item.id] !== "";

        return (
          <div 
            key={item.id} 
            className={`group bg-white rounded-[2rem] p-5 border-2 transition-all duration-300 flex flex-col justify-between min-h-[160px] sm:min-h-[180px] ${
              isSelected 
              ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-4 ring-blue-500/5" 
              : "border-slate-100 hover:border-slate-200 shadow-sm"
            }`}
          >
            {/* INFO SUPERIOR */}
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-black text-slate-800 uppercase text-[11px] leading-tight tracking-tight flex-1">
                  {item.name}
                </h4>
                <Package 
                  size={16} 
                  className={isSelected ? "text-blue-500" : "text-slate-300"} 
                />
              </div>

              {/* INDICADOR DE STOCK ACTUAL DEL TÉCNICO */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full">
                <Hash size={10} className="text-slate-400" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                  En mano: <span className={inHand > 0 ? "text-blue-600" : ""}>{inHand}</span>
                </span>
              </div>
            </div>

            {/* INPUT DE CARGA */}
            <div className="relative mt-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <PlusCircle size={14} className={isSelected ? "text-blue-500" : "text-slate-400"} />
              </div>
              <input 
                type="number"
                inputMode="numeric" // Optimiza el teclado numérico en móviles
                placeholder="0"
                className={`w-full bg-slate-50 border-2 rounded-xl pl-10 pr-4 py-3 text-sm font-black outline-none transition-all ${
                  isSelected 
                  ? "border-blue-100 bg-white text-blue-600 focus:border-blue-500" 
                  : "border-transparent focus:bg-white focus:border-slate-200"
                }`}
                value={inputValues[item.id] || ""}
                onChange={(e) => onInputChange(item.id, e.target.value)}
              />
              {/* Etiqueta flotante interna si hay valor */}
              {isSelected && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-400 uppercase">
                  Sumar
                </span>
              )}
            </div>
          </div>
        );
      })}
      
      {/* EMPTY STATE */}
      {materials.length === 0 && (
        <div className="col-span-full py-16 sm:py-24 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
            <Package size={32} />
          </div>
          <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.2em]">
            No se encontraron insumos
          </p>
          <p className="text-slate-300 text-[9px] uppercase mt-1">Revisá el filtro o los términos de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default MaterialGrid;