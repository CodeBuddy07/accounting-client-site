import axios from "axios";
import { toast } from "sonner";




// Create an Axios instance with a base URL and credentials
const axiosSecure = axios.create({
  //baseURL: 'http://localhost:3000',
  baseURL: 'https://accounting-server-site.vercel.app', // Base URL from environment variables
  //baseURL: 'https://hserver.alphatv.xyz',
  withCredentials: true, // Include credentials (cookies) in requests
});


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

        window.location.href = "/log-in"; // Redirect to login page
      } catch (logoutError) {
        console.error("Logout error:", logoutError);
      }
    }

    // Reject the original error
    return Promise.reject(error);
  }
);

export default axiosSecure;