"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCouponStore } from "@/store/useCouponStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export default function SuperAdminCouponsListingPage() {
  const { deleteCoupon, isLoading, fetchAllCoupon, couponList } =
    useCouponStore();
  const fetchCouponRef = useRef(false);
  const router = useRouter();
  const handleDeleteCoupon = async (id: string) => {
    const result = await deleteCoupon(id);
    if (result) {
      toast("Coupon Deleted successfully");
      fetchAllCoupon();
    }
  };
  useEffect(() => {
    if (!fetchCouponRef.current) {
      fetchAllCoupon();
      fetchCouponRef.current = true;
    }
  }, [fetchAllCoupon]);
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>All Coupons</h1>
          <Button onClick={() => router.push("/super-admin/coupons/add")}>
            Add New Coupon
          </Button>
        </header>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponList.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>
                  <p className="font-semibold">{coupon.code}</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{coupon.discountPercent}%</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">
                    {coupon.usageCount}/{coupon.usageLimit}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{coupon.startDate}</p>
                </TableCell>
                <TableCell>
                  <p className="font-semibold">{coupon.endDate}</p>
                </TableCell>
                <TableCell>
                  <Badge>
                    {new Date(coupon.endDate) > new Date()
                      ? "Active"
                      : "Expired"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    variant="ghost"
                    size={"sm"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
