// src/context/AuthContext.jsx   ← keep the same file path
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext({});

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch (err) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load token on app start
  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        const payload = decodeJwt(token);
        if (payload) {
          setUser({ token, username: payload.username });
        }
      }
    };
    loadToken();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync("jwt", token);
    const payload = decodeJwt(token);
    setUser({ token, username: payload.username });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
