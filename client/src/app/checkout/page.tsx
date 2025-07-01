"use client";

import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutSuspense from "./checkoutSkeleton";
export default function UserCheckoutPage() {
  const options = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENTID!,
  };
  return (
    <PayPalScriptProvider options={options}>
      <CheckoutSuspense />
    </PayPalScriptProvider>
  );
}
