import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Shield, Lock, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function QaoAccess() {
  const [qaoCode, setQaoCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/qao/access", { qaoCode });
      if (res.data.success) {
        setError("");
        navigate("/qao/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error("QAO access error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="w-full max-w-md animate-scale-in">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-gray-600 hover:text-gray-800 hover:bg-white/50 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Landing
        </Button>

        <Card className="shadow-xl bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl">
          <CardHeader className="text-center space-y-4 py-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl text-gray-900">QAO Access</CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Enter your secret code to access the Quality Assurance Officer Dashboard
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qaoCode" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4" />
                  QAO Access Code
                </Label>
                <Input
                  id="qaoCode"
                  type="password"
                  placeholder="Enter your QAO code"
                  value={qaoCode}
                  onChange={(e) => { setQaoCode(e.target.value); setError(""); }}
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
                {error && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                    <AlertTriangle className="w-4 h-4" />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className={`w-full h-12 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                }`}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Access Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QaoAccess;
