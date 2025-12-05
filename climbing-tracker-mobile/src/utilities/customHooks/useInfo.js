import { useQuery } from "@tanstack/react-query";
import { getSkills, getStyles } from "../services/apiServices";

export const useAllSkills = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

export const useAllStyles = () =>
  useQuery({
    queryKey: ["styles"],
    queryFn: getStyles,
  });
