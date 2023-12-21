import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserIdStore } from "../../store/userStorge";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}: ProtectedRouteProps) => {
  const user = useUserIdStore((state) => state.userProfile);
  if (!user?._id) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
