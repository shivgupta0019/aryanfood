// import { Navigate, Outlet } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// export default function AdminRoute() {
//   const token = localStorage.getItem("token");

//   if (!token) return <Navigate to="/" replace />;

//   try {
//     const decoded = jwtDecode(token);

//     if (decoded.exp * 1000 < Date.now()) {
//       localStorage.removeItem("token");
//       return <Navigate to="/" replace />;
//     }

//     if (decoded.role !== "admin") {
//       return <Navigate to="/dashboard" replace />;
//     }

//     return <Outlet />; // 🔥 IMPORTANT
//   } catch {
//     localStorage.removeItem("token");
//     return <Navigate to="/" replace />;
//   }
// }



import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" />; // ya /centrallab
    }

    return <Outlet />;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/" />;
  }
}