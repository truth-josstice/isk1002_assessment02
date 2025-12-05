/* 
Gyms Custom Hook
Purpose: Read function for gyms to be used in AddClimb function
All API errors handled by Axios API error wrapper
*/

import { useQuery } from "@tanstack/react-query";
import { getGyms } from "../services/apiServices";

/* 
Hook for fetching all gyms currently listed in the application
@returns {UseQueryResult} Tanstack Query result with gym data

Features: 
- Caches data globally for cross component access
*/
export const useAllGyms = () =>
    useQuery({
        queryKey: ["gyms"],
        queryFn: getGyms
    })