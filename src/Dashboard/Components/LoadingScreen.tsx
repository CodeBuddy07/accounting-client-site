// components/LoadingScreen.tsx
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading, please wait..." }: LoadingScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[300px] w-full py-10">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
