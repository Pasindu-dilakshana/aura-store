import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aura_token');
    if (token) {
      auth.me()
        .then(setUser)
        .catch(() => localStorage.removeItem('aura_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token, user } = await auth.login({ email, password });
    localStorage.setItem('aura_token', token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const { token, user } = await auth.register({ name, email, password });
    localStorage.setItem('aura_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('aura_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
