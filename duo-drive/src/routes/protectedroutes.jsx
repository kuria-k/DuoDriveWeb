// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("authToken");

  // If not logged in → go to login
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // If role not allowed → go to login
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
