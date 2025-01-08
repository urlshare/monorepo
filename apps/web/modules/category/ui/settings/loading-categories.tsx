import { LoadingIndicator } from "@workspace/ui/components/loading-indicator";
import { FC } from "react";

export const LoadingCategories: FC = () => {
  return (
    <div className="flex justify-center p-20">
      <LoadingIndicator label="Loading your categories..." />
    </div>
  );
};
