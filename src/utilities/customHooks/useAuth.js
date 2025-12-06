/*
Authorisation Custom Hooks
Purpose: Tanstack Query wrappers for login/registration API calls
Features:
- Hooks handle data communication to API only
- Components manage success/error handling and navigation
- All API errors are handled by Axios API error wrapper
*/

import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../services/apiServices";

/* 
Hook for registering a new user
@returns {UseMutationResult} Tanstack Query mutation for registration

This hook only handles the data passed to Axios. The success/error handling occurs in the RegisterScreen component.

Example component usage:
const mutation = useRegisterUser();
mutation.mutate(userData, {
  onSuccess: (response) => handleRegistrationSuccess(response),
  onError: (error) => showRegistrationError(error)
});
*/
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser, // Axios register mutation
  });
};

/*
Hook for logging in an existing user
@returns {UseMutationResult} Tanstack Query mutation for login

This hook handles the data passed to Axios. The success/error handling occurs in the LoginScreen component.
Example component usage:
const mutation = useLoginUser();

mutation.mutate(userData, {
  onSuccess: (response) => handleLoginSuccess(response),
  onError: (error) => showLoginError(error)
});
*/
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
