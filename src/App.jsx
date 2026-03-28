import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// IMPORTS
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import AllTech from './pages/tech/AllTech';
import TechId from './pages/tech/TechId';

const checkAuthStatus = () => {
  const token = localStorage.getItem('admin_token');
  return !!token; 
};

const ProtectedRoute = ({ children }) => {
  // Si no hay token, mandamos a login
  if (!checkAuthStatus()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AuthLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="min-h-screen bg-slate-50 pt-16"> {/* Añadí pt-16 para que el Navbar no tape el contenido */}
      {children}
    </main>
  </>
);

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Routes>
        {/* RUTA PÚBLICA: No debe estar protegida */}
        <Route path="/login" element={<Login />} />

        {/* REDIRECCIÓN RAÍZ: Si entra a "/", va a "/home" y el ProtectedRoute decidirá si lo manda a Login */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* RUTAS PROTEGIDAS */}
        <Route path="/home" element={
          <ProtectedRoute>
            <AuthLayout><Home /></AuthLayout>
          </ProtectedRoute>
        } />
          <Route path="allTech" element={
          <ProtectedRoute>
            <AuthLayout><AllTech/></AuthLayout>
          </ProtectedRoute>
        } />
          <Route path="techId/:id" element={
          <ProtectedRoute>
            <AuthLayout><TechId/></AuthLayout>
          </ProtectedRoute>
        } />
        
        
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AuthLayout><Dashboard /></AuthLayout>
          </ProtectedRoute>
        } />


        {/* 404 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
}

export default App;