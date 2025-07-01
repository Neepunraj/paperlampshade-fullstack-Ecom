"use client";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import React, { useEffect, useState } from "react";
const gridItems = [
  {
    title: "WOMEN",
    subtitle: "From world's top designer",
    image:
      "https://images.unsplash.com/photo-1614251056216-f748f76cd228?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "FALL LEGENDS",
    subtitle: "Timeless cool weather",
    image:
      "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter1_600x.png?v=1733380268",
  },
  {
    title: "ACCESSORIES",
    subtitle: "Everything you need",
    image:
      "https://avon-demo.myshopify.com/cdn/shop/files/demo1-winter4_600x.png?v=1733380275",
  },
  {
    title: "HOLIDAY SPARKLE EDIT",
    subtitle: "Party season ready",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1974&auto=format&fit=crop",
  },
];
function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners, fetchBanners, featureProducts, fetchFeaturedProducts } =
    useSettingsStore();
  useEffect(() => {
    fetchBanners();
    fetchFeaturedProducts();
  }, [fetchBanners, fetchFeaturedProducts]);
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, [banners.length]);
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[600px] overflow-hidden">
        {banners &&
          banners.length > 0 &&
          banners.map((item, index) => (
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
              key={item.id}
            >
              <div className="absolute inset-0">
                <img
                  src={item.imageUrl}
                  className="h-full w-full object-cover"
                  alt={`Banner ${index + 1}`}
                />
                <div className="absolute inset-0 bg-black opacity-20" />
              </div>
              <div className="relative h-full container mx-auto  px-4 flex items-center">
                <div className="text-white space-y-6">
                  <span className="text-sm uppercase tracking-wide">
                    Hello i am
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    Neepun Raj Shrestha ,
                    <br />
                    Founder Engineer and Entrepreneur
                  </h1>
                  <p className="text-lg">
                    A Creative, Flexible , Clean, Easy to use and
                    <br />
                    High Performance E-Commerce Theme
                  </p>
                  <Button className="bg-white text-black hover::bg-gray-100 px-8 py-6 text-lg">
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 ">
          {banners &&
            banners.length > 0 &&
            banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounde-ful transition-all ${
                  currentSlide === index
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
        </div>
      </section>
      <section className="py-6">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            THE WINTER EDIT
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Designed to keep your satisfaction and warmth
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gridItems.map((item, index) => (
              <div className="relative group overflow-hidden" key={index}>
                <div className="aspect-[3/4]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black opacity-0 flex items-center justify-center group-hover:opacity-50 transition-opacity duration-300">
                  <div className="text-center text-white p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm">{item.subtitle}</p>
                    <Button className="bg-white text-black hover:bg-gray-100 mt-4 cursor-pointer">
                      SHOP NOW
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-2">
            NEW ARRIVALS
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Shop our featured products
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            {featureProducts &&
              featureProducts.length > 0 &&
              featureProducts.map((productItem, index) => (
                <div key={index} className="relative group overflow-hidden">
                  <div className="aspect-[3/4]">
                    <img
                      src={productItem.images[0]}
                      alt={productItem.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-semibold mb-2">
                        {productItem.name}
                      </h3>
                      <p className="text-sm">{productItem.price}</p>
                      <Button className="mt-4 bg-white text-black hover:bg-gray-100">
                        QUICK ViEW
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
