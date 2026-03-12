import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const USERS = {
  LPINA: {
    username: "LPINA",
    password: "Luis2610",
    displayName: "LPINA"
  },
  FLORY: {
    username: "FLORY",
    password: "1234",
    displayName: "FLORY"
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in (from session storage)
    const loggedInUser = sessionStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (username, password) => {
    const userData = USERS[username.toUpperCase()];
    
    if (!userData || userData.password !== password) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
