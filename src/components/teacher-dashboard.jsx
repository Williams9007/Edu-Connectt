"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BookOpen, User, Bell, CheckCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Default values
const defaultSubjects = [];

export function TeacherDashboard({ user = {}, onLogout = () => {} }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentMessage, setRecentMessage] = useState(null);
  const [messages, setMessages] = useState([]); // From QAO or admin
  const [reply, setReply] = useState("");

  // ✅ Broadcast states
  const [subjects, setSubjects] = useState([]);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcasts, setBroadcasts] = useState([]);
  const [sending, setSending] = useState(false);

  // 🪄 Welcome message
  useEffect(() => {
    const name = user.name || "Teacher";
    const welcomeMessage = `Welcome back, ${name}! 👋`;
    addNotification(welcomeMessage);
    fetchMessages();
    fetchSubjects();
    fetchBroadcasts();
  }, []);

  // ✅ Fetch subjects for the teacher
  const fetchSubjects = async () => {
    try {
      const res = await fetch(`/api/teacher/${user._id}/subjects`);
      const data = await res.json();
      setSubjects(data || []);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  // ✅ Fetch existing broadcasts
  const fetchBroadcasts = async () => {
    try {
      const res = await fetch(`/api/teacher/${user._id}/broadcasts`);
      const data = await res.json();
      setBroadcasts(data || []);
    } catch (err) {
      console.error("Error fetching broadcasts:", err);
    }
  };

  // ✅ Fetch messages from QAO
  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/qao/messages/${user._id}`);
      const data = await res.json();
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // ✅ Send broadcast to students (by subject)
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) return alert("Message cannot be empty");
    if (!broadcastSubject) return alert("Please select a subject");

    try {
      setSending(true);
      const res = await fetch("/api/teacher/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: user._id,
          subjectId: broadcastSubject,
          message: broadcastMessage,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        addNotification("Broadcast sent successfully ✅");
        setBroadcastMessage("");
        fetchBroadcasts();
      } else alert(data.message || "Failed to send broadcast");
    } catch (err) {
      console.error("Error sending broadcast:", err);
    } finally {
      setSending(false);
    }
  };

  // ✅ Send reply back to QAO
  const handleReply = async (e, msgId) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const res = await fetch(`/api/qao/messages/${msgId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply, teacherId: user._id }),
      });
      if (res.ok) {
        setReply("");
        fetchMessages();
        addNotification("Reply sent successfully ✅");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  // ✅ Notifications
  const addNotification = (message) => {
    const newNote = { id: Date.now(), message, time: new Date().toLocaleTimeString() };
    setNotifications((prev) => [newNote, ...prev]);
    setRecentMessage(message);
    setTimeout(() => setRecentMessage(null), 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">EduConnect</h1>
              <p className="text-sm text-gray-600">Teacher Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <Button variant="ghost" onClick={() => setShowDropdown(!showDropdown)}>
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-xl border border-gray-100 z-50"
                  >
                    <div className="p-3 border-b text-sm font-semibold text-gray-700">
                      Notifications
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 text-center">No notifications</p>
                      ) : (
                        notifications.map((note) => (
                          <div key={note.id} className="p-3 border-b hover:bg-gray-50 transition">
                            <p className="text-sm text-gray-800">{note.message}</p>
                            <p className="text-xs text-gray-400">{note.time}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">{user.name || "Guest Teacher"}</p>
              <p className="text-sm text-gray-600">{user.email || "guest@educonnect.com"}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <Button
              variant="outline"
              onClick={onLogout}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      <AnimatePresence>
        {recentMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto mt-3 w-fit bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3"
          >
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{recentMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-soft rounded-lg p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* ✅ Messages Tab */}
          <TabsContent value="messages">
            <div className="space-y-6">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <Card key={msg._id} className="bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>{msg.title || "Broadcast"}</CardTitle>
                      <CardDescription>{msg.date || "Recent"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{msg.content}</p>
                      <form onSubmit={(e) => handleReply(e, msg._id)} className="flex items-center space-x-2">
                        <Input
                          placeholder="Write a reply..."
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                        />
                        <Button type="submit" className="flex items-center">
                          <Send className="h-4 w-4 mr-1" /> Reply
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* ✅ Broadcast Tab */}
          <TabsContent value="subjects">
            <Card className="shadow-lg p-6">
              <CardHeader>
                <CardTitle>📢 Broadcast Message to Students</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={setBroadcastSubject} value={broadcastSubject}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.length > 0 ? (
                      subjects.map((subj) => (
                        <SelectItem key={subj._id} value={subj._id}>
                          {subj.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No subjects available</SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Textarea
                  rows="4"
                  placeholder="Type your announcement here..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />

                <Button
                  onClick={handleSendBroadcast}
                  disabled={sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {sending ? "Sending..." : "Send Broadcast"}
                </Button>
              </CardContent>
            </Card>

            {/* Previously Sent Broadcasts */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Previous Broadcasts</h2>
              {broadcasts.length > 0 ? (
                broadcasts.map((b, i) => (
                  <Card key={i} className="p-4 mb-3 shadow-sm border">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {b.subjectName || "General"}
                      </CardTitle>
                      <p className="text-gray-500 text-sm">
                        {new Date(b.createdAt).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p>{b.message}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500">No broadcasts sent yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
export default TeacherDashboard;