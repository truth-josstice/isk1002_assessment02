/* 
Info Custom Hooks
Purpose: Read functions for Info used in Register, AddClimb functions

All API errors are handled by Axios API error wrapper
*/

import { useQuery } from "@tanstack/react-query";
import { getSkills, getStyles } from "../services/apiServices";

/*
Hook to fetch all current skill levels from the backend API
@returns {UseQueryResult} with skill level data

Usage:
- User registering their account can choose from pre-determined skill levels
*/ 
export const useAllSkills = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

/* 
Hook to fetch all current boulder problem styles from the backend API
@returns {UseQueryResult} with style data

Usage:
- When adding a climb, users can choose from pre-determined style list
*/ 
export const useAllStyles = () =>
  useQuery({
    queryKey: ["styles"],
    queryFn: getStyles,
  });
