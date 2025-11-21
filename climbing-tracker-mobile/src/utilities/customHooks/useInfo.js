import { useQuery } from "@tanstack/react-query";
import { getSkills, getStyles } from "../services/apiServices";

// Create a Tanstack query custom hook to get all skill levels
export const useSkills = () =>
    useQuery({
        queryKey: ["skill-levels"],
        queryFn: getSkills,
    });

// Create a Tanstack query custom hook to get all climb styles
export const useStyles = () =>
    useQuery({
        queryKey: ["climb-styles"],
        queryFn: getStyles,
    });