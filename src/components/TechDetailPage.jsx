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
  const [view, setView] = useState('CARGA'); // Nuevo estado: 'CARGA' o 'HISTORIAL'
  const [selectedMaterialForModal, setSelectedMaterialForModal] = useState(null);

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

  const handleInputChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

const handleSave = async () => {
  const updates = Object.entries(inputValues)
    .filter(([_, qty]) => qty !== "" && parseInt(qty) !== 0);

  if (updates.length === 0) return;

  setSaving(true);
  try {
    // Enviamos todas las cargas al mismo tiempo
    await Promise.all(
      updates.map(([materialId, qty]) => 
        catalogApi.updateGlobalStock({
          materialId,
          quantity: parseInt(qty),
          technicianId: techId // Al enviarlo, el backend suma al técnico y al global
        })
      )
    );

   
    showPopup("¡Stock actualizado en sistema!");
    setInputValues({}); // Limpiamos los inputs para la próxima carga
    loadData();        // Refrescamos los números en pantalla
  } catch (error) {
    console.error("Error al sincronizar stock:", error);
    showPopup("Hubo un error al guardar los datos.");
  } finally {
    setSaving(false);
  }
};

  if (loading && !techData) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 pb-32">
      {/* HEADER FIJO */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-[9px] uppercase tracking-widest transition-all">
          <ArrowLeft size={14} /> Volver
        </button>
        <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px]">
          <Calendar size={12} /> {today}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><UserCircle size={30} /></div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{techData.firstName} {techData.lastName}</h2>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">ID: {techData.id.slice(0,8)}</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          {["OBRA", "VARIOS"].map(t => (
            <button key={t} onClick={() => setFilterCategory(t)} className={`px-6 py-2 rounded-lg text-[9px] font-black transition-all ${filterCategory === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{t}</button>
          ))}
        </div>
       <button 
            onClick={() => setView('HISTORIAL')}
            className={`px-6 py-2 rounded-lg text-[9px] font-black transition-all ${view === 'HISTORIAL' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            VER HISTORIAL
          </button>
      </div>

      {/* BUSCADOR */}
      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text" 
          placeholder="BUSCAR MATERIAL..." 
          className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-xs font-bold uppercase"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

    {view === 'CARGA' ? (
        <MaterialGrid 
          materials={filteredMaterials} 
          inputValues={inputValues} 
          onInputChange={handleInputChange}
          techInventory={techData.inventory}
        />
      ) : (
        <HistoryGrid 
          materials={filteredMaterials} 
          techId={techId}
          onOpenStats={(material) => setSelectedMaterialForModal(material)}
        />
      )}

      {/* BOTÓN GUARDAR FLOTANTE */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
        <button 
          onClick={handleSave}
          disabled={saving || Object.keys(inputValues).length === 0}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200"
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
};

export default TechDetailPage;