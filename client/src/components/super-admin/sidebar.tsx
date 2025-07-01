"use client";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListOrdered,
  LogOut,
  Package,
  Printer,
  SendToBack,
  Settings,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthstore";
interface SidebarProps {
  isOpen: boolean;
  toogle: () => void;
}
const menuItems = [
  {
    name: "Products",
    icon: Package,
    href: "/super-admin/products/list",
  },
  {
    name: "Add New Product",
    icon: Printer,
    href: "/super-admin/products/add",
  },
  {
    name: "Orders",
    icon: SendToBack,
    href: "/super-admin/orders",
  },
  {
    name: "Coupons",
    icon: FileText,
    href: "/super-admin/coupons/list",
  },
  {
    name: "Create Coupon",
    icon: ListOrdered,
    href: "/super-admin/coupons/add",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "logout",
    icon: LogOut,
    href: "",
  },
];
export default function SuperAdminSidebar({ isOpen, toogle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  async function handleLogout() {
    console.log("logout");
    await logout();
    router.push("/auth/login");
  }
  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        "border-r"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className={cn("font-semibold", !isOpen && "hidden")}>
          Admin Panel
        </h1>
        <Button
          variant={"ghost"}
          size={"icon"}
          className="'ml-auto"
          onClick={toogle}
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="space-y-1 py-4">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={cn(
              "flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={
              item.name === "logout"
                ? handleLogout
                : () => router.push(item.href)
            }
          >
            <item.icon className="h-4 w-4" />
            <span className={cn("ml-3 ", !isOpen && "hidden")}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
