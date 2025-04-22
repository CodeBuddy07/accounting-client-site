import axiosSecure from "@/lib/axiosSecure";
import { useQuery } from "@tanstack/react-query";


export const useDashboard = () => {
    return useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const { data } = await axiosSecure.get("/api/statistics/dashboard");
            return data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 2, // 2 mins cache
    });
};

