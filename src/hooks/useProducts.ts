import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";

// Type
type ProductQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export const useProducts = ({ page = 1, limit = 10, search = "" }: ProductQueryParams) => {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/products", {
        params: { page, limit, search },
      });
      return data;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2, // 2 mins
  });
};

export const useAddProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (product: {
        name: string;
        buyingPrice: number;
        sellingPrice: number;
        note?: string;
      }) => {
        const { data } = await axiosSecure.post("/api/products", product);
        return data;
      },
      onSuccess: () => {
        toast.success("Product added successfully!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: () => {
        toast.error("Failed to add product.");
      },
    });
  };

  
  export const useEditProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
        const { data } = await axiosSecure.put(`/api/products/${id}`, updates);
        return data;
      },
      onSuccess: () => {
        toast.success("Product updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: () => {
        toast.error("Failed to update product.");
      },
    });
  };

  export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: string) => {
        await axiosSecure.delete(`/api/products/${id}`);
      },
      onSuccess: () => {
        toast.success("Product deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
      onError: () => {
        toast.error("Failed to delete product.");
      },
    });
  };
  