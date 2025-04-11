import LoadingScreen from "@/Dashboard/Components/LoadingScreen";
import { useAuth } from "@/hooks/useAdmin";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({children}:{children: ReactNode}) => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen message="Hold On ! Authenticating You..." />;

  console.log("nnb",user);

  if (!user) return <Navigate to="/log-in" replace />;

  return children;
};

export default ProtectedRoute;
