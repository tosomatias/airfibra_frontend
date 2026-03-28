import React, { useState, useEffect, useCallback } from 'react';
import { 
  UserCircle, Calendar, ArrowLeft, Loader2, Package, History, AlertTriangle 
} from 'lucide-react';

import { technicianApi } from '../../api/technicianService';
import MaterialGrid from '../../components/MaterialGrid';
import HistoryGrid from '../../components/HistoryGrid';
import { useNavigate, useParams } from 'react-router-dom';

const TechId = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [techData, setTechData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('CARGA'); // 'CARGA' para Materiales, 'HISTORIAL' para Historial

  const today = new Date().toLocaleDateString('es-AR', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
  }).toUpperCase();

  const loadTechDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await technicianApi.getById(id); 
      setTechData(res.data);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, reingresa.");
      } else {
        setError("No se pudo encontrar al técnico solicitado.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTechDetails();
  }, [loadTechDetails]);

  // Pantalla de Carga
  if (loading) return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-4 animate-in fade-in">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Cargando Perfil...</span>
    </div>
  );

  // Pantalla de Error
  if (error || !techData) return (
    <div className="flex h-[80vh] flex-col items-center justify-center gap-6 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mx-4">
      <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-lg">
        <AlertTriangle size={40} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Ops, hubo un problema</h3>
        <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 bg-red-50 px-3 py-1.5 rounded-full">{error}</p>
      </div>
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-black text-[10px] uppercase tracking-widest transition-all p-2"
      >
        <ArrowLeft size={16} /> Volver al listado
      </button>
    </div>
  );

  return (
    <div className="w-full min-h-screen animate-in fade-in duration-500 p-4 sm:p-6 lg:p-8">
      
      {/* HEADER DE PERFIL */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm mb-10 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5 w-full lg:w-auto pl-2">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 shrink-0">
            <UserCircle size={48} />
          </div>
          <div className="min-w-0">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Operario Autorizado</p>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter truncate leading-none">
              {techData.firstName}
            </h2>
            <h2 className="text-3xl font-black text-blue-600 uppercase tracking-tighter truncate">
              {techData.lastName}
            </h2>
          </div>
        </div>

        {/* BOTONES DE NAVEGACIÓN INTERNA (CARGA / HISTORIAL) */}
        <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-[1.5rem] w-full lg:w-auto">
          <button 
            onClick={() => setView('CARGA')}
            className={`flex-1 lg:flex-none px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              view === 'CARGA' 
              ? "bg-white text-blue-600 shadow-sm shadow-blue-900/5" 
              : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Package size={16} /> MATERIALES
          </button>
          
          <button 
            onClick={() => setView('HISTORIAL')}
            className={`flex-1 lg:flex-none px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              view === 'HISTORIAL' 
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
              : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <History size={16} /> HISTORIAL
          </button>
        </div>
      </div>

      {/* CONTENIDO DINÁMICO SEGÚN LA VISTA SELECCIONADA */}
      <div className="pb-16 w-full animate-in slide-in-from-bottom-4 duration-500">
        {view === 'CARGA' ? (
          <MaterialGrid 
            techId={id} 
            techData={techData}
            onUpdate={loadTechDetails} 
          />
        ) : (
          <HistoryGrid 
            techId={id}
          />
        )}
      </div>

    </div>
  );
};

export default TechId;