"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import { brands, categories } from "@/utils/config";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { colors, sizes } from "../../../../utils/config";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { protectProductFormAction } from "@/app/actions/product";
import { useRouter, useSearchParams } from "next/navigation";
interface FormState {
  name: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
}
export default function SuperAdminManageProductPage() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    price: "",
    stock: "",
  });
  const [selectedSizes, setSelectSizes] = useState<string[]>([]);
  const [selectedColors, setSelectColors] = useState<string[]>([]);
  const [selectedfiles, setSelectFiles] = useState<File[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const getCurrentEditID = searchParams.get("id");
  const isEditMode = !!getCurrentEditID;

  const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    isLoading,
    error,
  } = useProductStore();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectFiles(Array.from(event.target.files));
    }
  };
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleToggleSize = (size: string) => {
    setSelectSizes((prev) =>
      prev.includes(size) ? prev.filter((siz) => siz !== size) : [...prev, size]
    );
  };
  const handleToggleColor = (color: string) => {
    setSelectColors((prev) =>
      prev.includes(color)
        ? prev.filter((colr) => colr !== color)
        : [...prev, color]
    );
  };
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkformSanitization = await protectProductFormAction();
    if (checkformSanitization.error) {
      console.log(!checkformSanitization.error);
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([Key, value]) => {
      formData.append(Key, value);
    });
    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", selectedColors.join(","));
    if (!isEditMode) {
      selectedfiles.forEach((file) => {
        formData.append("images", file);
      });
    }
    const result = isEditMode
      ? await updateProduct(getCurrentEditID, formData)
      : await createProduct(formData);
    if (result) {
      router.push("/super-admin/products/list");
    }
  };
  useEffect(() => {
    if (isEditMode) {
      getProductById(getCurrentEditID).then((product) => {
        if (product) {
          setFormState({
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            gender: product.gender,
            price: product.price.toString(),
            stock: product.stock.toString(),
          });
          setSelectColors(product.colors);
          setSelectSizes(product.sizes);
        }
      });
    }
  }, [getCurrentEditID, getProductById, isEditMode]);
  useEffect(() => {
    if (getCurrentEditID === null) {
      setFormState({
        name: "",
        brand: "",
        description: "",
        category: "",
        gender: "",
        price: "",
        stock: "",
      });
      setSelectColors([]);
      setSelectSizes([]);
    }
  }, [getCurrentEditID]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Add Product</h1>
        </header>
        <form
          onSubmit={handleFormSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          {isEditMode ? null : (
            <div className="mt-2 w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 text-gray-400" />
                <div className="mt-4 flex text-sm leadin-6 text-gray-600">
                  <Label className="cursor-pointer">
                    <span>Click to browse</span>

                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </Label>
                </div>
              </div>
              {selectedfiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedfiles.map((file, index) => (
                    <div className="relative" key={index}>
                      <Image
                        alt={`Preview ${index + 1}`}
                        src={URL.createObjectURL(file)}
                        width={80}
                        height={80}
                        className="h-20 w-20 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <Input
                name="name"
                placeholder=" Product Name"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.name}
              />
            </div>
            <div>
              <Label>Brand</Label>
              <Select
                value={formState.brand}
                onValueChange={(value) => handleSelectChange("brand", value)}
                name="brand"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Label>Product Description</Label>
              <Textarea
                name="description"
                className="mt-1.5 min-h-[150px]"
                placeholder="Product Description"
                onChange={handleInputChange}
                value={formState.description}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formState.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                name="category"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Gender</Label>
              <Select
                value={formState.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                name="gender"
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Label>Size</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    size={"sm"}
                    onClick={() => handleToggleSize(item)}
                    variant={
                      selectedSizes.includes(item) ? "default" : "outline"
                    }
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <div className="">
              <Label>Colors</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    key={color.name}
                    type="button"
                    size={"sm"}
                    onClick={() => handleToggleColor(color.name)}
                    className={`h-8 w-8 rounded-full ${color.class} ${
                      selectedColors.includes(color.name)
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    variant={
                      selectedSizes.includes(color.name) ? "default" : "outline"
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Product Price</Label>
              <Input
                name="price"
                className="mt-1.5"
                placeholder="Enter Product Price"
                value={formState.price}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                name="stock"
                className="mt-1.5"
                placeholder="Enter Product Stock"
                value={formState.stock}
                onChange={handleInputChange}
              />
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              className="mt-1.5 w-full"
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
