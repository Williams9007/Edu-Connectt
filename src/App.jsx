import { Routes, Route } from "react-router-dom";
import axios from "axios";

// Pages
import LandingPage from "./components/landing-page.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterCoursePage from "./components/RegisterCoursePage.jsx";
import {StudentDashboard} from "./components/student-dashboard.jsx";
import {AuthForm} from "./components/auth-form-updated.jsx";
import  PaymentPage  from "./components/payment-flow.jsx";

function App() {
  // ✅ Signup handler with proper error handling
  const handleSignup = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      return res.data;
    } catch (err) {
      console.error("❌ Backend signup error:", err.response?.data || err.message);
      throw err.response ? new Error(err.response.data.message) : err;
    }
  };

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Register course page with dynamic role */}
      <Route path="/register-course/:role" element={<RegisterCoursePage />} />

      {/* AuthForm for signup only */}
      <Route
        path="/auth-form/:role"
        element={<AuthForm onSignup={handleSignup} />}
      />
      {/* Payment page */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* Student dashboard */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      {/* Catch-all route */}
      <Route
        path="*"
        element={
          <div className="text-center mt-20 text-xl">Page Not Found</div>
        }
      />
    </Routes>
  );
}

export default App;
