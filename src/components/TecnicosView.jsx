import { UserPlus, Search, Edit3, Trash2, MapPin } from 'lucide-react';

const TecnicosView = () => (
  <section className="animate-in fade-in duration-500">
    <header className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Directorio de Técnicos</h2>
        <p className="text-slate-500 mt-1">Gestión de personal de AirFibra por provincia.</p>
      </div>
      <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
        <UserPlus size={18} />
        Agregar Técnico
      </button>
    </header>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar técnico..." className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all" />
        </div>
      </div>
      {/* ... Aquí va el <table> que ya tenías ... */}
    </div>
  </section>
);

export default TecnicosView;