import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Calendar,
  ArrowDownCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import moment from "moment";
import { catalogApi } from "../api/inventoryService";

const TechStatsModal = ({ material, techId, onClose }) => {
  const [data, setData] = useState({ movements: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false); // Bandera para evitar doble fetch

  useEffect(() => {
    const fetchStats = async () => {
      if (fetched.current) return;
      try {
        setLoading(true);
        // Formateo Senior con Moment
        const start = moment(material.start).format("YYYY-MM-DD");
        const end = moment(material.end).format("YYYY-MM-DD");

        const res = await catalogApi.getStats(material.id, start, end, techId);
        setData({
          movements: res.data?.movements || [],
          total: res.data?.total || 0,
        });
        fetched.current = true;
      } catch (err) {
        console.error("Modal fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [material, techId]);

  return (
    <div className="fixed inset-0 z- bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl border-t-4 border-blue-600 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <h3 className="font-black text-slate-900 uppercase text-xl">
              {material.name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 mt-1">
              <Calendar size={12} className="text-blue-500" />
              <span>{moment(material.start).format("DD/MM/YYYY")}</span>
              <span className="text-slate-300">/</span>
              <span>{moment(material.end).format("DD/MM/YYYY")}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 bg-slate-900 text-white divide-x divide-white/10">
          <StatBox label="Asignado" value={data.total} color="text-blue-400" />
          <StatBox
            label="Stock Actual"
            value={material.quantity}
            color="text-slate-400"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/50">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin opacity-20" />
            </div>
          ) : data.movements.length > 0 ? (
            data.movements.map((move, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 p-4 flex justify-between items-center shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <ArrowDownCircle className="text-blue-600" size={18} />
                  <div>
                    <span className="block text-[11px] font-black text-slate-800 uppercase italic">
                      Carga de Stock
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {moment(move.date).format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                </div>
                <span className="text-lg font-black text-slate-900">
                  +{move.quantity}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-30">
              <AlertCircle className="mx-auto" />
              <p className="text-[10px] font-black uppercase">Sin registros</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-componente interno para limpieza visual
const StatBox = ({ label, value, color }) => (
  <div className="p-6 text-center">
    <span
      className={`block text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${color}`}
    >
      {label}
    </span>
    <span className="text-3xl font-black">
      {value} <small className="text-[10px] opacity-40">U.</small>
    </span>
  </div>
);

export default TechStatsModal;
