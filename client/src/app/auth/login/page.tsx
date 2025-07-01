"use client";
import { protectSignInAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { initialLoginFormdata, LoginFormdataType } from "@/interfaces";
import { useAuthStore } from "@/store/useAuthstore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] =
    useState<LoginFormdataType>(initialLoginFormdata);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationCheckLogin = await protectSignInAction(formData.email);
    if (!validationCheckLogin.success) {
      toast("Error Occured", {
        description: validationCheckLogin.error,
      });
      return;
    }
    const success = await login(formData.email, formData.password);
    if (success) {
      toast("Login Successfull");
    }
    const user = useAuthStore.getState().user;
    if (user?.role === "SUPER_ADMIN") router.push("/super-admin");
    else router.push("/home");
  };

  return (
    <div className="min-h-screen bg-[#fff6f4] flex">
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <Image
          src={"https://vintunacrafts.com/wp-content/uploads/2025/04/lamp.png"}
          alt=""
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center">
            <Image
              src={
                "https://vintunacrafts.com/wp-content/uploads/2025/04/vintuna.png"
              }
              alt="Logo"
              height={50}
              width={200}
            />
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 gap-2 flex">
              <label htmlFor="name">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter you name"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-[#ffede1]"
              />
            </div>
            <div className="space-y-1 flex gap-2">
              <label htmlFor="name">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter you name"
                required
                className="bg-[#ffede1]"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button
              className="w-full bg-black color-white text-lg hover:bg-black transition-colors"
              type="submit"
            >
              {isLoading ? " Login in.." : "Login"}
            </Button>
            <p className="text-center text-[#3f3d56] text-sm">
              Already have an account{" "}
              <Link
                href={"/auth/register"}
                className="text-[#000] hover:underline font-bold"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
