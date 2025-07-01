"use client";
import { protectedSingupAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { initialSignupFormdata, SingupFormdataType } from "@/interfaces";
import { useAuthStore } from "@/store/useAuthstore";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, useSonner } from "sonner";

function RegisterPage() {
  const [formData, setFormData] = useState<SingupFormdataType>(
    initialSignupFormdata
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const checkFirstLevelValidation = await protectedSingupAction(
      formData.email
    );
    if (!checkFirstLevelValidation.success) {
      toast("Error Occured", {
        description: checkFirstLevelValidation.error,
      });
      return;
    }
    const userID = await register(
      formData.name,
      formData.email,
      formData.password
    );
    if (userID) {
      toast("Registration Successfull");
      router.push("/auth/login");
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 gap-2 flex">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter you name"
                required
                className="bg-[#ffede1]"
              />
            </div>
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
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-black transition-colors"
            >
              {isLoading ? (
                "Creating account ... "
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <p className="text-center text-[#3f3d56] text-sm">
              Already have an account{" "}
              <Link
                href={"/auth/login"}
                className="text-[#000] hover:underline font-bold"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
