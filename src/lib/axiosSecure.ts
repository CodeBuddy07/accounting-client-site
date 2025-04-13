import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




// Create an Axios instance with a base URL and credentials
const axiosSecure = axios.create({
  //baseURL: 'http://localhost:3000',
  baseURL: 'https://accounting-server-site.vercel.app', // Base URL from environment variables
  withCredentials: true, // Include credentials (cookies) in requests
});

// Add a request interceptor to include the token (optional)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Add a response interceptor to handle unauthorized errors
axiosSecure.interceptors.response.use(
  (response) => response, // Return the response if everything is fine
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      try {
        // Call the logout endpoint
        await axiosSecure.post("/api/admin/logout");

        // Show a toast notification
        toast.error("Session expired. Please log in again.");

        // Redirect to the login page
        const navigate = useNavigate();
        navigate("/log-in");
      } catch (logoutError) {
        console.error("Logout error:", logoutError);
      }
    }

    // Reject the original error
    return Promise.reject(error);
  }
);

export default axiosSecure;