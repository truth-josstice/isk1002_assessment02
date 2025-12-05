// src/context/AuthContext.jsx   ← keep the same file path
import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert, DeviceEventEmitter } from "react-native";

const AuthContext = createContext({});

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch (err) {
    return null;
  }
};

const isTokenExpired = (token) => {
  try {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return true;

    const expiryInMs = payload.exp * 1000;
    const now = Date.now();

    return now >= expiryInMs - 5000;
  } catch (error) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to handle invalid or expired tokens across the application
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      Alert.alert(
        "Session Expired",
        "Your login session has expired. Please sign in again to continue.",
        [{ text: "OK" }]
      );
    };

    const subscription = DeviceEventEmitter.addListener("authenticationExpired", handleAuthExpired);

    return () => {
      subscription.remove();
    };
  }, []);

  // Load token on app start
  useEffect(() => {
    const loadToken = async () => {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("jwt");
      if (token) {
        if (isTokenExpired(token)) {
          setUser(null);
        } else {
          const payload = decodeJwt(token);
          if (payload) {
            setUser({ token, username: payload.username, id: parseInt(payload.sub) });
          } else {
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (token) => {
    await SecureStore.setItemAsync("jwt", token);
    const payload = decodeJwt(token);
    setUser({ token, username: payload.username, id: payload.sub });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
