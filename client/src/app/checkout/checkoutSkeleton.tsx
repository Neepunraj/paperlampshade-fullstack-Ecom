import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import CheckoutContent from "./checkoutContent";

function CheckoutSekeleton() {
  return (
    <div>
      <Skeleton />
    </div>
  );
}

function CheckoutSuspense() {
  return (
    <Suspense fallback={<CheckoutSekeleton />}>
      <CheckoutContent />{" "}
    </Suspense>
  );
}
export default CheckoutSuspense;
