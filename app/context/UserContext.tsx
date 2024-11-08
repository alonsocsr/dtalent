"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/lib/types';

interface UserContextType {
  user: User | null;
  token: string | null;
  isTokenLoaded: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setIsTokenLoaded: (isLoaded: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState<boolean>(false);  // Estado de carga del token

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedToken) {
      setToken(storedToken);
    }

    setIsTokenLoaded(true);  // Cambiamos el estado a "loaded" una vez que el token esté recuperado
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, isTokenLoaded, setIsTokenLoaded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
