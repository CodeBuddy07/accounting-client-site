import MainLayout from "@/Dashboard/MainLayout";
import Home from "@/Dashboard/Pages/Home";
import Login from "@/Dashboard/Pages/Login";
import ManageCustomers from "@/Dashboard/Pages/ManageCustomer";
import ProductManagement from "@/Dashboard/Pages/ProductManagement";
import ResetPassword from "@/Dashboard/Pages/ResetPassword";
import Settings from "@/Dashboard/Pages/Settings";
import ProtectedRoute from "@/lib/ProtectedRoutes";
import {createBrowserRouter } from "react-router-dom";

const Routes = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
      children: [
        {
          index: true,
          element: <ProtectedRoute><Home/></ProtectedRoute>
        },
        {
          path: "settings",
          element: <Settings/>
        },
        {
          path: "customers",
          element: <ManageCustomers/>
        },
        {
          path: "products",
          element: <ProductManagement/>
        },
        
      ]
    },
    {
      path: "log-in",
      element: <Login/>
    },
    {
      path: "reset-password/:resetToken",
      element: <ResetPassword/>
    },
  ]);

export default Routes;

