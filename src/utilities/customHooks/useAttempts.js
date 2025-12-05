import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAttempt, getAttempts } from "../services/apiServices";

export const useAllAttempts = () =>
  useQuery({
    queryKey: ["user-attempts"],
    queryFn: getAttempts,
  });

export const useAddAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-attempts"] });
    },
  });
};
