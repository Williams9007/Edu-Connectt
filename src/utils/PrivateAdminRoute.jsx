import { Navigate } from "react-router-dom";
import{ jwtDecode }from "jwt-decode";

export const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const role = localStorage.getItem("role");

  // 🚫 No token or wrong role → redirect
  if (!token || role?.toLowerCase() !== "admin") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    return <Navigate to="/admin-login" replace />;
  }

  try {
    // ✅ Decode token and check expiration
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds

    if (decoded.exp && decoded.exp < currentTime) {
      // Token expired
      localStorage.removeItem("adminToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      return <Navigate to="/admin-login" replace />;
    }

    // ✅ Token valid → allow access
    return children;
  } catch (error) {
    console.error("❌ Invalid admin token:", error);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    return <Navigate to="/admin-login" replace />;
  }
};
