import * as React from "react";
import { Loader2, LucideProps } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface LoadingIndicatorProps {
  label: string;
  size?: LucideProps["size"];
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ label, size, className }) => {
  return <Loader2 className={cn("animate-spin cursor-progress", className)} aria-label={label} size={size} />;
};
