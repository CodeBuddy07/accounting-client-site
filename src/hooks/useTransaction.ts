import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";


// Add Transaction
export const useAddTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (transaction: Transaction) => {
            const { data } = await axiosSecure.post("/api/transactions", transaction);
            return data;
        },
        onSuccess: () => {
            toast.success("Transaction Completed!");
            // Invalidate customer data to reflect updated dues/receivables
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: () => {
            toast.error("Failed transaction.");
        },
    });
};

export const useTransactions = ({
    page = 1,
    limit = 10,
    search = "",
    type = "all",
    date = new Date(),
}) => {
    return useQuery({
        queryKey: ["transactions", page, limit, search, type, date],
        queryFn: async () => {
            const { data } = await axiosSecure.get("/api/transactions", {
                params: { page, limit, search, type, date },
            });
            return data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 2,
    });
};

