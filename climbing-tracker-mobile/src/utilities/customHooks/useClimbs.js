import { useQuery } from "@tanstack/react-query";
import { getClimbs } from "../services/apiServices";

// Create a Tanstack query custom hook to get all climbs
export const useAllClimbs = () =>
    useQuery({
        queryKey: ["user-climbs"],
        queryFn: getClimbs,
    });