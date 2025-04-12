import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ghost } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6">
        <Ghost className="mx-auto size-16 text-muted-foreground" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link to="/">
        <Button variant="default" className="text-sm">
          ← Go back home
        </Button>
      </Link>
    </div>
  );
}
