import React, { useState, useEffect, useCallback } from "react";
import {
  Hash,
  PlusCircle,
  Search,
  Save,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { catalogApi } from "../api/inventoryService";

const MaterialGrid = ({ techId, techInventory, onUpdate }) => {
  const [materials, setMaterials] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await catalogApi.getFullInventory();
      const formattedData = res.data.map((m) => ({
        ...m,
        category: m.category?.name?.includes("OBRA") ? "OBRA" : "VARIOS",
      }));
      setMaterials(formattedData);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const handleInputChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const itemsToSave = Object.entries(inputValues).filter(
      ([_, qty]) => qty && parseInt(qty) > 0,
    );
    if (itemsToSave.length === 0)
      return alert("Ingresa al menos una cantidad válida");

    setIsSaving(true);
    try {
      await Promise.all(
        itemsToSave.map(([materialId, qty]) =>
          catalogApi.updateGlobalStock({
            materialId,
            quantity: parseInt(qty),
            technicianId: techId,
          }),
        ),
      );
      setInputValues({});
      alert("¡Carga exitosa!");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al procesar la carga");
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const obra = filtered.filter((m) => m.category === "OBRA");
  const varios = filtered.filter((m) => m.category === "VARIOS");

  const renderRow = (item) => {
    const inHand =
      techInventory?.find((i) => i.materialId === item.id)?.quantity || 0;
    const val = inputValues[item.id] || "";

    return (
      <div
        key={item.id}
        className={`flex items-center gap-4 p-5 border-b border-slate-100 transition-all ${val ? "bg-blue-50/50" : "hover:bg-slate-50/30"}`}
      >
        <div className="flex-1 min-w-0">
          {/* Nombres un poco más grandes y legibles */}
          <h4 className="font-black text-slate-800 uppercase text-[14px] tracking-tight truncate">
            {item.name}
          </h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-1">
            <Hash size={11} /> En mano:{" "}
            <b className="text-blue-600">{inHand}</b>
          </span>
        </div>

        {/* Input numérico apenas más grande */}
        <div className="relative w-32">
          <input
            type="number"
            placeholder="0"
            className={`w-full bg-white border-2 rounded-xl pl-9 pr-3 py-2.5 text-sm font-black outline-none transition-all ${val ? "border-blue-500 text-blue-600" : "border-slate-100"}`}
            value={val}
            onChange={(e) => handleInputChange(item.id, e.target.value)}
          />
          <PlusCircle
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${val ? "text-blue-500" : "text-slate-300"}`}
          />
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
        <RefreshCw className="animate-spin text-blue-600" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Cargando Catálogo...
        </span>
      </div>
    );

  return (
    /* Caja sin bordes redondeados (rounded-none) */
    <div className="bg-white rounded-none border border-slate-200 shadow-xl flex flex-col h-[650px] overflow-hidden animate-in fade-in duration-500">
      {/* HEADER: Buscador un poco más largo y Botón en su lugar original */}
      <div className="p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Buscador: w-full sm:w-96 para que sea más largo que antes pero no total */}
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={16}
          />
          <input
            type="text"
            placeholder="BUSCAR MATERIAL..."
            className="w-full bg-slate-50 rounded-2xl pl-11 pr-4 py-3 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500/10 border border-transparent focus:border-slate-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Botón de Confirmar (Manteniendo su posición a la derecha) */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {isSaving ? "PROCESANDO..." : "CONFIRMAR CARGA"}
        </button>
      </div>

      {/* LISTA CON SCROLL */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {materials.length > 0 ? (
          <>
            {obra.length > 0 && (
              <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm px-6 py-2 border-y border-slate-100 flex items-center gap-2 z-10">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                  ● Materiales Obra
                </span>
              </div>
            )}
            {obra.map(renderRow)}

            {varios.length > 0 && (
              <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm px-6 py-2 border-y border-slate-100 flex items-center gap-2 z-10">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
                  ● Materiales Varios
                </span>
              </div>
            )}
            {varios.map(renderRow)}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 opacity-60">
            <AlertCircle size={32} />
            <p className="text-[10px] font-black uppercase italic text-slate-400">
              Sin resultados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialGrid;
