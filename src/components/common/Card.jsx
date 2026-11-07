// src/components/common/Card.jsx
import React from "react";
import { cn } from "../../utils";

export const Card = ({ children, className = "" }) => (
  <div
    className={cn(
      "bg-card text-text border border-border rounded-2xl p-4 backdrop-blur",
      className
    )}
  >
    {children}
  </div>
);
