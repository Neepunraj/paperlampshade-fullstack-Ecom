"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import SuperAdminSidebar from "@/components/super-admin/sidebar";
export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideBarOpen, setIsSideBarOPen] = useState(true);
  return (
    <div className="min-h-screen bg-background">
      <SuperAdminSidebar
        isOpen={isSideBarOpen}
        toogle={() => setIsSideBarOPen(!isSideBarOpen)}
      />
      <div
        className={cn(
          "transition-all",
          isSideBarOpen ? "ml-64" : "ml-16",
          "min-h-screen"
        )}
      >
        {children}
      </div>
    </div>
  );
}
