/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useForgotPassword, useLoginAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginAdmin();
  const forgotPassMutation = useForgotPassword();

  const navigate = useNavigate();


  const handleLogin = async () => {
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          // Handle success
          toast.success(data.message || "Login successful!");
          navigate('/');
        },
        onError: (error: any) => {
          // Handle error
          toast.error(error.response?.data?.message || "An error occurred during login.");
        },
      }
    );
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
  };

  const handleResetPassword = () => {
    setError("")
    forgotPassMutation.mutate(
      { email },
      {
        onSuccess: (data: any) => {
          // Handle success
          toast.success(data.message || "Email sent successfully!");
        },
        onError: (error: any) => {
          // Handle error
          // toast.error(error.response?.data?.message || "An error occurred during login.");
          setError(error.response?.data?.message || "An error occurred.")
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isForgotPassword ? "Reset Password" : "Admin Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isForgotPassword ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button disabled={forgotPassMutation.isPending} onClick={handleResetPassword} className="w-full">
                {forgotPassMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Mail className="mr-2 h-4 w-4" />}

                {forgotPassMutation.isPending ? "Sending Reset Link" : "Send Reset Link"}
              </Button>
              <Button
                variant="link"
                className="w-full text-sm text-gray-600 dark:text-gray-400"
                onClick={() => setIsForgotPassword(false)}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleLogin} className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" /> {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
              <Button
                variant="link"
                className="w-full text-sm text-gray-600 dark:text-gray-400"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}