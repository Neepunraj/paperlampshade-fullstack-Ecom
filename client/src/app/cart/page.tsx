"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthstore";
import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserCartPage() {
  const [isUpdating, setISUpdating] = useState(false);
  const router = useRouter();
  const {
    fetchCart,
    items,
    isLoading,
    removeFromCart,
    updateCartItemQuantity,
  } = useCartStore();
  const { user } = useAuthStore();
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const handleRemoveItem = async (id: string) => {
    setISUpdating(true);
    await removeFromCart(id);
    setISUpdating(false);
  };
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    setISUpdating(true);
    await updateCartItemQuantity(id, Math.max(1, quantity));
    setISUpdating(false);
  };
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (isLoading || !user) return null;
  return (
    <div className="min-h-scre bg-white py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bol text-center mb-8">
          Your Cart Summary
        </h1>
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-4">PRODUCT</th>
                <th className="text-right py-4 px-4">PRICE</th>
                <th className="text-center py-4 px-4">QUANTITY</th>
                <th className="text-right py-4 px-4">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover"
                      />
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-700">
                        Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-700">Size: {item.size}</p>
                      <Button
                        disabled={isUpdating}
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-sm text-white hover:text-white mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">${item.price}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2  ">
                      <Button
                        disabled={isUpdating}
                        variant={"outline"}
                        size={"icon"}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        className="w-16 text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <Button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        variant={"outline"}
                        size={"icon"}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex justify-end">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">TOTAL </span>
              <span className="font-bold ml-4">${total}</span>
            </div>
            <Button
              className="w-full bg-black text-white"
              onClick={() => router.push("/checkout")}
            >
              PROCEED TO CHECKOUT
            </Button>
            <Button
              onClick={() => router.push("/listing")}
              className="w-full mt-2"
              variant={"outline"}
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
