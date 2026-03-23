import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, Layers, AlertCircle, RefreshCw, Save } from 'lucide-react';
import { catalogApi } from '../api/inventoryService';


const InventarioView = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("TODOS");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await catalogApi.getFullInventory();
      setInventory(res.data);
    } catch (err) {
      console.error("Error al cargar inventario", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (materialId, amount) => {
    try {
      await catalogApi.updateGlobalStock(materialId, amount);
      
      setInventory(prev => prev.map(item => 
        item.id === materialId 
          ? { ...item, globalStock: item.globalStock + amount } 
          : item
      ));
    } catch (err) {
      alert("Error al actualizar stock");
      loadData(); 
    }
  };

  const filteredData = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "TODOS" || item.category.name === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen text-slate-400">
      <RefreshCw className="animate-spin mb-4" size={40} />
      <p className="font-medium">Sincronizando Depósito Central...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-500">
      

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Depósito Central</h2>
          <p className="text-slate-500">Gestión de existencias físicas en almacén.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
          {[ "MATERIALES VARIOS", "MATERIALES OBRA"].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {cat === "MATERIALES VARIOS" ? "MATERIALES VARIOS" : cat}
            </button>
          ))}
        </div>
      </header>

     
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Buscar material en el catálogo (ej: Fibra, Tarugo, Morseto...)"
          className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-500 transition-all shadow-sm text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-5 flex items-center justify-between hover:border-blue-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.category.name === "MATERIALES OBRA" ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
              }`}>
                {item.category.name === "MATERIALES OBRA" ? <Layers size={24} /> : <Package size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 leading-tight">{item.name}</h4>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {item.category.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">

              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Disponible</p>
                <span className={`text-2xl font-mono font-black ${
                  item.globalStock <= 0 ? 'text-red-500' : 'text-slate-700'
                }`}>
                  {item.globalStock}
                </span>
              </div>

    
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleAdjustStock(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all font-bold"
                  >
                    +1
                  </button>
                  <button 
                    onClick={() => handleAdjustStock(item.id, 10)}
                    className="w-8 h-8 flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-700 hover:text-white transition-all text-xs font-bold"
                  >
                    +10
                  </button>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleAdjustStock(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all font-bold"
                  >
                    -1
                  </button>
                  <button 
                    onClick={() => handleAdjustStock(item.id, -10)}
                    className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-all text-xs font-bold"
                  >
                    -10
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INDICADOR DE STOCK VACÍO */}
      {filteredData.length === 0 && (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center mt-6">
          <AlertCircle className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500 font-medium">No se encontraron materiales con ese nombre.</p>
        </div>
      )}
    </div>
  );
};

export default InventarioView;