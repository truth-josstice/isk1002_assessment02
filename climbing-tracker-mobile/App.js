import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/utilities/constants/queryClient";
import { AuthProvider } from "./src/context/AuthContext";
import AppContent from "./src/components/AppContent";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}


