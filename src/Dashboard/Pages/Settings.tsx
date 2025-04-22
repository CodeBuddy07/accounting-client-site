import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/hooks/useAdmin";
 // Your custom hook

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (data: FormData) => {
    changePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    });
  };

  const newPassword = watch("newPassword");

  return (
    <div className="flex h-full items-center justify-center px-4 border rounded-md py-10 bg-background dark:bg-stone-950">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-stone-900 p-8 shadow-xl border dark:border-stone-700">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-foreground dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 text-sm mt-1">
            Please enter your current and new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Old Password */}
          <div>
            <Label htmlFor="oldPassword" className="dark:text-gray-300 mb-2">
              Old Password
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                type={showOld ? "text" : "password"}
                placeholder="Enter your old password"
                className="dark:bg-gray-700 dark:border-stone-600 dark:text-white dark:placeholder-gray-400"
                {...register("oldPassword", { required: "Old password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowOld(prev => !prev)}
                className="absolute right-2 top-2.5 text-muted-foreground dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword" className="dark:text-gray-300 mb-2">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="Enter a new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                {...register("newPassword", { 
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
              />
              <button
                type="button"
                onClick={() => setShowNew(prev => !prev)}
                className="absolute right-2 top-2.5 text-muted-foreground dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="dark:text-gray-300 mb-2">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your new password"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                {...register("confirmPassword", {
                  validate: value => 
                    value === newPassword || "Passwords do not match"
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(prev => !prev)}
                className="absolute right-2 top-2.5 text-muted-foreground dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-primary hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}