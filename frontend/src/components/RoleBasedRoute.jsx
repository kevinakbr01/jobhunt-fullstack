import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "./LoadingState";

export function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" text="Memeriksa hak akses..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Arahkan ke halaman utama yang sesuai dengan role pengguna
    const fallback = user?.role === "recruiter" ? "/dashboard" : "/jobs";
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export default RoleBasedRoute;
