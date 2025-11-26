import { useQuery } from "@tanstack/react-query";
import { getAttempts } from "../services/apiServices";

export const useAllAttempts = () => 
    useQuery({
        queryKey: ["user-attempts"],
        queryFn: getAttempts
    })