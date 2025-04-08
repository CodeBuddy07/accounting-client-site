import axiosSecure from "@/lib/axiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


export const useLoginAdmin = () => {
  const { refetch: refetchAuth } = useAuth(); 

  return useMutation<Response, Error, LoginRequest>({
    

    mutationFn: async (credentials: LoginRequest) => {
      const { data } = await axiosSecure.post("/api/admin/login", credentials);
      return data;
    },
      onSuccess: () => {
        // // Store the token in localStorage or cookies
        // localStorage.setItem("token", data.token);

        refetchAuth();

      },
  });
};

// Change Password
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (passwords) => {
      await axiosSecure.post("/api/admin/change-password", passwords);
    },
    onSuccess: () => {
      // Invalidate any relevant queries (e.g., admin profile)
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
};

// Forgot Password
export const useForgotPassword = () => {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: async (email) => {
      const { data } = await axiosSecure.post("/api/admin/forgot-password", email);
      return data;
    },
  });
};

// Reset Password
export const useResetPassword = () => {
  return useMutation<void, Error, PasswordResetRequest>({
    mutationFn: async (resetData:PasswordResetRequest) => {
      const { data } = await axiosSecure.post("/api/admin/reset-password", resetData);
      return data;
    },
  });
};

// Log-out admin
export const useLogOut = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosSecure.post("/api/admin/logout"); // Use POST for logout
      return data;
    },
    onSuccess: () => {
      // Clear client-side authentication state
      toast.success("Logged out successfully!"); // Show a success message
      navigate("/log-in"); // Redirect to the login page
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "An error occurred during logout.");
    },
  });
};

// Auth admin
export const useAuth = () => {
  return useQuery({
    queryKey: ["admin"], // Unique key for this query
    queryFn: async () => {
      const { data } = await axiosSecure.get("/api/admin/auth");
      return data;
    },
    retry: false, // Disable retries for authentication checks
    staleTime: 1000 * 60 * 5, // Cache the result for 5 minutes
  });
};