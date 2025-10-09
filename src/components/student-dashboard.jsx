import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Menu, MenuItem, MenuButton } from "@headlessui/react";
import { BookOpen, User } from "lucide-react";
import { apiClient } from "../utils/api";
import { formatCurrency } from "./ui/formatCurrency";

export function StudentDashboard({ user, onLogout }) {
  const [studentInfo, setStudentInfo] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState("");
  const [fileUpload, setFileUpload] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [cardGradient, setCardGradient] = useState("");

  // Generate a random gradient
  const getRandomGradient = () => {
    const hue1 = Math.floor(Math.random() * 360);
    const hue2 = Math.floor(Math.random() * 360);
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 85%), hsl(${hue2}, 70%, 85%))`;
  };

  useEffect(() => {
    setCardGradient(getRandomGradient());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?._id || localStorage.getItem("userId");
        console.log("User ID:", userId); // Debugging log
        if (!userId) throw new Error("No user ID found");

        // Fetch all student data from the correct API endpoint
        const response = await apiClient.get(`http://localhost:5000/api/student/${userId}`);
        console.log("Student Data Response:", response.data);

        // Update state with the fetched data
        const studentData = response.data;
        setStudentInfo({
          fullName: studentData.name,
          curriculum: studentData.curriculum,
          grade: studentData.grade,
          subjects: studentData.subjects,
        });
        setSubjects(studentData.subjects || []);
        setPayments(studentData.payments || []);
        setAssignments(studentData.assignments || []);
      } catch (err) {
        console.error("Failed to load student data", err);
        alert("Failed to load student data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionText && !fileUpload) {
      alert("Please submit text or file for assignment");
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
      setAssignments(prev =>
        prev.map(a => a._id === assignmentId ? { ...a, status: "submitted" } : a)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to submit assignment.");
    } finally {
      setSubmittingAssignment(null);
    }
  };

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
      setPayments(prev =>
        prev.map(p => p._id === paymentId ? { ...p, status: "paid" } : p)
      );
    } catch (err) {
      console.error(err);
      alert("Payment confirmation failed.");
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case "submitted": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "paid": return "bg-green-200 text-green-900";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50"
      style={{
        backgroundImage: `url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')`, // Subtle texture
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">EduConnect</h1>
          </div>
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <User className="h-6 w-6 text-white" />
            </MenuButton>
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <MenuItem>
                {({ active }) => (
                  <label className={`block px-4 py-2 cursor-pointer ${active && "bg-gray-100"}`}>
                    Upload Avatar
                    <input type="file" className="hidden" />
                  </label>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`block w-full text-left px-4 py-2 ${active && "bg-gray-100"}`}
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                )}
              </MenuItem>
            </Menu.Items>
          </Menu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Student Info Card */}
        <Card
          className="shadow-lg rounded-xl p-6 mb-6 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
          style={{
            background: cardGradient,
            backgroundSize: "400% 400%",
            animation: "gradientShift 10s ease infinite",
          }}
        >
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
              <div className="flex flex-wrap gap-2">
                {studentInfo.subjects?.length > 0 ? (
                  studentInfo.subjects.map((subj, i) => (
                    <Badge key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                      {subj}
                    </Badge>
                  ))
                ) : (
                  <p>No subjects enrolled</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 gap-2 bg-white p-1 rounded-md shadow-sm">
            <TabsTrigger className="transition-all hover:scale-105 hover:bg-blue-100 rounded-md" value="overview">Overview</TabsTrigger>
            <TabsTrigger className="transition-all hover:scale-105 hover:bg-blue-100 rounded-md" value="subjects">My Subjects</TabsTrigger>
            <TabsTrigger className="transition-all hover:scale-105 hover:bg-blue-100 rounded-md" value="assignments">Assignments</TabsTrigger>
            <TabsTrigger className="transition-all hover:scale-105 hover:bg-blue-100 rounded-md" value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* SUBJECTS */}
          <TabsContent value="subjects">
            <div className="grid gap-4 mt-4">
              {subjects
                .filter(s => studentInfo.subjects?.some(subj => subj === s.name))
                .map(s => (
                  <Card key={s._id} className="shadow-md hover:shadow-xl transition-shadow rounded-lg">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800">{s.name}</CardTitle>
                      <CardDescription className="text-gray-600">
                        Teacher: {s.teacherName}<br />
                        Class Time: {s.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Progress value={s.progress || 0} />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* ASSIGNMENTS */}
          <TabsContent value="assignments">
            <div className="space-y-4 mt-4">
              {assignments.sort((a,b) => new Date(a.deadline)-new Date(b.deadline)).map(a => (
                <Card key={a._id} className="shadow-md hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle>{a.title}</CardTitle>
                    <CardDescription>
                      Subject: {Array.isArray(a.subject) ? a.subject.join(", ") : a.subject}<br />
                      Deadline: {new Date(a.deadline).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>{a.description}</p>
                    {a.status === "pending" ? (
                      <>
                        <Textarea value={submissionText} onChange={e => setSubmissionText(e.target.value)} placeholder="Type submission..." />
                        <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={e => setFileUpload(e.target.files[0])} />
                        <Button onClick={() => handleSubmitAssignment(a._id)} disabled={submittingAssignment === a._id}>
                          {submittingAssignment === a._id ? "Submitting..." : "Submit Assignment"}
                        </Button>
                      </>
                    ) : (
                      <Badge className={getStatusColor(a.status)}>Submitted</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PAYMENTS */}
          <TabsContent value="payments">
            <div className="space-y-4 mt-4">
              {payments.map(p => (
                <Card key={p._id} className="shadow-md hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle>{Array.isArray(p.subject) ? p.subject.join(", ") : p.subject}</CardTitle>
                    <CardDescription>
                      Amount: {formatCurrency(p.amount)}<br />
                      Status: <Badge className={getStatusColor(p.status)}>{p.status}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>Recipient Number: 0123456789</p>
                    <p>Recipient Name: DANIEL MENSAH WILLIAMS</p>
                    <input type="file" accept="image/*" onChange={e => setPaymentScreenshot(e.target.files[0])} />
                    <Button onClick={() => handleConfirmPayment(p._id)} disabled={!paymentScreenshot || p.status==="paid"}>
                      Confirm Payment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
      `}</style>
    </div>
  );
}
