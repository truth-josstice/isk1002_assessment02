import { QueryClient } from "@tanstack/react-query";

// Configure global Tanstack Query settings for API calls used in custom hooks
export const queryClient = new QueryClient({
  defaultOptions: {
    // Global preferences for all default GET requests
    queries: {
      retry: (failureCount, err) => {
        // Only retry genuine network errors - not 4xx (generally user faults)
        if (err?.status >= 400 && err?.status < 500) return false;
        // Retry up to two times for real network errors
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // Data is fresh for at least five minutes
      cacheTime: 30 * 60 * 1000, //Data is kept in cache for 30 minutes after inactive
      refetchOnWindowFocus: true, // Data is minimal, so fetch data on re-focus, instant update is better UX
      // Mobile devices go in and out of service areas, re-fetching on reconnect ensures any new information is automatically available on reconnection to mobile network
      refetchOnReconnect: true, 
    },
    // Global preferences for all mutations (POST, PUT, PATCH, DELETE)
    mutations: {
      retry: false,
      onError: (err) => {
        console.error("Mutation failed: ", err.response?.data || err.message);
      },
    },
  },
});
