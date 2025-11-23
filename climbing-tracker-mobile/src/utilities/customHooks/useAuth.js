import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser } from "../services/apiServices";

// Create tanstack custom hook for registering a new user
export const useRegisterUser = () =>
  useMutation({
    mutationFn: registerUser,
  });

// Create tanstack custom hook for logging in an existing user
export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-climbs"] });
    },
  });
};
