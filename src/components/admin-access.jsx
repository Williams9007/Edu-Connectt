import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft, Shield, Lock, Crown, AlertTriangle } from "lucide-react";

export function AdminAccess({ onBack, onAdminAccess }) {
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (adminCode === 'EDUCONNECT_ADMIN_2024') {
      onAdminAccess();
    } else {
      setError('Invalid admin access code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-0 shadow-large bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl text-gray-900">Administrator Access</CardTitle>
              <CardDescription className="text-base text-gray-600">
                Restricted area - Enter your admin credentials to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4" />
                  Admin Access Code
                </Label>
                <Input
                  id="adminCode"
                  type="password"
                  placeholder="Enter your admin access code"
                  value={adminCode}
                  onChange={(e) => {
                    setAdminCode(e.target.value);
                    setError('');
                  }}
                  className="h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  required
                />
                {error && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Admin Panel
              </Button>
            </form>

            {/* Demo Code Notice */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-900">Demo Access Available</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    For demonstration purposes, use the code: <span className="font-mono bg-blue-100 px-2 py-1 rounded">EDUCONNECT_ADMIN_2024</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Security Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1 leading-relaxed">
                    Admin access is restricted and monitored. Only authorized personnel should attempt to access this area.
                    All access attempts are logged for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}