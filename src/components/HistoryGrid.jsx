import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Package, Search, Loader2, AlertCircle, Tag } from "lucide-react";
import { technicianApi } from "../api/technicianService";
import TechStatsModal from "./TechStatsModal";

const HistoryGrid = ({ techId }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dates, setDates] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const loadTechData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await technicianApi.getById(techId);
      if (data?.inventory) {
        setInventory(
          data.inventory.map((item) => ({
            id: item.material.id,
            name: item.material.name,
            quantity: item.quantity,
            category: item.material.category?.name || "SIN CATEGORÍA",
          })),
        );
      }
    } catch (err) {
      console.error("Error inventory fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [techId]);

  useEffect(() => {
    loadTechData();
  }, [loadTechData]);

  // Agrupación optimizada con useMemo
  const groupedInventory = useMemo(() => {
    return inventory
      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .reduce((acc, item) => {
        const cat = item.category;
        acc[cat] = [...(acc[cat] || []), item];
        return acc;
      }, {});
  }, [inventory, searchTerm]);

  const handleDateChange = (id, field, value) => {
    setDates((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const closeAndClear = () => {
    setSelectedMaterial(null);
    setDates({}); // Limpia inputs y bloquea botones
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 opacity-40">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col animate-in fade-in duration-300">
      <div className="relative mb-4">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="BUSCAR MATERIAL..."
          className="w-full bg-white border-2 border-slate-100 p-4 pl-12 text-xs font-black uppercase outline-none focus:border-blue-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white border border-slate-200 shadow-2xl divide-y divide-slate-100">
        {Object.entries(groupedInventory).map(([category, items]) => (
          <div key={category}>
            <div className="bg-slate-50 px-5 py-2 border-y border-slate-200 flex items-center gap-2">
              <Tag size={12} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase text-slate-500">
                {category}
              </span>
            </div>

            {items.map((item) => {
              const mDates = dates[item.id] || { start: "", end: "" };
              const canApply = mDates.start && mDates.end;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-5 hover:bg-slate-50"
                >
                  <div className="col-span-4 flex items-center gap-4">
                    <Package className="text-slate-400" size={20} />
                    <h4 className="font-black text-slate-900 uppercase text-[13px]">
                      {item.name}
                    </h4>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-lg font-black text-slate-800">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="col-span-4 flex gap-2">
                    <input
                      type="date"
                      value={mDates.start}
                      className="w-full bg-slate-50 border p-2 text-[10px] font-black"
                      onChange={(e) =>
                        handleDateChange(item.id, "start", e.target.value)
                      }
                    />
                    <input
                      type="date"
                      value={mDates.end}
                      className="w-full bg-slate-50 border p-2 text-[10px] font-black"
                      onChange={(e) =>
                        handleDateChange(item.id, "end", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      disabled={!canApply}
                      onClick={() =>
                        setSelectedMaterial({ ...item, ...mDates })
                      }
                      className={`px-6 py-3 text-[10px] font-black uppercase transition-all ${canApply ? "bg-blue-600 text-white hover:bg-slate-900" : "bg-slate-100 text-slate-300"}`}
                    >
                      Ver Historial
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedMaterial && (
        <TechStatsModal
          key={selectedMaterial.id} // Forza reset de estado interno si cambia de material
          material={selectedMaterial}
          techId={techId}
          onClose={closeAndClear}
        />
      )}
    </div>
  );
};

export default HistoryGrid;
