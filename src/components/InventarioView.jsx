import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Plus, RefreshCw, X, Save, AlertCircle, Send, CheckCircle2, BarChart3 
} from 'lucide-react';
import { catalogApi } from '../api/inventoryService';
import HistoryModal from './HistoryModal';

const InventarioView = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("OBRA");
  
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [inputValues, setInputValues] = useState({});
  const [selectedHistory, setSelectedHistory] = useState(null);

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
      showPopup("¡Stock actualizado!");
      
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
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 font-sans bg-slate-50 min-h-screen relative animate-in fade-in duration-500">
      
      {selectedHistory && (
        <HistoryModal 
          material={selectedHistory} 
          onClose={() => setSelectedHistory(null)} 
        />
      )}

      {/* TOAST NOTIFICATION RESPONSIVE */}
      {notification.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-xs animate-in slide-in-from-top-10 duration-500">
          <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center justify-center gap-3 border border-slate-700">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest">{notification.message}</span>
          </div>
        </div>
      )}

      {/* HEADER DINÁMICO */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-blue-600 rounded-full hidden sm:block"></div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">
              Depósito Central
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Gestión de Inventario Global</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full lg:w-auto">
          {["OBRA", "VARIOS"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterCategory(type)}
              className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-[10px] font-black transition-all ${
                filterCategory === type ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      {/* BUSCADOR */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        <input 
          type="text"
          placeholder={`BUSCAR EN ${filterCategory}...`}
          className="w-full bg-white border-2 border-transparent rounded-[1.5rem] sm:rounded-[2rem] pl-16 pr-6 py-4 sm:py-5 outline-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-xs sm:text-sm font-bold shadow-sm placeholder:text-slate-300 uppercase"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col relative hover:shadow-2xl hover:shadow-blue-900/5 transition-all group overflow-hidden">
              
              {/* INDICADOR DE STOCK (Esquina superior derecha) */}
              <div className="absolute top-6 right-6 text-right">
                <span className={`text-3xl font-black tracking-tighter block leading-none ${item.globalStock <= 5 ? 'text-red-500' : 'text-slate-800'}`}>
                  {item.globalStock}
                </span>
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Stock Actual</span>
              </div>

              {/* INFO MATERIAL */}
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  <Package size={24} />
                </div>
                <div className="pr-14">
                  <h4 className="font-black text-slate-700 uppercase text-[11px] leading-tight tracking-tight mb-1 min-h-[22px]">
                    {item.name}
                  </h4>
                  <p className="text-[8px] text-slate-400 font-mono tracking-tighter uppercase">ID: {item.id.slice(0, 10)}</p>
                </div>
              </div>

              {/* BOTÓN HISTORIAL (Touch-friendly) */}
              <button 
                onClick={() => setSelectedHistory(item)}
                className="mb-5 w-full py-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 shadow-sm active:scale-95"
              >
                <BarChart3 size={14} /> Detalle de Movimientos
              </button>

              {/* ACCIÓN DE CARGA */}
              <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Ajustar Inventario</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      inputMode="numeric"
                      placeholder="Ej: 50 o -10"
                      className="flex-1 bg-slate-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white rounded-xl px-4 py-3 text-xs font-black outline-none transition-all shadow-inner"
                      value={inputValues[item.id] || ""}
                      onChange={(e) => setInputValues({ ...inputValues, [item.id]: e.target.value })}
                    />
                    <button 
                      onClick={() => handleAdjustStock(item.id, inputValues[item.id])}
                      disabled={!inputValues[item.id]}
                      className="bg-blue-600 text-white p-3.5 rounded-xl hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* DECORACIÓN HOVER */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER PARA MOBILE SPACING */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
};

export default InventarioView;