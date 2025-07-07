import { Navigate } from "react-router";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
