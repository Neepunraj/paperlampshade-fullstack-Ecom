"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderStore } from "@/store/useOrderStore";
import React, { useEffect } from "react";
import { toast } from "sonner";
type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
export default function AdminOrderPage() {
  const { getAllOrders, adminOrders, isLoading, updateOrderStatus } =
    useOrderStore();

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);
  if (isLoading) return null;
  const getStatusColor = (
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-500";

      case "PROCESSING":
        return "bg-yellow-500";

      case "SHIPPED":
        return "bg-purple-500";

      case "DELIVERED":
        return "bg-green-500";

      default:
        return "bg-gray-500";
    }
  };
  const handleStatusUpdate = async (id: string, value: OrderStatus) => {
    await updateOrderStatus(id, value);

    toast("Status updated Successfully");
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="font-semibold text-2xl">ORDERS LISTS</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No Orders found
              </TableCell>
            </TableRow>
          ) : (
            adminOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-semibold">{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.user.name.toUpperCase()}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.paymentStatus}</TableCell>
                <TableCell>
                  {order.items.length}{" "}
                  {order.items.length > 1 ? "Items" : "Item"}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(order.status)} `}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(order.id, value as OrderStatus)
                    }
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending </SelectItem>
                      <SelectItem value="PROCESSING">Processing </SelectItem>
                      <SelectItem value="SHIPPED">Shipped </SelectItem>
                      <SelectItem value="DELIVERED">Delivered </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
