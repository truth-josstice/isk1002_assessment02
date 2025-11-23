import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/utilities/constants/queryClient";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

import LoginScreen from "./src/pages/login/Login";
import HomeScreen from "./src/pages/home/Home";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  console.log("AuthGate render — user:", user);
  return user ? <HomeScreen /> : <LoginScreen />;
}
