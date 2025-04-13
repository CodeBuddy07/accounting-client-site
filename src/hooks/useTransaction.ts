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
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
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
    dateFrom,
    dateTo,
}: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
}) => {
    return useQuery({
        queryKey: ["transactions", page, limit, search, type, dateFrom, dateTo],
        queryFn: async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: Record<string, any> = {
                page,
                limit,
                search,
            };

            // Only add type if it's not "all"
            if (type && type !== "all") {
                params.type = type;
            }

            // Add date params if they exist
            if (dateFrom) {
                params.dateFrom = dateFrom.toISOString();
            }
            if (dateTo) {
                params.dateTo = dateTo.toISOString();
            }

            const { data } = await axiosSecure.get("/api/transactions", {
                params,
            });
            return data;
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 2, // 2 minutes stale time
    });
};

