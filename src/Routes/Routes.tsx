import MainLayout from "@/Dashboard/MainLayout";
import ErrorPage from "@/Dashboard/Pages/ErrorPage";
import Home from "@/Dashboard/Pages/Home";
import Login from "@/Dashboard/Pages/Login";
import ManageCustomers from "@/Dashboard/Pages/ManageCustomer";
import ProductManagement from "@/Dashboard/Pages/ProductManagement";
import ResetPassword from "@/Dashboard/Pages/ResetPassword";
import ResetPasswordPage from "@/Dashboard/Pages/Settings";
import Settings from "@/Dashboard/Pages/Settings";
import TransactionsPage from "@/Dashboard/Pages/Transaction";
import ProtectedRoute from "@/lib/ProtectedRoutes";
import {createBrowserRouter } from "react-router-dom";

const Routes = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><MainLayout/></ProtectedRoute>,
      errorElement: <ErrorPage/>,
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
        {
          path: "transactions/:type",
          element: <TransactionsPage/>
        },
        {
          path: "settings/general",
          element: <ResetPasswordPage/>
        },
      ]
    },
    {
      path: "log-in",
      element: <Login/>,
      errorElement: <ErrorPage/>,
    },
    {
      path: "reset-password/:resetToken",
      element: <ResetPassword/>,
      errorElement: <ErrorPage/>,
    },
  ]);

export default Routes;

