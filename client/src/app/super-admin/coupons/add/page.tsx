"use client";
import { protectCouponFormAction } from "@/app/actions/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coupon, useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

export default function SuperAdminMangeCouponPage() {
  const [formData, setFormData] = useState({
    code: "",
    startDate: "",
    endDate: "",
    discountPercent: 0,
    usageLimit: 0,
  });
  const { createCoupon, isLoading } = useCouponStore();
  const router = useRouter();
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCreateUniqueCoupon = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setFormData((prev) => ({ ...prev, code: result }));
  };
  const handleSubmitCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast("End date must be future time");
      return;
    }
    const couponCheck = await protectCouponFormAction();
    if (!couponCheck.success) {
      toast(couponCheck.error);
      return;
    }
    const couponData = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercent.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    };
    const result = await createCoupon(couponData);
    if (result) {
      toast("Coupon Added Successfully");
      router.push("/super-admin/coupons/list");
    }
  };
  return (
    <div className="p-6 bg-black-700">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Create New Coupon</h1>
        </header>
        <form
          onSubmit={handleSubmitCoupon}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          <div className="space-y-4">
            <div className="">
              <Label>Start Date</Label>
              <Input
                type="date"
                onChange={handleInputChange}
                name="startDate"
                value={formData.startDate}
                required
                className="mt-1.5"
              />
            </div>
            <div className="">
              <Label>End Date</Label>
              <Input
                type="date"
                onChange={handleInputChange}
                name="endDate"
                value={formData.endDate}
                required
                className="mt-1.5"
              />
            </div>
            <div className="">
              <Label>Coupon Code</Label>
              <Input
                type="text"
                onChange={handleInputChange}
                name="couponCode"
                placeholder="Enter Coupon Code"
                value={formData.code}
                required
                className="mt-1.5"
              />
              <Button
                type="button"
                onClick={handleCreateUniqueCoupon}
                className="mt-1.5"
              >
                Create Unique Code
              </Button>
            </div>
            <div className="">
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                onChange={handleInputChange}
                name="discountPercent"
                placeholder="Enter Discount Percentage"
                value={formData.discountPercent}
                required
                className="mt-1.5"
              />
            </div>
            <div className="">
              <Label>Usage Limits</Label>
              <Input
                type="number"
                onChange={handleInputChange}
                name="usageLimit"
                placeholder="Enter usage limits"
                value={formData.usageLimit}
                required
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating ... " : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
