"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useProductStore } from "@/store/useProductStore";
import { brands, categories, colors, sizes } from "@/utils/config";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
export default function ProdcutListingPage() {
  const [selectedCategories, setSelectecCategories] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();
  const {
    isLoading,
    error,
    products,
    fetchProductforClient,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useProductStore();
  function handleToggleFilter(
    filterTypes: "categories" | "sizes" | "brands" | "colors",
    value: string
  ) {
    const setterMap = {
      categories: setSelectecCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };
    setterMap[filterTypes]((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }
  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  const fetchAllProducts = () => {
    fetchProductforClient({
      page: currentPage,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      sortOrder,
      limit: 5,
      categories: selectedCategories,
    });
  };
  useEffect(() => {
    fetchAllProducts();
  }, [
    currentPage,
    selectedCategories,
    selectedBrand,
    selectedColors,
    selectedSizes,
    priceRange,
    sortBy,
    sortOrder,
  ]);
  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };
  const FilterSection = () => {
    return (
      <div className="space-y-6">
        <div className="">
          <h3 className="mb-3 font-semibold">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div className="flex  items-center" key={category}>
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() =>
                    handleToggleFilter("categories", category)
                  }
                />
                <label htmlFor={category} className="ml-2 text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <h3 className="font-semibold mb-3">Price Range</h3>
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            className="w-full"
            value={priceRange}
            step={1}
            onValueChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        <div className="">
          <h3 className="mb-3 font-semibold">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                className="h-8 w-8"
                key={size}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                onClick={() => handleToggleFilter("sizes", size)}
                size="sm"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        <div className="">
          <h3 className="mb-3 font-semibold">Brands</h3>
          <div className="space-y-2`">
            {brands.map((brand) => (
              <div className="flex items-center" key={brand}>
                <Checkbox
                  checked={selectedBrand.includes(brand)}
                  onCheckedChange={() => handleToggleFilter("brands", brand)}
                />
                <label htmlFor={brand} className="ml-2 text-sm">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="">
          <h3 className="mb-3 font-semibold">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleToggleFilter("colors", color.name)}
                className={`${
                  color.class
                } rounded-full w-6 h-6 cursor-pointer ${
                  selectedColors.includes(color.name)
                    ? "ring-offset-2 ring-black ring-2"
                    : ""
                } `}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[300px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Listing Page Banner"
          className="w-full object-cover h-full "
        />
        <div className="absolute inset-0 bg-black opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">HOT COLLECTION</h1>
            <p className="text-lg">Discover our latest collection</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold ">All Products</h2>
          <div className="flex itmes-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-h-[600px] overflow-auto max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <FilterSection />
              </DialogContent>
            </Dialog>
            <Select
              name="sort"
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => handleSortChange(value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-asc">Sort by: Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price : High to Low</SelectItem>
                <SelectItem value="createdAt-desc">
                  Sort by: Newest First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            {/* filter section */}
            <FilterSection />
          </div>
          <div className="flex-1">
            {isLoading ? (
              <div className="">Loading...</div>
            ) : error ? (
              <div>Error:{error}</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 ">
                {products.map((productItem) => (
                  <div
                    className="cursor-pointer group"
                    key={productItem.id}
                    onClick={() => router.push(`/listing/${productItem.id}`)}
                  >
                    <div className="relative aspect-square mb-4 bg-gray-100 overflow-hidden">
                      <img
                        src={productItem.images[0]}
                        alt={productItem.name}
                        className="w-full h-full obeject-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button className="bg-white text-black hover:bg-gray-100">
                          QuickView
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-bold">{productItem.name}</h3>
                    <div className="">
                      <span className="font-semibold">
                        ${productItem.price.toFixed(2)}
                      </span>
                      <div className="flex gap-1">
                        {productItem.colors.map((color, index) => (
                          <div
                            className="w-4 h-4 rounded-full boder"
                            key={index}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* page */}
            <div className="flex justify-center items-center gap-2 mt-10">
              <Button
                variant={"outline"}
                size={"icon"}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    className="w-10"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                disabled={currentPage === totalPages}
                variant={"outline"}
                size={"icon"}
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
