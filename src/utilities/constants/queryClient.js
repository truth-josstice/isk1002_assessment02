/* 
Tanstack QueryClient Instance for Application
Purpose: Global query settings for all API calls
Global settings:
- Manage query retries for enhanced UX
- Manage acceptable errors: ignore user error (4xx) codes
- Manage query data stale time: how long before data is considered accurate if no changes have been made
- Manage cache time: how long cached data is kept with no activity
- Manage refetching of data: mobile applications require instant data updates
- Manage mutation errors: logs errors for mutations with correct data for devs
*/

import { QueryClient } from "@tanstack/react-query";

// Configure global Tanstack Query settings for API calls used in custom hooks
export const queryClient = new QueryClient({
  defaultOptions: {
    // Global preferences for all default GET requests
    queries: {
      
      // Only retry genuine network errors (5xx), not user errors (4xx)
      // Note: Error status may be in err.response?.status depending on axios settings
      retry: (failureCount, err) => {
        if (err?.status >= 400 && err?.status < 500) return false; // User errors
        return failureCount < 2; // Retry server errors twice
      },

      // Data caching settings
      staleTime: 5 * 60 * 1000, // Data is fresh for at least five minutes
      cacheTime: 10 * 60 * 1000, //Data is kept in cache for 10 minutes after inactive
      
      // Mobile network enhancements
      refetchOnWindowFocus: true, // Data is minimal, so fetch data on re-focus, instant update is better UX
      refetchOnReconnect: true, // Re-fetching on reconnect ensures any new information is automatically available on reconnection to mobile network
    },
    // Global preferences for all mutations (POST, PUT, PATCH, DELETE)
    mutations: {
      retry: false, // Mutations are not retried to prevent duplicate submissions
      onError: (err) => {
        console.error("Mutation failed: ", err.response?.data || err.message);
      },
    },
  },
});
