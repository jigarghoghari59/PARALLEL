import React from "react";
import { TopNav } from "./TopNav";

export const AppLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-bg text-text">
    <TopNav />
    <main className="flex-1 overflow-auto">{children}</main>
  </div>
);
