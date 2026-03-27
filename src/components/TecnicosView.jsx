import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, RefreshCw, UserCircle, ChevronRight, X } from 'lucide-react';
import { technicianApi } from '../api/technicianService';
import TechDetailPage from './TechDetailPage';

const TecnicosView = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [newTech, setNewTech] = useState({ firstName: "", lastName: "" });

  const fetchTechnicians = async (query = "") => {
    setLoading(true);
    try {
      const res = await technicianApi.search(query.toUpperCase());
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchTechnicians(searchTerm), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await technicianApi.create({
        firstName: newTech.firstName.toUpperCase(),
        lastName: newTech.lastName.toUpperCase()
      });
      setNewTech({ firstName: "", lastName: "" });
      setShowAddModal(false);
      fetchTechnicians(searchTerm);
    } catch (err) {
      alert("Error al crear técnico");
    }
  };

  if (selectedTechId) {
    return (
      <TechDetailPage 
        techId={selectedTechId} 
        onBack={() => setSelectedTechId(null)} 
        onUpdateList={() => fetchTechnicians(searchTerm)}
      />
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 p-4 sm:p-6 lg:p-8">
      
      {/* HEADER RESPONSIVE */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
            <Users className="text-blue-600 w-8 h-8 sm:w-10 sm:h-10" />
            Equipo Técnico
          </h2>
          <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1">Directorio Central</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <UserPlus size={16} /> Agregar Técnico
        </button>
      </header>

      {/* BUSCADOR RESPONSIVE */}
      <div className="relative mb-8">
        <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="BUSCAR TÉCNICO..."
          className="w-full bg-white border-2 border-slate-100 rounded-2xl sm:rounded-[2rem] pl-14 sm:pl-16 pr-6 py-4 sm:py-5 outline-none focus:border-blue-500/50 transition-all text-xs sm:text-sm font-bold shadow-sm placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID DE CARDS RESPONSIVE */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="animate-spin text-blue-500 w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {technicians.length > 0 ? (
            technicians.map((tech) => (
              <div key={tech.id} className="group bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 mb-4 shadow-inner">
                  <UserCircle size={32} />
                </div>
                <div className="text-center mb-5">
                  <h3 className="font-black text-slate-800 uppercase text-[11px] sm:text-[12px] tracking-tight leading-tight">
                    {tech.firstName}
                  </h3>
                  <h3 className="font-black text-blue-600 uppercase text-[11px] sm:text-[12px] tracking-tight">
                    {tech.lastName}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedTechId(tech.id)}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Ver Perfil <ChevronRight size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron técnicos</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL RESPONSIVE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 animate-in zoom-in duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Nuevo Registro</h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="text-slate-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500/20 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none transition-all" placeholder="Ej: JUAN" value={newTech.firstName} onChange={e => setNewTech({...newTech, firstName: e.target.value})} />
              </div>
              <div className="space-y-1 mb-6">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Apellido</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500/20 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none transition-all" placeholder="Ej: PEREZ" value={newTech.lastName} onChange={e => setNewTech({...newTech, lastName: e.target.value})} />
              </div>
              <button className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all">
                Registrar Técnico
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TecnicosView;