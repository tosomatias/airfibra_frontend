import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, RefreshCw, X, Save, AlertCircle, Send, CheckCircle2, BarChart3 
} from 'lucide-react';
import { catalogApi } from '../api/inventoryService';
import HistoryModal from './HistoryModal'; // Asegúrate de crear este archivo con el código anterior

const InventarioView = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("OBRA");
  
  // Estados para UI
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [inputValues, setInputValues] = useState({});
  const [selectedHistory, setSelectedHistory] = useState(null); // Estado para el Modal

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
      
      setInputValues(prev => ({ ...prev, [materialId]: "" }));
      showPopup("¡Stock actualizado correctamente!");
      
    } catch (err) {
      alert("Error al actualizar el stock");
    }
  };

  const showPopup = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const filteredData = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto p-4 font-sans bg-slate-50 min-h-screen relative">
      
      {/* MODAL DE HISTORIAL */}
      {selectedHistory && (
        <HistoryModal 
          material={selectedHistory} 
          onClose={() => setSelectedHistory(null)} 
        />
      )}

      {/* POPUP DE ÉXITO (Toast) */}
      {notification.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="bg-emerald-500 p-1 rounded-full">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-2">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            Depósito Central
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Stock en tiempo real</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {["OBRA", "VARIOS"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterCategory(type)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${
                filterCategory === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder={`Buscar en ${filterCategory}...`}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><RefreshCw className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-[1.8rem] border border-slate-200 p-5 flex flex-col relative hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-500">
              
              <div className="absolute top-4 right-5 text-right">
                <span className={`text-2xl font-mono font-black ${item.globalStock <= 0 ? 'text-red-500' : 'text-slate-800'}`}>
                  {item.globalStock}
                </span>
                <p className="text-[8px] font-black text-slate-300 uppercase leading-none">Actual</p>
              </div>

              <div className="flex items-start gap-3 mb-5">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Package size={22} />
                </div>
                <div className="pr-12">
                  <h4 className="font-bold text-slate-700 uppercase text-[11px] leading-tight tracking-tight mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[9px] text-slate-300 font-mono">SKU: {item.id.slice(0, 8)}</p>
                </div>
              </div>

              {/* BOTÓN VER HISTORIAL */}
              <button 
                onClick={() => setSelectedHistory(item)}
                className="mb-4 w-full py-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all flex items-center justify-center gap-2 border border-slate-100 group-hover:border-blue-100"
              >
                <BarChart3 size={12} /> Ver Historial
              </button>

              <div className="mt-auto space-y-2">
                <label className="text-[8px] font-black text-slate-400 uppercase ml-1">Cargar/Descargar</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="number"
                      placeholder="Ej: 10"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-3 pr-8 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-blue-400 transition-all shadow-inner"
                      value={inputValues[item.id] || ""}
                      onChange={(e) => setInputValues({ ...inputValues, [item.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdjustStock(item.id, inputValues[item.id])}
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleAdjustStock(item.id, inputValues[item.id])}
                    disabled={!inputValues[item.id]}
                    className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-blue-100 active:scale-90"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventarioView;