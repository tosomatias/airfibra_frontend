import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, RefreshCw, UserCircle, 
  ChevronRight, X, UserCheck 
} from 'lucide-react';
import { technicianApi } from '../../api/technicianService';
import { useNavigate } from 'react-router-dom';

const AllTech = ({ onSelectTech }) => {
    const navigate = useNavigate(); 
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTech, setNewTech] = useState({ firstName: "", lastName: "" });

  // Función para obtener técnicos (con soporte para búsqueda)
  const fetchTechnicians = async (query = "") => {
    setLoading(true);
    try {
      const res = await technicianApi.search(query.toUpperCase());
      setTechnicians(res.data);
    } catch (err) {
      console.error("Error al obtener técnicos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para búsqueda con Debounce (300ms)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTechnicians(searchTerm);
    }, 300);
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

  return (
    <div className="w-full min-h-screen animate-in fade-in duration-500 p-4 sm:p-6 lg:p-8">
      
      {/* HEADER DE SECCIÓN */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="pl-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                <Users size={28} />
            </div>
            Equipo Técnico
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Gestión de Operarios y Herramientas
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95"
        >
          <UserPlus size={16} /> Registrar Técnico
        </button>
      </header>

      {/* BARRA DE BÚSQUEDA */}
      <div className="relative mb-10 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text"
          placeholder="ESCRIBE EL NOMBRE O APELLIDO DEL TÉCNICO..."
          className="w-full bg-white border border-slate-100 rounded-[2rem] pl-16 pr-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all text-xs font-bold uppercase tracking-wider shadow-sm placeholder:text-slate-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LISTADO DE TÉCNICOS (GRID) */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <RefreshCw className="animate-spin text-blue-600" size={40} />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Sincronizando Personal...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {technicians.length > 0 ? (
            technicians.map((tech) => (
              <div key={tech.id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-50 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all flex flex-col items-center relative overflow-hidden">
                
                {/* Decoración de fondo al hacer hover */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500 mb-6 shadow-inner relative z-10">
                  <UserCircle size={40} />
                </div>

                <div className="text-center mb-8 relative z-10">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Operario Autorizado</p>
                  <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight leading-tight">
                    {tech.firstName}
                  </h3>
                  <h3 className="font-black text-blue-600 uppercase text-sm tracking-tight">
                    {tech.lastName}
                  </h3>
                </div>

                <button 
                    onClick={() => navigate(`/techId/${tech.id}`)} 
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 hover:bg-blue-600 active:scale-95 shadow-lg shadow-slate-100"
                    >
                    Ver Perfil <ChevronRight size={14} />
                    </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center opacity-40">
              <Users size={60} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Sin resultados para tu búsqueda</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL PARA AGREGAR TÉCNICO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 sm:p-12 animate-in zoom-in duration-300 shadow-2xl relative">
            <button 
                onClick={() => setShowAddModal(false)} 
                className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
                <X size={20} />
            </button>

            <header className="mb-8">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <UserPlus size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Nuevo Operario</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Ingresa los datos para el alta</p>
            </header>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Nombre</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500/20 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold uppercase outline-none transition-all placeholder:text-slate-200" placeholder="Ej: MARCOS" value={newTech.firstName} onChange={e => setNewTech({...newTech, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 tracking-widest">Apellido</label>
                <input required className="w-full bg-slate-50 border-2 border-slate-50 focus:border-blue-500/20 focus:bg-white rounded-2xl px-6 py-4 text-xs font-bold uppercase outline-none transition-all placeholder:text-slate-200" placeholder="Ej: GARCÍA" value={newTech.lastName} onChange={e => setNewTech({...newTech, lastName: e.target.value})} />
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/30 hover:bg-slate-900 active:scale-95 transition-all mt-4">
                Confirmar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTech;