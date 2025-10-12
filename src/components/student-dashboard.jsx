import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Menu, MenuItem, MenuButton } from "@headlessui/react";
import { BookOpen, User, Calendar, CreditCard, Bell } from "lucide-react";
import { apiClient } from "../utils/api";
import { formatCurrency } from "./ui/formatCurrency";

export function StudentDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [studentInfo, setStudentInfo] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Fetch Student Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?._id || localStorage.getItem("userId");
        if (!userId) throw new Error("No user ID found");

        const response = await apiClient.get(`http://localhost:5000/api/student/${userId}`);
        const studentData = response.data;

        setStudentInfo({
          fullName: studentData.fullName,
          curriculum: studentData.curriculum,
          grade: studentData.grade,
          subjects: studentData.subjects || [],
          createdAt: studentData.createdAt,
        });

        setSubjects(studentData.subjectsDetails || []); 
        setAssignments(studentData.assignments || []);
        setPayments(studentData.payments || []);
      } catch (err) {
        console.error("Failed to load student data", err);
        alert("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // 🔹 Assignment Submission
  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionText && !fileUpload) {
      alert("Please type or upload a file to submit.");
      return;
    }

    setSubmittingAssignment(assignmentId);
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      if (submissionText) formData.append("text", submissionText);
      if (fileUpload) formData.append("file", fileUpload);

      await apiClient.post("/student/assignments/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Assignment submitted successfully!");
      setSubmissionText("");
      setFileUpload(null);
      setAssignments((prev) =>
        prev.map((a) => (a._id === assignmentId ? { ...a, status: "submitted" } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to submit assignment.");
    } finally {
      setSubmittingAssignment(null);
    }
  };

  // 🔹 Payment Upload
  const handleConfirmPayment = async (paymentId) => {
    if (!paymentScreenshot) {
      alert("Please upload payment screenshot first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("paymentId", paymentId);
      formData.append("screenshot", paymentScreenshot);

      await apiClient.post("/student/payments/confirm", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Payment confirmed!");
      setPaymentScreenshot(null);
      setPayments((prev) =>
        prev.map((p) => (p._id === paymentId ? { ...p, status: "paid" } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Payment confirmation failed.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-200 text-green-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

 const handleLogout = () => {
  localStorage.removeItem("userId");
  if (typeof onLogout === "function") {
    onLogout();
  }
  navigate("/");


  };

  // 🔹 Notification Button Click Handler
  const handleNotificationClick = () => {
    alert("You have no new notifications.");
  };

  // 🔹 Change Password Handler
  const handleChangePassword = () => {
    alert("Redirecting to change password...");
    navigate("/account-settings"); // Replace with the actual route for changing the password
  };

  // 🔹 Change Email Handler (redirect to Account Settings)
const handleChangeEmail = () => {
  navigate("/account-settings");
};


  // 🔹 Delete Account Handler
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      alert("Account deletion is not implemented yet.");
      // Add logic to delete the account here
    }
  };

  // 🔹 Help Button Handler
  const handleHelp = () => {
    alert("Redirecting to the help page...");
    navigate("/help"); // Replace with the actual route for the help page
  };

  // 🔹 Account Settings Handler
  const handleAccountSettings = () => {
    console.log("Navigating to /account-settings");
    navigate("/account-settings");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );

  const firstLetter = studentInfo.fullName ? studentInfo.fullName[0] : "U";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 via-white to-blue-50"}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">EduConnect</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Button */}
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
              onClick={handleNotificationClick}
            >
              <Bell className="h-6 w-6 text-gray-700" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Avatar Dropdown */}
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform text-white font-bold">
                {firstLetter}
              </MenuButton>

              <Menu.Items className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
                <div className="px-4 py-2 border-b">
                  <p className="font-semibold text-gray-700">Settings</p>
                  <button
                    className="block w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                  <button
                    className="block w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    onClick={handleChangeEmail}
                  >
                    Change Email
                  </button>
                  <button
                    className="block w-full text-left px-2 py-1 text-red-600 hover:bg-red-100 rounded"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                  <div className="flex items-center justify-between px-2 py-1 mt-1">
                    <span className="text-gray-600">Dark Mode</span>
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                      className="toggle"
                    />
                  </div>
                </div>

                <MenuItem>
                  {({ active }) => (
                    <button
                      className={`block w-full text-left px-4 py-2 text-gray-700 ${active && "bg-gray-100"}`}
                      onClick={handleHelp}
                    >
                      Help
                    </button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-red-600 font-semibold ${active && "bg-gray-100"}`}
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </header>

      {/* Rest of your dashboard (student info, tabs, etc.) */}
      <div className="container mx-auto px-4 py-8">
        {/* Student Info Card */}
        <Card className="shadow-lg rounded-xl p-6 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Student Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Name:</span> {studentInfo.fullName || "N/A"}</p>
              <p><span className="font-semibold">Curriculum:</span> {studentInfo.curriculum || "N/A"}</p>
              <p><span className="font-semibold">Grade:</span> {studentInfo.grade || "N/A"}</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Enrolled Subjects:</p>
              {studentInfo.subjects && studentInfo.subjects.length ? (
                studentInfo.subjects.map((subj, i) => (
                  <Badge key={i} className="bg-blue-100 text-blue-800 mr-1">{subj}</Badge>
                ))
              ) : (
                <p>No subjects enrolled</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs and other content remains the same as your original code */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="rounded-xl bg-white shadow-md">
          <TabsList className="flex p-1 bg-blue-50 rounded-xl">
            <TabsTrigger value="overview" className="flex-1 text-center py-2 rounded-lg font-semibold">
              Overview
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex-1 text-center py-2 rounded-lg font-semibold">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex-1 text-center py-2 rounded-lg font-semibold">
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Overview Content */}
          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Upcoming Classes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No upcoming classes found.</p>
                </CardContent>
              </Card>

              <Card className="p-4 shadow-md rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">No grades available yet.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments */}
          <TabsContent value="assignments" className="space-y-4">
            {assignments.length > 0 ? (
              assignments.map((a, i) => (
                <Card key={i} className="p-4 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{a.title}</CardTitle>
                    <CardDescription>Subject: {a.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-2">{a.description}</p>
                    <div className="flex flex-col md:flex-row gap-2 mb-2">
                      <input type="file" accept=".pdf,.docx,.png,.jpg" onChange={(e) => setFileUpload(e.target.files[0])} className="md:w-1/2 border rounded p-2" />
                      <Textarea placeholder="Or type your answer here..." rows="3" value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} className="md:w-1/2" />
                    </div>
                    <Button disabled={submittingAssignment === a._id} onClick={() => handleSubmitAssignment(a._id)} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white" >
                      {submittingAssignment === a._id ? "Submitting..." : "Submit Assignment"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">No assignments available right now.</p>
            )}
          </TabsContent>

          {/* Payments */}
          <TabsContent value="payments" className="p-6 grid gap-4">
            {payments.length > 0 ? (
              payments.map((p, i) => (
                <Card key={i} className="shadow-md">
                  <CardHeader>
                    <CardTitle>{formatCurrency(p.amount || 0)}</CardTitle>
                    <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p>Date: {new Date(p.createdAt).toLocaleDateString()}</p>
                    {p.status === "pending" && (
                      <div className="mt-3 flex flex-col md:flex-row gap-2">
                        <input type="file" onChange={(e) => setPaymentScreenshot(e.target.files[0])} />
                        <Button onClick={() => handleConfirmPayment(p._id)}>Confirm Payment</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No payments found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
