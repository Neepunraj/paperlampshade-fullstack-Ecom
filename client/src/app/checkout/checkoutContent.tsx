"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAddressStore } from "@/store/useAddressStore";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { Coupon, useCouponStore } from "@/store/useCouponStore";
import { useProductStore } from "@/store/useProductStore";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { paymentAction } from "../actions/payment";
import { toast } from "sonner";
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthstore";
import { Skeleton } from "@/components/ui/skeleton";

function CheckoutContent() {
  const { address, fetchAddress } = useAddressStore();
  const { items, fetchCart, deleteEntireCart } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showPaymentflow, setShowPaymentFlow] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [couponAppliedError, setCouponAppliedError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedcoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [cartItemWithDetails, setCartITemsWithDetails] = useState<
    (CartItem & { product: any })[]
  >([]);
  const { couponList, fetchAllCoupon } = useCouponStore();
  const { getProductById } = useProductStore();
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    createPaypalOrder,
    capturePaypalOrder,
    createFinalOrder,
    getAllOrders,
    isPaymentProcessing,
  } = useOrderStore();
  useEffect(() => {
    fetchAddress();
    fetchAllCoupon();
    fetchCart();
  }, [fetchAddress, fetchCart, fetchAllCoupon]);
  useEffect(() => {
    const finaDefaultAddress = address.find((add) => add.isDefault);
    if (finaDefaultAddress) {
      setSelectedAddress(finaDefaultAddress.id);
    }
  }, [address]);
  useEffect(() => {
    const fetchIndividualProductDetails = async () => {
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );
      setCartITemsWithDetails(itemsWithDetails);
    };
    fetchIndividualProductDetails();
  }, [items, getProductById]);
  const handleApplyCoupon = () => {
    const getCurrentCoupon = couponList.find(
      (coupon) => coupon.code === couponCode
    );
    if (!couponCode) {
      setCouponAppliedError("Invalid Coupon Code");
      setAppliedCoupon(null);
      return;
    }
    const now = new Date();
    if (getCurrentCoupon) {
      if (
        now < new Date(getCurrentCoupon?.startDate) ||
        now > new Date(getCurrentCoupon?.endDate)
      ) {
        setCouponAppliedError("Invalid Coupon at this time or expired coupon");
        setAppliedCoupon(null);
        return;
      }
      if (getCurrentCoupon?.usageCount >= getCurrentCoupon?.usageLimit) {
        setCouponAppliedError(
          "Coupon has reached its usage limit! please try with another coupon"
        );
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon(getCurrentCoupon);
      setCouponAppliedError("");
    } else {
      setCouponAppliedError("Error in Coupon");
    }
  };
  const subTotal = cartItemWithDetails.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );
  const discountAmount = appliedcoupon
    ? (subTotal * appliedcoupon.discountPercent) / 100
    : 0;

  const total = subTotal - discountAmount;
  const handlePrePaymentFlow = async () => {
    const result = await paymentAction(checkoutEmail);
    if (!result.success) {
      toast(result.error);
      return;
    }
    setShowPaymentFlow(true);
  };
  const handleFinalOrderCreation = async (data: any) => {
    if (!user) {
      toast("user not authenticated");
      return;
    }
    try {
      const orderData = {
        userId: user.id,
        addressId: selectedAddress,
        couponId: appliedcoupon?.id,
        items: cartItemWithDetails.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productCategory: item.product.category,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price,
        })),
        total,
        paymentMethod: "CREDIT_CARD" as const,
        paymentStatus: "COMPLETED" as const,
        paymentId: data.id,
      };
      const finalOrderResponse = await createFinalOrder(orderData);
      if (finalOrderResponse) {
        await deleteEntireCart();
        router.push("/account");
      } else {
        toast("Some Error Processing the final order");
      }
    } catch (error) {
      toast("Some Error Occured");
    }
  };
  if (isPaymentProcessing) {
    return (
      <Skeleton className="w-full h-[600px] rounded-xl">
        <h1 className="text-3xl font-bold">
          Processing Payment... Please wait
        </h1>
      </Skeleton>
    );
  }
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery</h2>
              <div className="space-y-4">
                {address.map((addressItem) => (
                  <div
                    className="flex items-start  space-x-2"
                    key={addressItem.id}
                  >
                    <Checkbox
                      id={addressItem.id}
                      checked={selectedAddress === addressItem.id}
                      onCheckedChange={() => setSelectedAddress(addressItem.id)}
                    />
                    <Label
                      htmlFor={addressItem.id}
                      className="flex-col items-start ml-3 -mt-1"
                    >
                      <div className="">
                        <span className="font-medium">{addressItem.name}</span>
                        {addressItem.isDefault && (
                          <span className="ml-2 text-sm text-green-600">
                            (Default)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        {addressItem.address}
                      </div>
                      <div className="text-sm text-gray-700">
                        {addressItem.city}, {addressItem.country},{" "}
                        {addressItem.postalCode}
                      </div>
                      <div className="text-sm text-gray-700">
                        {addressItem.phone}
                      </div>
                    </Label>
                  </div>
                ))}
                <Button onClick={() => router.push("/account")}>
                  Add a new Address
                </Button>
              </div>
            </Card>
            <Card className="p-6">
              {showPaymentflow ? (
                <div className="">
                  <h3 className="text-xl font-semibold mb-4">Payment</h3>
                  <p className="mb-3">
                    All Transaction are secure and encrypted
                  </p>
                  <PayPalButtons
                    style={{
                      label: "pay",
                      color: "black",
                      shape: "rect",
                      layout: "vertical",
                    }}
                    fundingSource="card"
                    createOrder={async () => {
                      const orderId = await createPaypalOrder(
                        cartItemWithDetails,
                        total
                      );
                      if (orderId === null) {
                        throw new Error("Failed to create paypal order");
                      }
                      return orderId;
                    }}
                    onApprove={async (data, actions) => {
                      const capture = await capturePaypalOrder(data.orderID);
                      if (capture) {
                        await handleFinalOrderCreation(capture);
                      } else {
                        alert("Failed to capture order");
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="text-xl font-semibold mb-4">
                  <h3>Enter Email to get started</h3>
                  <div className="gap-2 flex itmes-center">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      value={checkoutEmail}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setCheckoutEmail(event.target.value)
                      }
                    />
                    <Button onClick={handlePrePaymentFlow}>
                      Proceed to Buy
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky p-6 top-8">
              <h2>Order Summary</h2>
              <div className="space-y-4">
                {cartItemWithDetails.map((item) => (
                  <div className="flex items-center space-x-4" key={item.id}>
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.color}/{item.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <Input
                    placeholder="Enter a discount code or gift Code"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <Button
                    className="w-full"
                    variant={"outline"}
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </Button>
                  {couponAppliedError && (
                    <p className="text-sm text-red-700">{couponAppliedError}</p>
                  )}
                  {appliedcoupon && (
                    <p className="text-sm text-green-600">
                      Coupon Applied Successfully
                    </p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between ">
                    <span>Subtotal</span>
                    <span className="font-bold">${subTotal.toFixed(2)}</span>
                  </div>
                  {appliedcoupon && (
                    <div className="flex justify-between font-medium text-green-500">
                      <span>Discount({appliedcoupon.discountPercent})%</span>
                      <span>${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CheckoutContent;
