"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/store/useProductStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ImageIcon, Upload, X } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function SuperAdminCouponPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { products, fetchAllProductsforAdmin } = useProductStore();
  const pageLoadref = useRef(false);
  const {
    isLoading,
    fetchBanners,
    updateFeaturedProduct,
    addBanners,
    fetchFeaturedProducts,
    featureProducts,
    error,
    banners,
  } = useSettingsStore();
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files) {
      setUploadedFiles(Array.from(event.target.files));
    }
  };
  const removeImage = (getIndex: number) => {
    setUploadedFiles((prev) => prev.filter((_, indx) => indx !== getIndex));
  };
  const handleProductSelection = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length > 8) {
        toast("You can only select upto 8 products");
        return prev;
      }
      return [...prev, productId];
    });
  };
  const handleSaveChange = async () => {
    if (uploadedFiles.length > 0) {
      const result = await addBanners(uploadedFiles);
      console.log(result);
      if (result) {
        setUploadedFiles([]);
        fetchBanners();
      }
    }
    const result = await updateFeaturedProduct(selectedProducts);
    if (result) {
      toast("Feature Product Added Successfully");
      fetchFeaturedProducts();
    }
  };
  useEffect(() => {
    if (!pageLoadref.current) {
      fetchBanners();
      fetchAllProductsforAdmin();
      fetchFeaturedProducts();
    }
  }, [fetchAllProductsforAdmin, fetchBanners, fetchFeaturedProducts]);
  useEffect(() => {
    setSelectedProducts(featureProducts.map((product) => product.id));
  }, [featureProducts]);
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <header className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Settings & Features</h1>
        </header>
        <div className="space-y-6">
          <div className="">
            <h2 className="mb-2">Feature Images</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-md appearance-none cursor-pointer"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-7 w-7 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to upload feature Images
                    </span>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-2">
              {uploadedFiles.map((file, index) => (
                <div className="relative group" key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`uploaded image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="absolute top-0  group-hover:flex"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-col">
            {banners &&
              banners.length > 0 &&
              banners.map((banner, index) => (
                <div className="relative group " key={banner.id}>
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
              ))}
          </div>
          <div className=" border-t-2 border-dashed p-2">
            <h2 className="mb-4 font-semibold text-lg tracking-wide">
              Select Upto 8 Products to feature on client Panel
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className={`relative p-4 border rounded-lg ${
                  selectedProducts.includes(product.id)
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleProductSelection(product.id)}
                  />
                  <div className="space-y-2">
                    <div className="">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-500" />
                      )}
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <p>{product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <Button
            disabled={isLoading}
            onClick={handleSaveChange}
            className="w-full"
          >
            {isLoading ? "saving changes..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
