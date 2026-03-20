import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
const backendUrl = "https://lovegifbackend.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from session storage)
    const loggedInUser = sessionStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al autenticar');
      }

      // Asegurar que sea compatible con el componente Cart que espera username y displayName
      const userData = {
        usuarioId: data.usuarioId,
        username: data.username,
        displayName: data.displayName || data.nombre,
        nombre: data.nombre,
        apellido: data.apellido,
      };

      setUser(userData);
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error(error.message || 'Usuario o contraseña incorrectos');
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
