// src/components/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, PlusCircle, Megaphone } from "lucide-react";
import BroadcastModal from "./BroadcastModal";
import AssignSubjectModal from "./AssignSubjectModal";
import AddAccountModal from "./AddAccountModal";
import apiClient, { getJson } from "@/utils/apiClient";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);

  // ✅ Step 1: Verify Admin Token
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");

        await apiClient.get("/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("❌ Admin verification failed:", err);
        localStorage.clear();
        navigate("/admin/login");
      } finally {
        setVerifying(false);
      }
    };
    verifyAdmin();
  }, [navigate]);

// ✅ Step 2: Fetch all dashboard data safely
useEffect(() => {
  if (verifying) return; // wait until verification is done

  const fetchAllData = async () => {
    setLoading(true);

    const newUsers = [];
    let newCounts = {};
    let paymentsData = [];

    try {
      // 1️⃣ Fetch students
      try {
        const students = await getJson("/students");
        newUsers.push(...students.map((s) => ({ ...s, role: "student" })));
        newCounts.students = students.length;
      } catch (err) {
        console.error("❌ Failed to fetch students:", err);
        newCounts.students = 0;
      }

      // 2️⃣ Fetch teachers
      try {
        const teachers = await getJson("/teachers");
        newUsers.push(...teachers.map((t) => ({ ...t, role: "teacher" })));
        newCounts.teachers = teachers.length;
      } catch (err) {
        console.error("❌ Failed to fetch teachers:", err);
        newCounts.teachers = 0;
      }

      // 3️⃣ Fetch QAOs
      try {
        const qaos = await getJson("/qao");
        newUsers.push(...qaos.map((q) => ({ ...q, role: "qao" })));
        newCounts.qaos = qaos.length;
      } catch (err) {
        console.error("❌ Failed to fetch QAOs:", err);
        newCounts.qaos = 0;
      }

      // 4️⃣ Fetch subjects
      try {
        const subjects = await getJson("/subjects");
        newCounts.subjects = subjects.length;
      } catch (err) {
        console.error("❌ Failed to fetch subjects:", err);
        newCounts.subjects = 0;
      }

      // 5️⃣ Fetch payments
      try {
        const payments = await getJson("/payments"); // make sure your backend returns populated student info
        paymentsData = payments;
      } catch (err) {
        console.error("❌ Failed to fetch payments:", err);
        paymentsData = [];
      }

      setUsers(newUsers);
      setCounts(newCounts);
      setPayments(paymentsData);
    } catch (err) {
      console.error("❌ Unexpected error in fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, [verifying]);


  // ✅ Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?")) return;
    try {
      await apiClient.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  // ✅ Loading state
  if (verifying || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <img src="/logo.png" alt="EduConnect" className="w-8 h-8" />
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowBroadcast(true)}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Megaphone size={18} /> Broadcast
          </Button>
          <Button
            onClick={() => setShowAddAccount(true)}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <PlusCircle size={18} /> Add Account
          </Button>
          <div className="relative">
            <Bell className="text-gray-600 w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
              {payments.length}
            </span>
          </div>
        </div>
      </div>

      <Card className="shadow-lg rounded-2xl bg-white">
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
              <TabsTrigger value="assign">Assign Subjects</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <OverviewCard title="Students" count={counts.students} color="blue" />
                <OverviewCard title="Teachers" count={counts.teachers} color="green" />
                <OverviewCard title="QAOs" count={counts.qaos} color="purple" />
                <OverviewCard title="Subjects" count={counts.subjects} color="yellow" />
                <OverviewCard title="Payments" count={counts.payments} color="pink" />
              </div>
            </TabsContent>

            {/* Users */}
            <TabsContent value="users">
              <UserSection users={users} onDelete={handleDeleteUser} />
            </TabsContent>

            {/* Broadcasts */}
            <TabsContent value="broadcasts">
              <h2 className="text-lg font-semibold mb-3">All Broadcasts</h2>
              <p>Use the broadcast button above to send announcements</p>
            </TabsContent>

            {/* Assign Subjects */}
            <TabsContent value="assign">
              <AssignSubjectModal
                users={users.filter((u) => u.role === "teacher")}
                isOpen={showAssign}
                onClose={() => setShowAssign(false)}
              />
            </TabsContent>

            {/* Payments */}
            <TabsContent value="payments">
              {payments.length === 0 ? (
                <p className="text-gray-500">No payments uploaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Student</th>
                        <th className="p-2">Curriculum</th>
                        <th className="p-2">Package</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Screenshot</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p._id} className="border-t hover:bg-gray-50">
                          <td className="p-2">{p.studentId?.name || p.studentName}</td>
                          <td className="p-2">{p.curriculum}</td>
                          <td className="p-2">{p.package}</td>
                          <td className="p-2">{p.amount}</td>
                          <td className="p-2">
                            <a
                              href={p.screenshot}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          </td>
                          <td className="p-2 capitalize">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      {showBroadcast && <BroadcastModal onClose={() => setShowBroadcast(false)} />}
      {showAddAccount && <AddAccountModal onClose={() => setShowAddAccount(false)} />}
    </div>
  );
}

// 📊 Overview Card
function OverviewCard({ title, count, color }) {
  return (
    <div className={`rounded-xl shadow p-6 text-center bg-${color}-50 border border-${color}-100`}>
      <p className="text-gray-600">{title}</p>
      <h3 className={`text-3xl font-bold text-${color}-600`}>{count}</h3>
    </div>
  );
}

// 👥 User Table
function UserSection({ users, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t hover:bg-gray-50">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2 capitalize">{u.role}</td>
              <td className="p-2">
                {u.role !== "admin" && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(u._id)}>
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
