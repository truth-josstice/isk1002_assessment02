import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClimb, getClimbs } from "../services/apiServices";

export const useAllClimbs = () =>
  useQuery({
    queryKey: ["user-climbs"],
    queryFn: getClimbs,
  });

export const useAddClimb = () => {
  const queryClient = useQueryClient();

  useMutation({
    mutationFn: createClimb,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-climbs"] });
    },
  });
};
