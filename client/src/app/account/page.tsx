"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Address, useAddressStore } from "@/store/useAddressStore";
import { useOrderStore } from "@/store/useOrderStore";
import React, { useEffect, useState } from "react";

import { toast } from "sonner";
const initialAddress = {
  name: "",
  address: "",
  postalCode: "",
  city: "",
  country: "",
  phone: "",
  isDefault: false,
};

export default function UserAccountPage() {
  const {
    address,
    fetchAddress,
    createAddress,
    updateAddress,
    isLoading: isLoadingAddress,
    error,
    deleteAddress,
  } = useAddressStore();
  const [formData, setFormdata] = useState(initialAddress);
  const [showAddress, setShowAddress] = useState(false);
  const [editingAddress, setEditingAddres] = useState<string | null>(null);
  const { getOrdersbyUserId, userOrders, isLoading } = useOrderStore();
  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress, formData);
        if (result) {
          fetchAddress();
          setFormdata(initialAddress);
        }
      }
      const result = await createAddress(formData);
      if (result) {
        fetchAddress();
        setFormdata(initialAddress);
        setShowAddress(false);
        toast("Address created Successfully");
      }
    } catch (error: any) {
      toast(error);
    }
  };
  useEffect(() => {
    fetchAddress();
    getOrdersbyUserId();
  }, [fetchAddress, getOrdersbyUserId]);
  console.log(userOrders);
  if (isLoadingAddress) {
    return null;
  }
  const handleDeleteAddress = async (id: string) => {
    const confirm = window.confirm("Are you sure You want to delete address?");
    if (confirm) {
      try {
        const result = await deleteAddress(id);
        if (result) {
          toast("Deleted Successfully");
          fetchAddress();
        }
      } catch (error: any) {
        toast(error);
      }
    }
  };
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
  const handleEditAddress = async (address: Address) => {
    setFormdata({
      name: address.name,
      address: address.address,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setEditingAddres(address.id);
    setShowAddress(true);
  };

  if (isLoading) return null;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3x font-bold ">MY ACCOUNT</h1>
        </div>
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Order History</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold ">Order History</h2>

                {userOrders.length === 0 && (
                  <h2 className="text-2xl font-bold">
                    You havn't placed an Order yet.
                  </h2>
                )}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order#</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.items.length}{" "}
                            {order.items.length > 1 ? "Items" : "Items"}
                          </TableCell>
                          <TableCell className="font-medium">
                            <Badge
                              className={`${getStatusColor(order.status)}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="address">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Addresses</h2>
                  <Button
                    onClick={() => {
                      setEditingAddres(null);
                      setFormdata(initialAddress);
                      setShowAddress(true);
                    }}
                  >
                    Add a New Address
                  </Button>
                </div>
                {isLoadingAddress ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin round-full h-10 w-10 border-b-2 border-gray-900" />
                  </div>
                ) : showAddress ? (
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        required
                        placeholder="Enter your Name"
                        onChange={(e) =>
                          setFormdata({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        required
                        placeholder="Enter your Address"
                        onChange={(e) =>
                          setFormdata({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        required
                        placeholder="Enter your city"
                        onChange={(e) =>
                          setFormdata({ ...formData, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        required
                        placeholder="Enter your Country"
                        onChange={(e) =>
                          setFormdata({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        required
                        placeholder="Enter your phone"
                        onChange={(e) =>
                          setFormdata({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        required
                        placeholder="Enter your postal code"
                        onChange={(e) =>
                          setFormdata({
                            ...formData,
                            postalCode: e.target.value,
                          })
                        }
                      />
                      <div className="">
                        <Checkbox
                          id="default"
                          checked={formData.isDefault}
                          onCheckedChange={(checked) =>
                            setFormdata({
                              ...formData,
                              isDefault: checked as boolean,
                            })
                          }
                        />
                        <Label className="ml-3" htmlFor="default">
                          Set as default address
                        </Label>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit">
                          {editingAddress ? "Update" : "Add"} Address
                        </Button>
                        <Button
                          type="button"
                          variant={"outline"}
                          onClick={() => {
                            setFormdata(initialAddress);
                            setShowAddress(false);
                            setEditingAddres(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {address.map((addressItem) => (
                      <Card key={addressItem.id}>
                        <CardContent className="p-5">
                          <div className="">
                            <p>{addressItem.name}</p>
                            <p>{addressItem.address}</p>
                            <p>
                              {addressItem.city}, {addressItem.country} ,{" "}
                              {addressItem.postalCode}{" "}
                            </p>
                            {addressItem.isDefault && (
                              <Badge variant={"secondary"}>Default</Badge>
                            )}
                          </div>
                          <div className="space-x-2">
                            <Button
                              variant={"outline"}
                              size={"sm"}
                              onClick={() => handleEditAddress(addressItem)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant={"destructive"}
                              size={"sm"}
                              onClick={() =>
                                handleDeleteAddress(addressItem.id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
