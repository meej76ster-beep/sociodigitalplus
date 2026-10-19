import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Por defecto iniciamos como usuario final (buyer), pero con selector rápido para cambiar a Admin
  const [user, setUser] = useState({
    id: 'usr-123',
    name: 'Sofia Mendoza',
    email: 'sofia@ejemplo.com',
    role: 'buyer', // 'buyer' | 'admin'
  });

  const toggleRole = () => {
    setUser(prev => ({
      ...prev,
      role: prev.role === 'buyer' ? 'admin' : 'buyer'
    }));
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, setUser, toggleRole, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
