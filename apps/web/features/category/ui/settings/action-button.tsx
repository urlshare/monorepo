import { cn } from "@workspace/ui/lib/utils";
import React, { FC, PropsWithChildren } from "react";

type ActionButtonProps = {
  className?: string;
  onClick: () => void;
};

export const ActionButton: FC<PropsWithChildren<ActionButtonProps>> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn("flex h-[32px] w-[32px] items-center justify-center rounded-md", className)}
    >
      {children}
    </button>
  );
};
