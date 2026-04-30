import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    // ✅ Token exists, route is protected
    setIsValid(true);
  }, []);

  if (isValid === null) return null; // Loading state

  if (isValid === false) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
