import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "@/lib/axiosSecure";
import { toast } from "sonner";


// Fetch all templates (with pagination/search)
export const useTemplates = () => {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/templates");
      return data;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 2, // 2 mins cache
  });
};



// Update existing template
export const useEditTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { name: string; content: string };
    }) => {
      const { data } = await axiosSecure.put(`/api/templates/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      toast.success("Template updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: () => {
      toast.error("Failed to update template");
    },
  });
};

