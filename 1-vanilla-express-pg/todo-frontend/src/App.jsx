import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthProvider, { useAuth } from './contexts/AuthContext.jsx';
import TodoProvider from './contexts/TodoContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoutes from './components/ProtectedRoute.jsx';
import Loader from './components/Loader.jsx';

function AppContent() {
  const { loading } = useAuth();

  return loading ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </AuthProvider>
  );
}

export default App;
