import { useQuery } from "@tanstack/react-query";
import { getGyms } from "../services/apiServices";

export const useAllGyms = () =>
    useQuery({
        queryKey: ["gyms"],
        queryFn: getGyms
    })