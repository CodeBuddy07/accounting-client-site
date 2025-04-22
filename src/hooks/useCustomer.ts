import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";



// Get Customers with Pagination + Search
export const useCustomers = ({ page = 1, limit = 10, search = "" }: CustomerQueryParams) => {
  return useQuery({
    queryKey: ["customers", page, limit, search],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/customers", {
        params: { page, limit, search },
      });
      return data;
    },
    placeholderData: (prevData) => prevData,
    staleTime: 1000 * 60 * 2, // cache for 2 min
  });
};

// Add Customer
export const useAddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: CustomerPayload) => {
      const { data } = await axiosSecure.post("/api/customers", customer);
      return data;
    },
    onSuccess: () => {
      toast.success("Customer added successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Failed to add customer.");
    },
  });
};

// Edit Customer
export const useEditCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CustomerPayload> }) => {
      const { data } = await axiosSecure.put(`/api/customers/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Customer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Failed to update customer.");
    },
  });
};

// Edit Customer
export const useSMSCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      const { data } = await axiosSecure.post(`/api/customers/${id}`, {message});
      return data;
    },
    onSuccess: (data) => {
      toast.success( data.message || "SMS sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Failed to update customer.");
    },
  });
};

// Delete Customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.delete(`/api/customers/${id}`);
    },
    onSuccess: () => {
      toast.success("Customer deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Failed to delete customer.");
    },
  });
};




export const useCustomerReport = ({ page= 1, limit = 10, id }: CustomerReportQueryParams = {}) => {

  return useQuery<CustomerReport>({
    queryKey: ['customerReport', id, page, limit],
    queryFn: async () => {
      const { data } = await axiosSecure.get<CustomerReport>(
        `/api/customers/${id}/report`,
        {
          params: { page, limit },
        }
      );
      return data;
    },
    placeholderData: (prev) => prev, // Keep previous data while refreshing
    staleTime: 1000 * 60 * 2, // 2 minutes stale time (same as products)
    enabled: !!id, // Only enable query when customerId exists
    retry: 2, // Retry failed requests twice
  });
};