"use client";
import { ArrowLeft, Menu, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useAuthStore } from "@/store/useAuthstore";
import { useCartStore } from "@/store/useCartStore";
const navItems = [
  {
    title: "HOME",
    to: "/",
  },
  {
    title: "PRODUCTS",
    to: "/listing",
  },
];

export default function Header() {
  const [mobileView, setMobileView] = useState<"menu" | "account">("menu");
  const [showSheetDialog, setShowSheetDialog] = useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();
  const { fetchCart, items } = useCartStore();
  async function handleLogOut() {
    console.log("clicked");
    await logout();
    router.push("/auth/login");
  }
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const renderMobileMenuItems = () => {
    switch (mobileView) {
      case "account":
        return (
          <div className="space-y-2">
            <div className="">
              <Button
                onClick={() => setMobileView("menu")}
                variant={"ghost"}
                size={"icon"}
              >
                <ArrowLeft />
              </Button>
            </div>
            <nav className="space-y-2">
              <p
                className="block cursor-pointer w-full p-2"
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/account");
                }}
              >
                Your Account
              </p>
              <Button
                onClick={() => {
                  setShowSheetDialog(false);
                  setMobileView("menu");
                  handleLogOut();
                }}
              >
                logout
              </Button>
            </nav>
          </div>
        );

      default:
        return (
          <div className="space-y-6 py-6 ">
            <div className="sapce-y-3">
              {navItems &&
                navItems.map((item) => (
                  <p
                    className="block w-full font-semibold p-2 cursor-pointer"
                    key={item.title}
                  >
                    {item.title}
                  </p>
                ))}
            </div>
            <div className="space-y-4">
              <Button
                className="w-full justify-center"
                onClick={() => setMobileView("account")}
              >
                <User className="h-4 w-4 mr-1" />
                Account
              </Button>
              <Button
                className="w-full justify-center"
                onClick={() => {
                  setShowSheetDialog(false);
                  router.push("/cart");
                }}
              >
                <ShoppingBag className="mr-1 h-4 w-4" />
                Cart ({items?.length})
              </Button>
            </div>
          </div>
        );
    }
  };
  return (
    <header className="sticky bg-white top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-2xl font-bold">
            PAPER LAMPSHADES
          </Link>
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            <nav className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  href={item.to}
                  key={index}
                  className="text-sm font-semibold hover:text-gray-700"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div
              className="relative cursor-pointer"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                {items?.length}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"ghost"}>
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  Your Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="lg:hidden">
            <Sheet
              open={showSheetDialog}
              onOpenChange={() => {
                setShowSheetDialog(false);
                setMobileView("menu");
              }}
            >
              <Button
                onClick={() => setShowSheetDialog(!showSheetDialog)}
                size="icon"
                variant="ghost"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>PAPER LAMPSHADES</SheetTitle>
                </SheetHeader>
                {renderMobileMenuItems()}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
