import { Routes, Route } from "react-router-dom";
import axios from "axios";

// ✅ Import your pages
import LandingPage from "./components/landing-page.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterCoursePage from "./components/RegisterCoursePage.jsx";
import { StudentDashboard } from "./components/student-dashboard.jsx";
import { AuthForm } from "./components/auth-form-updated.jsx";
import PaymentPage from "./components/payment-flow.jsx";
import { AccountSettings } from "./components/AccountSettings.jsx";
import ForgetPasswordPage from "./components/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./components/ResetPasswordPage.jsx";
import ErrorBoundary from "./components/error-boundary.jsx"; // 
import {AdminDashboard} from "./components/admin-dashboard.jsx";
import {AdminAccess} from "./components/admin-access.jsx";


function App() {
  const handleSignup = async (data) => {
    try {
    const res = await axios.post("http://localhost:5000/api/auth/register", data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      return res.data;
    } catch (err) {
      console.error("❌ Backend signup error:", err.response?.data || err.message);
      throw err.response ? new Error(err.response.data.message) : err;
    }
  };

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/access" element={<AdminAccess />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-course/:role" element={<RegisterCoursePage />} />
        <Route path="/auth-form/:role" element={<AuthForm onSignup={handleSignup} />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<div className="text-center mt-20 text-xl">Page Not Found</div>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
