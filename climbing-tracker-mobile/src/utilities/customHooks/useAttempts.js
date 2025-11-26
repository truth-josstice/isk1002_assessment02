import { useQuery } from "@tanstack/react-query";

export const useAllAttempts = () => 
    useQuery({
        queryKey: ["user-attempts"],
        queryFn:
    })