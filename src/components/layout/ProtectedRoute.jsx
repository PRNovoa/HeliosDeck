import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { ROUTES } from "@/app/routes.js";

/** Redirects to /login when there is no active session. */
export function ProtectedRoute() {
  const { accessToken } = useAuth();
  if (!accessToken) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
}
