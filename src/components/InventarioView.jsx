import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, RefreshCw, X, Save, AlertCircle, Send
} from 'lucide-react';
import { catalogApi } from '../api/inventoryService';

const InventarioView = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("OBRA");
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  
  // Estado para manejar los valores de los inputs individuales por material
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    loadData();
  }, [filterCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await catalogApi.getFullInventory(filterCategory);
      setInventory(res.data || []);
    } catch (err) {
      console.error("Error al cargar", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (materialId, amount) => {
    const qty = parseInt(amount);
    if (isNaN(qty) || qty === 0) return;

    try {
      await catalogApi.updateGlobalStock({
        materialId,
        quantity: qty,
        technicianId: null
      });
      
      setInventory(prev => prev.map(item => 
        item.id === materialId ? { ...item, globalStock: item.globalStock + qty } : item
      ));
      
      // Limpiar el input después de enviar
      setInputValues(prev => ({ ...prev, [materialId]: "" }));
    } catch (err) {
      alert("Error en el servidor");
    }
  };

  const filteredData = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto p-4 font-sans bg-slate-50 min-h-screen">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            Depósito Central
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Suministros / {filterCategory}</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {["OBRA", "VARIOS"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterCategory(type)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${
                filterCategory === type 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => setShowAddMaterial(true)}
          className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2"
        >
          <Plus size={14} /> NUEVO ITEM
        </button>
      </header>

      {/* BUSCADOR ESTILIZADO */}
      <div className="relative mb-6">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder={`Filtrar ${filterCategory.toLowerCase()}...`}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col h-64 items-center justify-center gap-4">
          <RefreshCw className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-[1.5rem] border border-slate-200 p-4 flex flex-col relative hover:shadow-lg transition-all group overflow-hidden">
              
              {/* STOCK ARRIBA A LA DERECHA */}
              <div className="absolute top-3 right-3 text-right">
                <span className={`text-xl font-mono font-black ${item.globalStock <= 0 ? 'text-red-500' : 'text-slate-800'}`}>
                  {item.globalStock}
                </span>
                <p className="text-[8px] font-black text-slate-300 uppercase leading-none">Stock</p>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-500 transition-colors">
                  <Package size={20} />
                </div>
                <div className="pr-10"> {/* Espacio para el stock */}
                  <h4 className="font-bold text-slate-700 uppercase text-[11px] leading-tight tracking-tight mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-slate-300 font-mono">ID: {item.id.slice(0, 8)}</p>
                </div>
              </div>

              {/* INPUT DE CARGA ABAJO DEL NOMBRE */}
              <div className="mt-auto pt-3 border-t border-slate-50 flex items-center gap-2">
                <div className="relative flex-1">
                  <input 
                    type="number"
                    placeholder="Cant."
                    className="w-full bg-slate-50 border border-slate-100 rounded-lg pl-3 pr-8 py-2 text-xs font-bold outline-none focus:bg-white focus:border-blue-400 transition-all"
                    value={inputValues[item.id] || ""}
                    onChange={(e) => setInputValues({ ...inputValues, [item.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdjustStock(item.id, inputValues[item.id])}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-bold">qty</span>
                </div>
                
                <button 
                  onClick={() => handleAdjustStock(item.id, inputValues[item.id])}
                  disabled={!inputValues[item.id]}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER / EMPTY STATE */}
      {!loading && filteredData.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
          <AlertCircle className="mx-auto text-slate-200 mb-2" size={40} />
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sin resultados</p>
        </div>
      )}
    </div>
  );
};

export default InventarioView;