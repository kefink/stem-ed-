'use client';

import React from "react";

type LoadingSpinnerProps = {
  label: string;
  className?: string;
};

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label, className }) => {
  return (
    <span className={classNames("flex items-center gap-3", className)}>
      <span className="relative flex h-6 w-6">
        <span
          className="absolute inset-0 animate-spin rounded-full border-[3px] border-solid border-transparent"
          style={{
            borderTopColor: "#f97316",
            borderRightColor: "#6366f1",
            borderBottomColor: "#10b981",
            borderLeftColor: "#ec4899",
          }}
        />
        <span className="absolute inset-[6px] rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-sky-400 opacity-40" />
        <span className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
      </span>
      <span className="font-semibold tracking-wide">{label}</span>
    </span>
  );
};

export default LoadingSpinner;
