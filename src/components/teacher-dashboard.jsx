import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { 
  BookOpen, Users, FileText, Plus, Calendar, Clock, User, TrendingUp, 
  Award, CheckCircle, AlertCircle, Star, Bell, Target, Sparkles 
} from "lucide-react";

// Mock data
const mockStudents = [
  { id: 1, name: "Alice Johnson", email: "alice@email.com", subject: "Mathematics", grade: "A", progress: 85, lastActive: "2 hours ago" },
  { id: 2, name: "Bob Smith", email: "bob@email.com", subject: "Mathematics", grade: "B+", progress: 78, lastActive: "1 day ago" },
  { id: 3, name: "Carol Davis", email: "carol@email.com", subject: "Science", grade: "A-", progress: 92, lastActive: "30 minutes ago" },
  { id: 4, name: "David Wilson", email: "david@email.com", subject: "Science", grade: "B", progress: 70, lastActive: "3 hours ago" },
];

const mockAssignments = [
  {
    id: 1,
    title: "Algebra Practice Set 1",
    subject: "Mathematics",
    dueDate: "2025-01-25",
    submissions: 15,
    totalStudents: 18,
    description: "Complete exercises 1-15 from Chapter 3. Focus on quadratic equations and factoring methods."
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Science",
    dueDate: "2025-01-22",
    submissions: 12,
    totalStudents: 14,
    description: "Write a comprehensive report on the pendulum experiment conducted in last week's lab session."
  }
];

export function TeacherDashboard({ user, onLogout }) {
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    instructions: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    // Mock assignment creation
    console.log('Creating assignment:', newAssignment);
    alert('Assignment created successfully!');
    setNewAssignment({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      instructions: ''
    });
    setIsDialogOpen(false);
  };

  const teachingSubjects = user.subjects || ["Mathematics", "Science"];
  const totalStudents = mockStudents.length;
  const pendingSubmissions = mockAssignments.reduce((acc, assignment) => 
    acc + (assignment.totalStudents - assignment.submissions), 0
  );

  const filteredStudents = selectedSubjectFilter === 'all' 
    ? mockStudents 
    : mockStudents.filter(student => student.subject === selectedSubjectFilter);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">EduConnect</h1>
                <p className="text-sm text-gray-600">Teacher Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-large">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👨‍🏫</h2>
                <p className="text-green-100 mb-4">Ready to inspire young minds today?</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{totalStudents} Active Students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">4.9 Teacher Rating</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <Award className="h-16 w-16 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-soft rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-primary data-[state=active]:text-white">My Students</TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-primary data-[state=active]:text-white">Assignments</TabsTrigger>
            <TabsTrigger value="subjects" className="data-[state=active]:bg-primary data-[state=active]:text-white">My Subjects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Across {teachingSubjects.length} subjects
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{mockAssignments.length}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    {pendingSubmissions} pending submissions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Teaching Subjects</CardTitle>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{teachingSubjects.length}</div>
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum 2 subjects allowed
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Teaching Schedule */}
            <Card className="border-0 shadow-medium bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: "Mathematics Class", grade: "Grade 10 Students", time: "10:00 AM", duration: "45 minutes", color: "blue" },
                    { subject: "Science Lab", grade: "Grade 11 Students", time: "2:00 PM", duration: "60 minutes", color: "green" },
                    { subject: "Office Hours", grade: "Student Consultations", time: "4:00 PM", duration: "30 minutes", color: "purple" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 bg-${schedule.color}-100 rounded-lg flex items-center justify-center`}>
                        <Clock className={`h-5 w-5 text-${schedule.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{schedule.subject}</p>
                        <p className="text-sm text-gray-600">{schedule.grade}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{schedule.time}</p>
                        <p className="text-xs text-gray-500">{schedule.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">My Students</h3>
                <Select value={selectedSubjectFilter} onValueChange={setSelectedSubjectFilter}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {teachingSubjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-lg font-bold text-white">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                                {student.subject}
                              </Badge>
                              <Badge className={getGradeColor(student.grade)}>
                                Grade: {student.grade}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Progress</p>
                            <p className="text-2xl font-bold text-gray-900">{student.progress}%</p>
                          </div>
                          <Progress value={student.progress} className="w-24 h-2" />
                          <p className="text-xs text-gray-500">Last active: {student.lastActive}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Assignments</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-gradient">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Create New Assignment</DialogTitle>
                      <DialogDescription>
                        Create a new assignment for your students
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">Assignment Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter assignment title"
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                        <Select onValueChange={(value) => setNewAssignment(prev => ({ ...prev, subject: value }))}>
                          <SelectTrigger className="bg-gray-50 border-gray-200">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachingSubjects.map(subject => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newAssignment.dueDate}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="description"
                          value={newAssignment.description}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the assignment"
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="instructions" className="text-sm font-medium">Instructions</Label>
                        <Textarea
                          id="instructions"
                          value={newAssignment.instructions}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, instructions: e.target.value }))}
                          placeholder="Detailed instructions for students"
                          className="bg-gray-50 border-gray-200 focus:bg-white"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button type="submit" className="flex-1 btn-gradient">Create Assignment</Button>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <Card key={assignment.id} className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <span>{assignment.subject}</span>
                            <span>•</span>
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                          {assignment.submissions}/{assignment.totalStudents} submitted
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4 leading-relaxed">{assignment.description}</p>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Submission Progress</span>
                            <span className="font-semibold">
                              {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                            </span>
                          </div>
                          <Progress value={(assignment.submissions / assignment.totalStudents) * 100} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-gray-600">{assignment.submissions} submitted</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">{assignment.totalStudents - assignment.submissions} pending</span>
                            </div>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" className="hover:bg-blue-50">
                              View Submissions
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-gray-50">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="animate-fade-in">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">Teaching Subjects</h3>
              <div className="grid gap-6">
                {teachingSubjects.map((subject, index) => (
                  <Card key={index} className="border-0 shadow-medium bg-white/80 backdrop-blur-sm card-hover">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{subject}</CardTitle>
                            <CardDescription>
                              {mockStudents.filter(s => s.subject === subject).length} students enrolled
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">B+</div>
                          <div className="text-sm text-gray-600">Average Grade</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">87%</div>
                          <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-sm font-semibold text-gray-900">Tomorrow</div>
                          <div className="text-sm text-gray-600">Next Class</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {teachingSubjects.length < 2 && (
                  <Card className="border-2 border-dashed border-gray-300 bg-white/50 card-hover">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">Add Another Subject</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You can teach up to 2 subjects. Add another subject to reach more students and increase your impact.
                      </p>
                      <Button className="btn-gradient">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}