import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "./LoadingState";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" text="Memverifikasi autentikasi..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simpan return url agar bisa diarahkan kembali setelah login sukses
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  return children;
}

export default ProtectedRoute;
