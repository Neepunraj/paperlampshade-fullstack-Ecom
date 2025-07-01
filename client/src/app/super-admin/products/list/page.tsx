"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductStore } from "@/store/useProductStore";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SuperAdminProductListingPage() {
  const router = useRouter();
  const { fetchAllProductsforAdmin, products, isLoading, deleteProduct } =
    useProductStore();
  const productFetchRef = useRef(false);
  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsforAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsforAdmin]);

  async function handleDeleteProduct(id: string) {
    const result = await deleteProduct(id);
    if (result) {
      toast("Deleted successfully");
    }
    fetchAllProductsforAdmin();
  }
  if (isLoading) return null;
  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="font-bold text-2xl">All Products</h1>
          <Button onClick={() => router.push("/super-admin/products/add")}>
            Add New Product
          </Button>
        </header>
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products && products.length > 0
                  ? products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="">
                            <div className="">
                              {product.images[0] && (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  height={60}
                                  width={60}
                                  className=""
                                />
                              )}
                            </div>
                            <div className="">
                              <p>{product.name}</p>
                              <p>Size: {product.sizes.join(",")}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <p>{product.stock} Items Left </p>
                        </TableCell>
                        <TableCell>
                          <p>{product.category.toLocaleUpperCase()} </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/super-admin/products/add?id=${product.id}`
                                )
                              }
                              variant={"ghost"}
                              size={"icon"}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              variant={"ghost"}
                              size={"icon"}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
