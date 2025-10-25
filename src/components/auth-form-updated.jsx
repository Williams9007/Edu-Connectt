import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, GraduationCap } from "lucide-react";

export function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "student";
  const selectedCurriculum = location.state?.curriculum || "GES";
  const selectedPackage = location.state?.packageName || "Standard";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    grade: "",
    subjects: [],
    experience: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // ✅ Subject prices for normal classes
  const subjectPrices = {
    GES: { English: 150, Maths: 250, Science: 200 },
    CAMBRIDGE: { English: 150, "Core Math": 250, Science: 200 },
  };

  // ✅ Grade options
  const gradeOptions = {
    GES: [
      "Basic 4",
      "Basic 5",
      "Basic 6",
      "JHS 1",
      "JHS 2",
      "JHS 3",
      "SHS 1",
      "SHS 2",
      "SHS 3",
    ],
    CAMBRIDGE: ["Stage 4", "Stage 5", "Stage 6"],
  };

  // ✅ Special Exam Prep options
  const examPrepSubjects = {
    GES: ["GES EPC", "BECE", "WASSCE", "NOVDEC"],
    CAMBRIDGE: ["CAMBRIDGE EPC", "ICGSCE", "A LEVELS"],
  };

  const curriculumKey =
    selectedCurriculum.toUpperCase() === "CAMBRIDGE" ? "CAMBRIDGE" : "GES";

  // ✅ Choose which subjects to show
  const subjects =
    selectedPackage.toLowerCase().includes("exam")
      ? examPrepSubjects[curriculumKey] // show exam prep subjects
      : Object.keys(subjectPrices[curriculumKey]); // show regular subjects

  // ✅ Calculate total amount (only for normal classes, not Exam Prep)
  useEffect(() => {
    if (role === "student" && !selectedPackage.toLowerCase().includes("exam")) {
      const sum = formData.subjects.reduce(
        (acc, s) => acc + (subjectPrices[curriculumKey][s] || 0),
        0
      );
      setTotalAmount(formData.subjects.length >= 2 ? sum : 0);
    } else {
      setTotalAmount(0);
    }
  }, [formData.subjects, curriculumKey, role, selectedPackage]);

  // ✅ Handle Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload, headers, endpoint;

      if (role === "student") {
        if (!formData.grade || formData.subjects.length < 1) {
          setError("Please select a grade and at least one subject.");
          setLoading(false);
          return;
        }

        payload = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
          curriculum: selectedCurriculum.toUpperCase(),
          package: selectedPackage,
          grade: formData.grade,
          subjects: formData.subjects,
          amount: totalAmount,
        };

        endpoint = "http://localhost:5000/api/students/register";
        headers = { "Content-Type": "application/json" };
      } else {
        if (!formData.experience || !cvFile) {
          setError("Please provide years of experience and upload your CV.");
          setLoading(false);
          return;
        }

        payload = new FormData();
        payload.append("fullName", formData.fullName);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("password", formData.password);
        payload.append("curriculum", selectedCurriculum.toUpperCase());
        payload.append("experience", formData.experience);
        payload.append("role", role);
        payload.append("cv", cvFile);

        endpoint = "http://localhost:5000/api/teachers/register";
        headers = {}; // auto handled for FormData
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: role === "student" ? JSON.stringify(payload) : payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user._id);
      }

      if (role === "student") {
        navigate("/payment", {
          state: {
            user: data.user,
            role,
            curriculum: selectedCurriculum,
            package: selectedPackage,
            subjects: formData.subjects,
            amount: totalAmount,
          },
        });
      } else {
        navigate("/teacher-dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="mt-4">
            <CardTitle className="text-2xl capitalize">{role} Signup</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {role === "student" && (
              <>
                <div>
                  <Label>Grade / Level</Label>
                  <select
                    value={formData.grade}
                    onChange={(e) =>
                      setFormData({ ...formData, grade: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    <option value="">Select Grade</option>
                    {gradeOptions[curriculumKey]?.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>
                    {selectedPackage.toLowerCase().includes("exam")
                      ? "Exam Prep Options"
                      : "Subjects (select at least 2)"}
                  </Label>
                  <select
                    multiple={!selectedPackage.toLowerCase().includes("exam")}
                    value={formData.subjects}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subjects: Array.from(
                          e.target.selectedOptions,
                          (o) => o.value
                        ),
                      })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg p-2"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                        {!selectedPackage.toLowerCase().includes("exam") &&
                          ` — ¢${subjectPrices[curriculumKey][s]}`}
                      </option>
                    ))}
                  </select>
                  {!selectedPackage.toLowerCase().includes("exam") && (
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                    </p>
                  )}
                </div>

                {!selectedPackage.toLowerCase().includes("exam") && (
                  <div className="text-lg font-semibold mt-2">
                    Total Amount: ¢{totalAmount}
                  </div>
                )}
              </>
            )}

            {role === "teacher" && (
              <>
                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label>Upload CV</Label>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files[0])}
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
