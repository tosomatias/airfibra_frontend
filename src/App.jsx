import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/**
 * PAGE IMPORTS
 * Ensure these components exist in your /pages directory.
 */
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/**
 * AUTHENTICATION UTILITY (Internal Logic)
 * Verifies if a valid session exists in the browser's storage.
 * @returns {boolean} True if the administrative token is present.
 */
const checkAuthStatus = () => {
  // We look for a JSON Web Token (JWT) in local storage
  const adminToken = localStorage.getItem('admin_token');
  return !!adminToken; // Logical NOT operator to convert string/null to boolean
};

/**
 * PROTECTED ROUTE COMPONENT (HOC Pattern)
 * Wraps private views to prevent unauthorized access.
 * If no token is found, it forces a redirect to the Login page.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthorized = checkAuthStatus();

  if (!isAuthorized) {
    // We use 'replace' to overwrite the history entry so the user
    // can't navigate back to a protected area without logging in.
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * MAIN APPLICATION COMPONENT
 * Handles routing logic and global layout styles.
 */
function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      <Routes>
        {/* PUBLIC ROUTE: The entry point for Administrators */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTE: Employee Management System (Province Module) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* DEFAULT NAVIGATION: Redirects root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* CATCH-ALL ROUTE: Handles 404 - Not Found errors */}
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-sm uppercase tracking-widest mt-2">Resource Not Found</p>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;