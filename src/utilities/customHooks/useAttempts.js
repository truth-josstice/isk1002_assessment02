/*
Attempts Custom Hooks
Purpose: Create and Read functions for Attempts
Features:
- Invalidates user-attempts query to refetch data for immediate UI updates when mutations succeed
- All API errors are handled by Axios API error wrapper
Note: could be enhanced with optimistic updates for instant UI feedback at a later stage of development
*/

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAttempt, getAttempts } from "../services/apiServices";

/* 
Hook for fetching all attempts for the current user
@returns {UseQueryResult} Tanstack Query result with attempts data

Features:
- Caches data globally for cross-component access
- Handles loading and error states automatically
*/
export const useAllAttempts = () =>
  useQuery({
    queryKey: ["user-attempts"], // Named query is accessible to all parents and child components
    queryFn: getAttempts, // Axios function to manage request/response
  });

/* 
Hook for creating new attempts with automatic cache invalidation
@returns {UseMutationResult} Tanstack Query mutation

Usage:
1. User submits attempt -> mutation runs (loading state shown)
2. Wait for server response
3. On success -> invalidate attempts cache
4. UI re-fetches from server and updates
5. Error handling managed by createAttempt function
*/
export const useAddAttempt = () => {
  const queryClient = useQueryClient();

  // Explicitly return the mutation function
  return useMutation({
    mutationFn: createAttempt, // Axios function to manage request/response
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-attempts"] }); // If API call is successful, re-fetch user-attempts data
    },
  });
};
