import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, RefreshCw, UserCircle, ChevronRight, X } from 'lucide-react';
import { technicianApi } from '../api/technicianService';
import TechDetailPage from './TechDetailPage'; // Cambiamos el nombre para mayor claridad

const TecnicosView = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState(null); // Solo guardamos el ID
  const [newTech, setNewTech] = useState({ firstName: "", lastName: "" });

  const fetchTechnicians = async (query = "") => {
    setLoading(true);
    try {
      // Forzamos mayúsculas para la búsqueda
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

  // --- RENDERIZADO CONDICIONAL DE PÁGINA COMPLETA ---
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
    <div className="max-w-[1400px] mx-auto animate-in fade-in duration-500 p-4">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Equipo Técnico
          </h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Directorio Central</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
        >
          <UserPlus size={16} /> Agregar
        </button>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="BUSCAR POR NOMBRE O APELLIDO..."
          className="w-full bg-white border-2 border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:border-blue-500/50 transition-all text-sm font-bold shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><RefreshCw className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="group bg-white rounded-[2rem] p-5 border border-slate-100 hover:shadow-xl transition-all flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 mb-4">
                <UserCircle size={36} />
              </div>
              <h3 className="font-black text-slate-800 uppercase text-[12px] text-center mb-4 tracking-tight">
                {tech.firstName} <br />
                <span className="text-blue-600">{tech.lastName}</span>
              </h3>
              <button 
                onClick={() => setSelectedTechId(tech.id)}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Ver Perfil <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE AGREGAR SIGUE SIENDO MODAL PORQUE ES UN FORM CORTO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Nuevo Técnico</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold uppercase" placeholder="Nombre" value={newTech.firstName} onChange={e => setNewTech({...newTech, firstName: e.target.value})} />
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold uppercase" placeholder="Apellido" value={newTech.lastName} onChange={e => setNewTech({...newTech, lastName: e.target.value})} />
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Registrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TecnicosView;