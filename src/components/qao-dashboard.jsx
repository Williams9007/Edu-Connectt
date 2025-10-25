import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Bell, User, BookOpen, LogOut, Loader2, Crown, Send } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// ------------------- Broadcast Modal -------------------
function BroadcastModal({ onClose, token }) {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };
    fetchTeachers();
  }, [token]);

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedTeachers((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (!subject || !message) return alert("Please fill in all fields");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/qao/broadcast",
        { recipients: selectedTeachers, subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Message sent successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">📢 Broadcast Message to Teachers</h2>

        <input
          type="text"
          placeholder="Subject"
          className="w-full border p-2 rounded mb-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <textarea
          placeholder="Write your message..."
          className="w-full border p-2 rounded mb-3 h-24"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search teacher by name or email..."
          className="w-full border p-2 rounded mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-40 overflow-y-auto border rounded mb-4 p-2">
          {filteredTeachers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No teachers found.</p>
          ) : (
            filteredTeachers.map((t) => (
              <label
                key={t._id}
                className="flex items-center gap-2 border-b py-1 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedTeachers.includes(t._id)}
                  onChange={() => toggleSelect(t._id)}
                />
                <span className="flex-1 text-sm">
                  <strong>{t.name}</strong> <br />
                  <span className="text-gray-500 text-xs">{t.email}</span>
                </span>
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            onClick={handleSend}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------- Main Dashboard -------------------
export function QaoDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [qaoUsers, setQaoUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notifications, setNotifications] = useState([
    "Welcome back, QAO!",
    "New lesson notes uploaded.",
    "New class video uploaded.",
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [qaoRes, subjectRes] = await Promise.all([
          axios.get("http://localhost:5000/api/qao-users"),
          axios.get("http://localhost:5000/api/subjects"),
        ]);
        setQaoUsers(qaoRes.data);
        setSubjects(subjectRes.data);
        const analytics = qaoRes.data.map((q) => ({
          name: q.name,
          subjects: q.assignedSubjects?.length || 0,
        }));
        setAnalyticsData(analytics);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin h-8 w-8 mb-2" />
        Loading QAO Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EduConnect QAO</h1>
            <p className="text-sm text-gray-600">Quality Assurance Officer Panel</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Notification Bell */}
          <div className="relative">
            <Bell
              className="h-6 w-6 cursor-pointer hover:text-indigo-500 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 p-4 space-y-2">
                {notifications.map((note, i) => (
                  <p key={i} className="text-sm text-gray-700">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Broadcast button */}
          <Button
            className="bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
            onClick={() => setShowBroadcast(true)}
          >
            <Send className="h-4 w-4" />
            Broadcast
          </Button>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold text-gray-900 flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span>QAO Officer</span>
              </p>
              <p className="text-sm text-gray-600">Admin</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Section (unchanged from your original code) */}
      {/* Tabs */} <main className="container mx-auto p-6"> <Tabs value={activeTab} onValueChange={setActiveTab}> <TabsList className="grid grid-cols-5 mb-6 bg-white rounded-xl p-1 shadow-sm"> <TabsTrigger value="overview">Overview</TabsTrigger> <TabsTrigger value="qao-users">QOA Users</TabsTrigger> <TabsTrigger value="kpi">KPI</TabsTrigger> <TabsTrigger value="resources">Resources</TabsTrigger> <TabsTrigger value="assignments">Assign Subjects</TabsTrigger> </TabsList> {/* ---------------- Overview ---------------- */} <TabsContent value="overview"> <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-lg mb-6"> <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Welcome Back!</CardTitle> <p className="text-gray-600">You have {qaoUsers.length} active QOA users.</p> <p className="text-gray-600">Recent notifications shown above.</p> </Card> </TabsContent> {/* ---------------- QOA Users ---------------- */} <TabsContent value="qao-users"> <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {qaoUsers.map(q => ( <Card key={q._id} className="p-4 shadow-lg rounded-2xl bg-white"> <CardHeader> <CardTitle>{q.name}</CardTitle> </CardHeader> <CardContent className="space-y-2"> <p className="text-gray-600">Email: {q.email}</p> <p className="text-gray-600">Subjects: {q.assignedSubjects?.join(", ") || "None"}</p> </CardContent> </Card> ))} </div> </TabsContent> {/* ---------------- KPI ---------------- */} <TabsContent value="kpi"> <Card className="p-4 shadow-lg rounded-2xl bg-white"> <CardTitle className="text-lg font-semibold text-gray-800 mb-4">User Warnings</CardTitle> {qaoUsers.map(q => ( <div key={q._id} className="mb-4 p-3 border rounded-lg bg-yellow-50"> <p className="text-gray-800 font-medium">{q.name} ({q.email})</p> <textarea placeholder="Write a warning message..." className="w-full border p-2 rounded-lg mt-2" /> <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white">Send Warning</Button> </div> ))} </Card> </TabsContent> {/* ---------------- Resources ---------------- */} <TabsContent value="resources"> <Card className="p-4 shadow-lg rounded-2xl bg-white mb-4"> <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Lesson Notes</CardTitle> {qaoUsers.map(q => q.notes?.map((n, i) => ( <p key={i} className="text-gray-700">{q.name}: {n.title}</p> )))} </Card> <Card className="p-4 shadow-lg rounded-2xl bg-white"> <CardTitle className="text-lg font-semibold text-gray-800 mb-2">Class Videos</CardTitle> {qaoUsers.map(q => q.videos?.map((v, i) => ( <p key={i} className="text-gray-700">{q.name}: {v.title}</p> )))} </Card> </TabsContent> {/* ---------------- Assign Subjects ---------------- */} <TabsContent value="assignments"> <Card className="p-4 shadow-lg rounded-2xl bg-white"> <CardTitle className="text-lg font-semibold text-gray-800 mb-4">Assign Subjects to QOA Users</CardTitle> <div className="space-y-3"> {qaoUsers.map(q => ( <div key={q._id} className="flex justify-between items-center"> <p className="text-gray-700 font-medium">{q.name}</p> <select value={q.assignedSubjects?.[0] || ""} onChange={(e) => handleAssignSubject(q._id, e.target.value)} className="border rounded-lg p-1" > <option value="">Select Subject</option> {subjects.map(s => ( <option key={s._id} value={s.name}>{s.name}</option> ))} </select> </div> ))} </div> </Card> </TabsContent> {/* ---------------- Analytics ---------------- */} <TabsContent value="analytics"> <Card className="p-4 shadow-lg rounded-2xl bg-white"> <CardTitle className="text-lg font-semibold text-gray-800 mb-4">QOA User Analytics</CardTitle> <div style={{ width: "100%", height: 300 }}> <ResponsiveContainer> <BarChart data={analyticsData}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" tick={{ fontSize: 12 }} /> <YAxis /> <Tooltip /> <Bar dataKey="subjects" fill="#6b5bff" radius={[6,6,0,0]} /> </BarChart> </ResponsiveContainer> </div> </Card> </TabsContent> </Tabs> </main>
       

      {/* Broadcast Modal */}
      {showBroadcast && (
        <BroadcastModal token={token} onClose={() => setShowBroadcast(false)} />
      )}
    </div>
  );
}

export default QaoDashboard;
