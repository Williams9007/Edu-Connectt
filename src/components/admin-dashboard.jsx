import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle, 
  Video, 
  Upload,
  Mail,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Shield,
  User,
  Star,
  Activity,
  Crown,
  Sparkles
} from "lucide-react";
import { apiClient } from "../utils/api.js";

export function AdminDashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalStudents: 1247,
    totalTeachers: 89,
    totalAdmins: 5,
    totalUsers: 1341
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // QAO Form States
  const [warningMessage, setWarningMessage] = useState("");
  const [assignmentEmail, setAssignmentEmail] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  // Mock data for demonstration
  const teachers = [
    { id: 1, name: "Dr. Sarah Johnson", subject: "Mathematics", students: 24, performance: 96, rating: 4.9 },
    { id: 2, name: "Prof. Michael Chen", subject: "Science", students: 18, performance: 94, rating: 4.8 },
    { id: 3, name: "Ms. Emily Davis", subject: "English", students: 31, performance: 98, rating: 5.0 },
    { id: 4, name: "Mr. James Wilson", subject: "History", students: 22, performance: 91, rating: 4.7 }
  ];

  const subjects = ["Mathematics", "Science", "English", "History", "Geography", "Chemistry"];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiClient.getAdminStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendWarning = () => {
    if (warningMessage.trim()) {
      console.log("Warning sent:", warningMessage);
      setWarningMessage("");
      alert("Warning message sent successfully!");
    }
  };

  const handleAssignTeacher = () => {
    if (assignmentEmail && selectedTeacher && selectedSubject) {
      console.log("Assignment:", { assignmentEmail, selectedTeacher, selectedSubject });
      setAssignmentEmail("");
      setSelectedTeacher("");
      setSelectedSubject("");
      alert("Teacher assignment sent successfully!");
    }
  };

  const handleUploadVideo = () => {
    if (videoFile) {
      console.log("Video uploaded:", videoFile.name);
      setVideoFile(null);
      alert("Video uploaded successfully!");
    }
  };

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      console.log("Note saved:", noteContent);
      setNoteContent("");
      alert("Subject note saved successfully!");
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 95) return "text-green-600";
    if (performance >= 90) return "text-blue-600";
    if (performance >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (performance) => {
    if (performance >= 95) return "bg-green-100 text-green-800 border-green-200";
    if (performance >= 90) return "bg-blue-100 text-blue-800 border-blue-200";
    if (performance >= 85) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">EduConnect QAO</h1>
                <p className="text-sm text-gray-600">Quality Assurance Officer Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span>{user.name}</span>
                </p>
                <p className="text-sm text-gray-600">QAO Administrator</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white shadow-large">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome, Administrator! 👑</h2>
                <p className="text-red-100 mb-4">Manage and monitor the entire EduConnect platform</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm">System Status: Optimal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">Platform Health: 99.9%</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <Crown className="h-16 w-16 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-soft rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="teachers" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="kpi" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              KPI
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Management
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalStudents.toLocaleString()}</div>
                  <p className="text-sm text-gray-600 mt-1">Active learners</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.totalTeachers}</div>
                  <p className="text-sm text-gray-600 mt-1">Active educators</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Performance</CardTitle>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <p className="text-sm text-gray-600 mt-1">Overall KPI average</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{subjects.length}</div>
                  <p className="text-sm text-gray-600 mt-1">Available courses</p>
                </CardContent>
              </Card>
            </div>

            {/* Teachers KPI Section */}
            <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Teachers KPI Analytics
                </CardTitle>
                <CardDescription>
                  Performance metrics and analytics for all teachers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">{teacher.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                          <p className="text-sm text-gray-600">{teacher.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Students</p>
                          <p className="text-lg font-bold text-gray-900">{teacher.students}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Rating</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <p className="font-semibold">{teacher.rating}</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Performance</p>
                          <Badge className={`${getPerformanceBadge(teacher.performance)} px-2 py-1`}>
                            {teacher.performance}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Total Teachers Analytics */}
              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Teachers Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-primary">{stats.totalTeachers}</div>
                      <p className="text-gray-600">Total Active Teachers</p>
                    </div>
                    <div className="space-y-3">
                      {[
                        { subject: "Mathematics", count: 18, color: "blue" },
                        { subject: "Science", count: 16, color: "green" },
                        { subject: "English", count: 14, color: "purple" },
                        { subject: "History", count: 12, color: "orange" },
                        { subject: "Other Subjects", count: 29, color: "gray" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.subject}</span>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 bg-${item.color}-500 rounded-full`}
                                style={{ width: `${(item.count / stats.totalTeachers) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-semibold text-sm w-8">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Note Upload */}
              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Subject Note Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="subject-select" className="text-sm font-medium">Select Subject</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="note-content" className="text-sm font-medium">Note Content</Label>
                    <Textarea
                      id="note-content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Enter subject notes here..."
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleSaveNote} className="w-full btn-gradient">
                    <Upload className="h-4 w-4 mr-2" />
                    Save Subject Note
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Videos Upload Section */}
            <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Educational Videos Management
                </CardTitle>
                <CardDescription>
                  Upload and manage educational content for students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video-subject" className="text-sm font-medium">Video Subject</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Select subject for video" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="video-upload" className="text-sm font-medium">Upload Video</Label>
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <Button onClick={handleUploadVideo} className="w-full btn-gradient">
                  <Video className="h-4 w-4 mr-2" />
                  Upload Educational Video
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPI Tab */}
          <TabsContent value="kpi" className="space-y-6 animate-fade-in">
            {/* Warning System */}
            <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Warning System
                </CardTitle>
                <CardDescription>
                  Send warnings and alerts to teachers and students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="warning-message" className="text-sm font-medium">Warning Message</Label>
                  <Textarea
                    id="warning-message"
                    value={warningMessage}
                    onChange={(e) => setWarningMessage(e.target.value)}
                    placeholder="Enter warning message here..."
                    rows={4}
                    className="border-red-200 focus:border-red-400 bg-red-50 focus:bg-white"
                  />
                </div>
                <Button onClick={handleSendWarning} variant="destructive" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Send Warning
                </Button>
              </CardContent>
            </Card>

            {/* Teacher Assignment */}
            <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Teacher Subject Assignment
                </CardTitle>
                <CardDescription>
                  Email teachers and assign them to specific subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="assignment-email" className="text-sm font-medium">Teacher Email</Label>
                  <Input
                    id="assignment-email"
                    type="email"
                    value={assignmentEmail}
                    onChange={(e) => setAssignmentEmail(e.target.value)}
                    placeholder="teacher@educonnect.com"
                    className="bg-gray-50 border-gray-200 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="select-teacher" className="text-sm font-medium">Select Teacher</Label>
                    <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Choose teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.name}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="select-subject" className="text-sm font-medium">Assign Subject</Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-gray-50 border-gray-200">
                        <SelectValue placeholder="Choose subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAssignTeacher} className="w-full btn-gradient">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Assignment Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6 animate-fade-in">
            <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  System Management
                </CardTitle>
                <CardDescription>
                  Advanced administrative controls and system settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">Quick Actions</h4>
                    <div className="space-y-3">
                      {[
                        { icon: Users, text: "Export User Data", color: "blue" },
                        { icon: BarChart3, text: "Generate Reports", color: "green" },
                        { icon: Settings, text: "System Settings", color: "purple" },
                        { icon: Shield, text: "Security Settings", color: "red" }
                      ].map((action, index) => (
                        <Button key={index} variant="outline" className="w-full justify-start hover:shadow-md transition-all">
                          <action.icon className={`h-4 w-4 mr-3 text-${action.color}-600`} />
                          {action.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">Recent Activity</h4>
                    <div className="space-y-3">
                      {[
                        { text: "New teacher registration: Dr. Sarah Johnson", time: "2 hours ago", icon: Users },
                        { text: "Video uploaded: Mathematics Tutorial #5", time: "4 hours ago", icon: Video },
                        { text: "Warning sent to 3 teachers", time: "1 day ago", icon: AlertTriangle },
                        { text: "Subject note updated: Science Chapter 4", time: "2 days ago", icon: FileText }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <activity.icon className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.text}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}