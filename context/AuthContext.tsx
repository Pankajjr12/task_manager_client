"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  setToken,
  removeToken,
  getUserId,
  setUserId,
  removeUserId,
} from "../lib/auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getToken());
    setUserIdState(getUserId());
  }, []);

  const login = (token: string, userId: string) => {
    setToken(token);
    setUserId(userId);
    setTokenState(token);
    setUserIdState(userId);
  };

  const logout = () => {
    removeToken();
    removeUserId();
    setTokenState(null);
    setUserIdState(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
