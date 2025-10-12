import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [amount, setAmount] = useState(0);
  const [packageName, setPackageName] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [role, setRole] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState(null);

  // Load payment data from AuthForm
  useEffect(() => {
    const state = location.state;
    if (
      !state ||
      !state.amount ||
      !state.package ||
      !state.curriculum ||
      !state.user ||
      !state.subjects
    ) {
      alert("Missing payment info. Redirecting to signup.");
      navigate("/auth-form/student");
      return;
    }

    setAmount(state.amount);
    setPackageName(state.package); // match backend field
    setCurriculum(state.curriculum);
    setRole(state.role || "student");
    setSubjects(state.subjects);
    setUser(state.user);
  }, [location.state, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setScreenshot(file);
  };

  const handlePayment = async () => {
    // validate all required fields
    if (!user?._id || !curriculum || !packageName || !amount || !subjects.length || !screenshot) {
      console.error("Missing required fields:", {
        userId: user?._id,
        curriculum,
        packageName,
        amount,
        subjects,
        screenshot,
      });
      alert("All required fields must be provided before submitting payment.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("curriculum", curriculum.toUpperCase());
      formData.append("package", packageName);
      formData.append("grade", user.grade || "N/A");
      formData.append("subject", JSON.stringify(subjects)); // backend expects 'subject'
      formData.append("amount", amount);
      formData.append("referenceName", user.fullName || "N/A");
      formData.append("screenshot", screenshot);

      const res = await fetch("http://localhost:5000/api/payments/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment submission failed");

      alert("✅ Payment uploaded successfully! We'll verify your payment soon.");

      // Redirect to student dashboard with payment info
      navigate("/student/dashboard", {
        state: {
          user,
          role,
          curriculum,
          package: packageName,
          subjects,
          amount,
          paymentId: data.payment?._id,
        },
      });
    } catch (error) {
      console.error("Payment upload error:", error);
      alert("Payment upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-scale-in">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <span className="text-white text-2xl font-bold">₵</span>
            </div>
            <CardTitle className="text-2xl text-gray-900">Payment Summary</CardTitle>
            <CardDescription className="text-gray-600">
              Confirm your details and complete payment
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2 space-y-5">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-gray-800 space-y-1">
              <p><strong>Role:</strong> {role}</p>
              <p><strong>Curriculum:</strong> {curriculum}</p>
              <p><strong>Package:</strong> {packageName}</p>
              <p><strong>Subjects:</strong> {subjects.join(", ")}</p>
              <p className="text-xl font-semibold mt-3">
                Total Amount: <span className="text-green-600 font-bold">₵{amount}</span>
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-gray-800 space-y-2">
              <h3 className="text-lg font-semibold text-green-700">MoMo Payment Instructions</h3>
              <p><strong>Name:</strong> DANIEL MENSAH WILLIAMS</p>
              <p><strong>Number:</strong> 0123456789</p>
              <p><strong>Reference:</strong> {user.fullName || "Your full name"}</p>
              <p className="text-sm text-gray-600 mt-2">
                Please make the payment using the MoMo number above. Then upload a screenshot of your payment below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Upload Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2 bg-white"
              />
              {screenshot && (
                <p className="text-sm text-green-600 mt-1">Screenshot uploaded: {screenshot.name}</p>
              )}
            </div>

            <Button
              className={`w-full h-12 text-white rounded-lg transition-colors ${screenshot ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handlePayment}
              disabled={!screenshot || loading}
            >
              {loading ? "Processing..." : `Submit Payment ₵${amount}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
