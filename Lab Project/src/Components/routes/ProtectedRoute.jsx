// import { Navigate, Outlet } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

// export default function ProtectedRoute() {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   try {
//     const decoded = jwtDecode(token);

//     if (decoded.exp * 1000 < Date.now()) {
//       localStorage.removeItem("token");
//       return <Navigate to="/" replace />;
//     }

//     return <Outlet />; // 🔥 IMPORTANT
//   } catch {
//     localStorage.removeItem("token");
//     return <Navigate to="/" replace />;
//   }
// }





import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}