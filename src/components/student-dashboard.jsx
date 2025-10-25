"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Input } from "./ui/input";
import { User, BookOpen, Bell, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StudentDashboard({ user = {}, onLogout = () => {} }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentMessage, setRecentMessage] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);

  // 🟢 Fetch broadcasts from teachers
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        const res = await fetch(`/api/student/broadcasts/${user._id}`);
        const data = await res.json();
        setBroadcasts(data || []);
      } catch (err) {
        console.error("Failed to load broadcasts:", err);
      }
    };
    fetchBroadcasts();

    const name = user.name || "Student";
    addNotification(`Welcome back, ${name}! 👋`);
  }, []);

  const addNotification = (message) => {
    const note = { id: Date.now(), message, time: new Date().toLocaleTimeString() };
    setNotifications((prev) => [note, ...prev]);
    setRecentMessage(message);
    setTimeout(() => setRecentMessage(null), 6000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">EduConnect</h1>
              <p className="text-sm text-gray-600">Student Portal</p>
            </div>
          </div>

          {/* Notifications & Profile */}
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
                    <div className="p-3 border-b text-sm font-semibold text-gray-700">Notifications</div>
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
              <p className="font-semibold text-gray-900">{user.name || "Guest Student"}</p>
              <p className="text-sm text-gray-600">{user.email || "guest@educonnect.com"}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
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
            className="mx-auto mt-3 w-fit bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3"
          >
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{recentMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-soft rounded-lg p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <Card className="shadow-md p-6">
              <CardHeader>
                <CardTitle>Welcome, {user.name || "Student"}!</CardTitle>
                <CardDescription>Your personalized EduConnect dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Check your announcements, subjects, and messages from your teachers here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects */}
          <TabsContent value="subjects">
            <Card className="shadow-md p-6">
              <CardHeader>
                <CardTitle>Your Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                {user.subjects && user.subjects.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {user.subjects.map((s, i) => (
                      <li key={i}>{s.name || s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No subjects assigned yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Broadcasts */}
          <TabsContent value="broadcasts">
            <Card className="shadow-md p-6">
              <CardHeader>
                <CardTitle>📢 Teacher Announcements</CardTitle>
                <CardDescription>Messages sent by your teachers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {broadcasts.length > 0 ? (
                  broadcasts.map((b, i) => (
                    <Card key={i} className="p-4 border shadow-sm bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">{b.subjectName || "General"}</CardTitle>
                        <p className="text-gray-500 text-sm">
                          {new Date(b.createdAt).toLocaleString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{b.message}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No messages yet. Your teachers' broadcasts will appear here.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
