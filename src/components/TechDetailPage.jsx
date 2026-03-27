import React, { useState, useEffect } from 'react';
import { technicianApi } from '../api/technicianService';
import { catalogApi } from '../api/inventoryService';
import MaterialGrid from './MaterialGrid'; 
import { 
  UserCircle, Search, Calendar, Save, Loader2, ArrowLeft, CheckCircle2, History 
} from 'lucide-react'
import HistoryGrid from './HistoryGrid';

const TechDetailPage = ({ techId, onBack }) => {
  const [techData, setTechData] = useState(null);
  const [allMaterials, setAllMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("OBRA");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [view, setView] = useState('CARGA');

  const today = new Date().toLocaleDateString('es-AR', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
  }).toUpperCase();

  const showPopup = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  useEffect(() => {
    loadData();
  }, [techId, filterCategory]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resTech, resCatalog] = await Promise.all([
        technicianApi.getById(techId),
        catalogApi.getFullInventory(filterCategory)
      ]);
      setTechData(resTech.data);
      setAllMaterials(resCatalog.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = allMaterials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const historyMaterials = filteredMaterials.filter(material => 
    techData?.inventory?.some(inv => inv.materialId === material.id && inv.quantity > 0)
  );

  const handleInputChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const updates = Object.entries(inputValues)
      .filter(([_, qty]) => qty !== "" && parseInt(qty) !== 0);

    if (updates.length === 0) return;

    setSaving(true);
    try {
      await Promise.all(
        updates.map(([materialId, qty]) => 
          catalogApi.updateGlobalStock({
            materialId,
            quantity: parseInt(qty),
            technicianId: techId
          })
        )
      );
      showPopup("¡Stock actualizado!");
      setInputValues({});
      loadData();
    } catch (error) {
      showPopup("Error al guardar datos.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !techData) return (
    <div className="flex h-[80vh] items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 pb-32 animate-in fade-in duration-500">
      
      {/* TOP NAVIGATION BAR */}
      <div className="flex flex-row justify-between items-center mb-6 sm:mb-8">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-[10px] uppercase tracking-widest transition-all p-2 -ml-2"
        >
          <ArrowLeft size={16} /> <span className="hidden xs:block">Volver</span>
        </button>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] bg-slate-100/50 px-3 py-1.5 rounded-full">
          <Calendar size={12} /> {today}
        </div>
      </div>

      {/* TICKET DE PERFIL Y CONTROLES */}
      <div className="bg-white rounded-[2rem] p-5 sm:p-8 border border-slate-100 shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-center gap-6">
        
        {/* INFO TÉCNICO */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
            <UserCircle size={32} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tighter truncate">
              {/* {techData.firstName} {techData.lastName} */}
            </h2>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">
              ID: {techData.id.slice(0, 12)}...
            </p>
          </div>
        </div>

        {/* ACCIONES Y FILTROS */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* SELECTOR CATEGORÍA */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {["OBRA", "VARIOS"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterCategory(t)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-black transition-all ${
                  filterCategory === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* BOTÓN CAMBIO VISTA */}
          <button
            onClick={() => setView(view === 'CARGA' ? 'HISTORIAL' : 'CARGA')}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
              view === 'CARGA' 
              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
            }`}
          >
            {view === 'CARGA' ? <History size={14} /> : <CheckCircle2 size={14} />}
            {view === 'CARGA' ? 'Ver Historial' : 'Agregar Insumos'}
          </button>
        </div>
      </div>

      {/* BUSCADOR RESPONSIVE */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="BUSCAR MATERIAL..." 
          className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all text-xs font-bold uppercase placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CONTENIDO DINÁMICO (Grids) */}
      <div className="pb-10">
        {view === 'CARGA' ? (
          <MaterialGrid 
            materials={filteredMaterials} 
            inputValues={inputValues} 
            onInputChange={handleInputChange}
            techInventory={techData.inventory}
          />
        ) : (
          <HistoryGrid 
            materials={historyMaterials} 
            techId={techId}
          />
        )}
      </div>

      {/* BOTÓN GUARDAR FLOTANTE (OPTIMIZADO MÓVIL) */}
      <div className="fixed bottom-6 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none">
        <div className="w-full max-w-sm pointer-events-auto">
          <button 
            onClick={handleSave}
            disabled={saving || Object.keys(inputValues).length === 0}
            className={`w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
              Object.keys(inputValues).length > 0 && !saving
              ? "bg-blue-600 text-white shadow-blue-500/40" 
              : "bg-slate-200 text-slate-400 opacity-80"
            }`}
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Sincronizando..." : `Guardar ${Object.keys(inputValues).length} Cambios`}
          </button>
        </div>
      </div>

      {/* NOTIFICACIÓN TIPO TOAST */}
      {notification.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {notification.message}
        </div>
      )}

    </div>
  );
};

export default TechDetailPage;