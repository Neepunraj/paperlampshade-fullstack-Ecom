import React, { Suspense } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductDetailContent from "./productDetails";
interface ProductDetailsPageProps {
  params: { id: string };
}
export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailContent id={params.id} />
    </Suspense>
  );
}
