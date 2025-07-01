"use client";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

export default function ProductDetailContent({ id }: { id: string }) {
  const { getProductById, isLoading } = useProductStore();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSeceletedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCartStore();
  useEffect(() => {
    const fetchProduct = async () => {
      const productDetails = await getProductById(id);
      if (productDetails) {
        setProduct(productDetails);
      } else {
        router.push("/404");
      }
    };
    fetchProduct();
  }, [id, getProductById, router]);

  async function handleAddtoCart() {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: product.colors[selectedColor],
        size: selectedSizes,
        quantity: quantity,
      });
    }
    setSelectedSizes("");
    setSelectedColor(0);
    setQuantity(1);
    toast("Items Added To Cart");
  }
  if (!product || isLoading) return <ProductDetailsSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col  lg:flex-row gap-8">
          <div className="lg:w-2/3 flex gap-4">
            <div className="hidden lg:flex flex-col gap-2 w-24">
              {product?.images.map((image: string, index: number) => (
                <button
                  onClick={() => setSeceletedImage(index)}
                  className={`${
                    selectedImage === index
                      ? "border-black"
                      : "border-transparent"
                  } border-2`}
                  key={index}
                >
                  <img
                    src={image}
                    alt={`Product - ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="flex-1 realtive w-[300px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:w-1/3 space-y-6">
            <div className="">
              <h1 className=" text-3xl font-bold mb-2">{product.name}</h1>
              <div className="">
                <span className="text-2xl font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColor === index
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-2">
                {product?.sizes.map((size: string, index: number) => (
                  <Button
                    className="w-12 h-12"
                    key={index}
                    variant={selectedSizes === size ? "default" : "outline"}
                    onClick={() => setSelectedSizes(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            <div className="">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant={"outline"}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div>
              <Button
                className="w-full bg-black text-white hover:bg-gray-800"
                onClick={handleAddtoCart}
              >
                ADD TO Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="details">PRODUCT DESCRIPTION</TabsTrigger>
            <TabsTrigger value="reviews">REVIEWS</TabsTrigger>
            <TabsTrigger value="shipping">SHIPPING & RETURNS INFO</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-5">
            <p className="text-gray-700 mb-4">{product.description}</p>
          </TabsContent>
          <TabsContent value="reviews" className="mt-5">
            Reviews
          </TabsContent>
          <TabsContent value="shipping">
            <p className="text-gray-700 mb-4">
              Shipping and return information goes here.Please read the info
              before proceeding.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
