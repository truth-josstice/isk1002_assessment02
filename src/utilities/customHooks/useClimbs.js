/* 
Climbs Custom Hooks
Purpose: Create and Read functions for Climbs
Features: 
- Invalidates user-climbs query to refetch data for immediate UI updates when mutations succeed
- All API errors are handled by Axios API error wrapper
Note: could be enhanced with optimistic updates for instant UI feedback at a later stage of development
*/
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClimb, getClimbs } from "../services/apiServices";

/*
Hook for fetching all climbs currently added to the application
@returns {UseQueryResult} Tanstack Query result with attempts data

Features:
- Caches data globally for cross-component access
- Handles loading and error states automatically
*/
export const useAllClimbs = () =>
  useQuery({
    queryKey: ["user-climbs"],
    queryFn: getClimbs,
  });

/*
Hook for creating new climbs with automatic cache invalidation
@returns {UseMutationResult} Tanstack Query mutation

Usage:
1. User submits climb -> mutation runs (loading state shown)
2. Wait for server response
3. On success -> invalidate climbs cache
4. UI re-fetches from server and updates
5. Error handling managed by createClimb function
*/
export const useAddClimb = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClimb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-climbs"] });
    },
  });
};
