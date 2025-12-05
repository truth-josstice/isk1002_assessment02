// Import QueryClientProvider from Tanstack to pass all queries to children (App) and share query data to all screens
import { QueryClientProvider } from "@tanstack/react-query";

// Import created queryClient file to handle all queries
import { queryClient } from "./src/utilities/constants/queryClient";

// Import AuthProvider file to set logged in users using token received from API, log out users, and intercept all requests with token in header
import { AuthProvider } from "./src/context/AuthContext";

// Import the Content of our App, with customised navigation states
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
