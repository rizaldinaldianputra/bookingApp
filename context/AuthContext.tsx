import { User } from '@/models/user';
import { getToken, removeToken, removeUser, saveToken, saveUser } from '@/session/session';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isFirstInstall: boolean;

  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isFirstInstall, setLoading] = useState(true);

  // cek session pas pertama kali app dibuka
  useEffect(() => {
    const loadSession = async () => {
      const savedToken = await getToken();
      if (savedToken) setToken(savedToken);
      setLoading(false);
    };
    loadSession();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    await saveToken(newToken);
    await saveUser(newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    await removeToken();
    await removeUser();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isFirstInstall, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
