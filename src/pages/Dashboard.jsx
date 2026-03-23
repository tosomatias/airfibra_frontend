import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  LogOut, 
  MapPin,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * DASHBOARD COMPONENT
 * Main administrative interface for managing employee profiles.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  
  /**
   * STATE MANAGEMENT
   * Mock data for the "Province" employees.
   * In the next step, we will replace this with a Prisma/Axios fetch.
   */
  const [employees, setEmployees] = useState([
    { id: 1, name: "Admin User", position: "System Administrator", province: "Buenos Aires" },
    { id: 2, name: "Carlos Rodriguez", position: "Field Technician", province: "Buenos Aires" },
    { id: 3, name: "Lucía Fernández", position: "Network Specialist", province: "Buenos Aires" },
  ]);

  /**
   * AUTHENTICATION LOGIC
   * Handles session termination.
   */
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* SIDEBAR: Navigation and Branding */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              A
            </div>
            AirFibra <span className="text-blue-400 font-light">Admin</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 bg-blue-600/10 text-blue-400 w-full p-3 rounded-xl text-sm font-semibold border border-blue-600/20">
            <Users size={18} />
            Employee Management
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium w-full p-3 rounded-lg"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT: Data Table and Header */}
      <main className="flex-1 p-8">
        
        {/* HEADER SECTION */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Employee Directory</h2>
            <p className="text-slate-500 mt-1">Province administrative module for profile management.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
            <UserPlus size={18} />
            Add New Employee
          </button>
        </header>

        {/* DATA CONTAINER: Filters and Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* SEARCH BAR SUB-HEADER */}
          <div className="p-5 border-b border-slate-100 bg-white flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, position or DNI..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* TABLE STRUCTURE */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4 font-bold">Employee Profile</th>
                <th className="px-6 py-4 font-bold text-center">Current Province</th>
                <th className="px-6 py-4 font-bold text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{emp.name}</span>
                      <span className="text-xs text-slate-500 uppercase tracking-tight font-medium">
                        {emp.position}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600 bg-slate-100 w-fit mx-auto px-3 py-1 rounded-full border border-slate-200">
                      <MapPin size={12} className="text-blue-500" />
                      {emp.province}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Profile">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete Profile">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TABLE FOOTER / PAGINATION MOCK */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Showing {employees.length} employees registered in the system.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;