"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Header from "../user/header";
const pathsNotToShowHeaders = ["/auth", "/super-admin"];
export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const showHeader = !pathsNotToShowHeaders.some((path) =>
    pathName.startsWith(path)
  );
  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <main>{children}</main>
    </div>
  );
}
