/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Assuming React Router
import { Eye, EyeOff, Lock, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // For notifications
import { useResetPassword } from "@/hooks/useAdmin";

const ResetPassword = () => {
    const { resetToken } = useParams(); // Extract resetToken from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const PassResetMutation = useResetPassword();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetToken) {
            toast.error("Invalid reset link.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        PassResetMutation.mutate({ resetToken, newPassword: password }, {
            onSuccess: (data: any) => {
                // Handle success

                toast.success(data.message || "Password Reset Successful!");
                navigate('/log-in')
            },
            onError: (error: any) => {

                // Handle error
                toast.error(error.response?.data?.message || "An error occurred during reset.");
            },
        })



    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md shadow-lg border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold text-gray-800 dark:text-white">
                        <KeyRound className="inline-block w-6 h-6 mr-2 text-primary dark:text-primary-300" />
                        Reset Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New Password */}
                        <div>
                            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-300">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                                />
                                <span
                                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800"
                            disabled={PassResetMutation.isPending}
                        >
                            {PassResetMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Lock className="mr-2 w-4 h-4" />
                            )}
                            {PassResetMutation.isPending ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
