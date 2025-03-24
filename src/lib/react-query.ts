import { QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      // cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Disable refetch on window focus
    },
  },
});