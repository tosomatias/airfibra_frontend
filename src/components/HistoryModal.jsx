import React, { useEffect, useState } from "react";
import {
  X,
  Calendar,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
  Hash,
} from "lucide-react";
import { catalogApi } from "../api/inventoryService";

const TechStatsModal = ({ material, techId, onClose }) => {
  const [data, setData] = useState({ movements: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Usamos la URL: material.id, start, end, techId
        const res = await catalogApi.getStats(
          material.id,
          material.start,
          material.end,
          techId,
        );

        setData({
          movements: res.data.movements || [],
          total: res.data.total || 0,
        });
      } catch (err) {
        console.error("Error al obtener estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    if (material.id && material.start && material.end) {
      fetchStats();
    }
  }, [material, techId]);

  return (
    <div className="fixed inset-0 z- bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* HEADER DEL MODAL */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 uppercase text-xl leading-tight tracking-tighter">
              {material.name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
              <Calendar size={12} />
              <span>{material.start}</span>
              <span className="text-slate-300">/</span>
              <span>{material.end}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* RESUMEN DE CARGA (Sobre la misma fila) */}
        <div className="grid grid-cols-2 bg-slate-900 text-white divide-x divide-white/10">
          <div className="p-6 text-center">
            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Asignado en Período
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black text-blue-400">
                {data.total}
              </span>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">
                Unidades
              </span>
            </div>
          </div>
          <div className="p-6 text-center">
            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Stock Actual Total
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black text-white">
                {material.quantity}
              </span>
              <span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">
                En Mano
              </span>
            </div>
          </div>
        </div>

        {/* LISTA DE MOVIMIENTOS */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <Hash size={14} className="text-slate-400" />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Desglose de Entregas
            </h4>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 opacity-40">
              <Loader2 className="animate-spin mb-2" size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Consultando Registro...
              </span>
            </div>
          ) : data.movements.length > 0 ? (
            <div className="space-y-3">
              {data.movements.map((move, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 p-4 flex justify-between items-center hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <ArrowDownCircle size={18} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-slate-800 uppercase tracking-tight">
                        Carga de Material
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                        {new Date(move.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">
                      +{Math.abs(move.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 flex flex-col items-center gap-3">
              <AlertCircle size={32} className="text-slate-200" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                Sin movimientos registrados para estas fechas
              </p>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="p-4 bg-white border-t border-slate-100 text-center">
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            AirFibra Inventory System - Audit Log
          </p>
        </div>
      </div>
    </div>
  );
};

export default TechStatsModal;
