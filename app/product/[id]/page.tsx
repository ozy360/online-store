"use client";

import { useState, useEffect } from "react";
import useStore from "@/components/state";
import LoadingSpinner from "@/components/loadingSpinner";
import { usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useRef } from "react";
import { shuffle } from "fast-shuffle";
import { useRouter } from "next/navigation";

import Container from "@/components/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function More() {
  const router = useRouter();
  const swiperRef = useRef();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  interface udata {
    _id: string;
    name: string;
    price: string;
    images: any;
    details: string;
  }
  const [productData, setProductData] = useState<udata>();
  const [allData, setAllData] = useState<any>();
  const [qty, setQty] = useState<number>(1);
  const [screenWidth, setScreenWidth] = useState(0);

  const { items, addItem } = useStore();

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    fetchProducts();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setScreenWidth(newWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function fetchProducts() {
    try {
      const res1 = await fetch(`/api/postdata/${id}`);
      const res2 = await fetch(`/api/postdata`);

      if (res1.ok) {
        const cdata = await res1.json();
        if (!cdata.error) setProductData(cdata);
      }

      if (res2.ok) {
        const cdata = await res2.json();
        if (!cdata.error) setAllData(cdata);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  if (!productData) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <div className="px-3 mb-[100px] mt-8 sm:mt-10 md:mb-[120px] z-0">
        <>
          <div className="flex justify-center">
            <Card
              className="bg-transparent grid grid-cols-1 lg:grid-cols-5 p-2 md:w-[90%] lg:w-[80%] xl:w-[65%] rounded-lg space-y-4 lg:space-y-0 lg:space-x-6"
              key={productData._id}
            >
              <div className="col-span-3 z-0">
                <Swiper
                  spaceBetween={8}
                  slidesPerView={1.3}
                  key={productData._id}
                >
                  {productData.images.map((x: any, index: number) => (
                    <>
                      <div key={index} className="">
                        <SwiperSlide>
                          <div key={index} className="h-[450px]">
                            <img
                              loading="lazy"
                              src={`${x}`}
                              key={index}
                              className="product-image h-[450px] w-full bg-gray-200 rounded-md"
                            />
                          </div>
                        </SwiperSlide>
                      </div>
                    </>
                  ))}
                </Swiper>
              </div>
              <div className="col-span-2 space-y-4">
                <div className="font-normal uppercase text-muted-foreground">
                  {productData.name}
                </div>
                <div className="text-5xl font-medium">${productData.price}</div>
                <div className="text-gray-600">{productData.details}</div>
                <div></div>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    className="w-16"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value) || 1)}
                  />

                  <Button
                    // variant={"outline"}
                    onClick={() => addItem(productData, qty)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      </div>

      {allData && (
        <>
          <div className="z-0">
            <div className="font-medium text-3xl mb-3">Other Products</div>
            <Swiper
              spaceBetween={20}
              slidesPerView={
                screenWidth < 640
                  ? 1.2
                  : screenWidth < 768
                  ? 2.2
                  : screenWidth < 1024
                  ? 2.5
                  : 3.2
              }
              // ref={swiperRef}
              navigation={{
                prevEl: ".my-prev-button",
                nextEl: ".my-next-button",
              }}
            >
              {" "}
              {/* <div className="uppercase flex space-x-4">
                <button className="my-next-button rounded-full border border-black p-2">
                  <ChevronLeft />
                </button>
                <button className="my-prev-button rounded-full border border-black p-2">
                  <ChevronRight />
                </button>
              </div> */}
              {shuffle(allData)
                .slice(0, 6)
                .map((x: any, index: number) => (
                  <div
                    className="hover:cursor-pointer"
                    key={index}
                    onClick={() => router.push("/products/" + `${x._id}`)}
                  >
                    <SwiperSlide>
                      <Card key={index} className="p-2 bg-transparent">
                        <img
                          src={x.images[0]}
                          className="rounded-md w-full"
                          loading="lazy"
                        />
                        <div className="flex flex-col space-y-1">
                          <span className="font-semibold">{x.name}</span>
                          <span className="text-muted-foreground">
                            ${x.price}
                          </span>
                        </div>
                      </Card>
                    </SwiperSlide>
                  </div>
                ))}
            </Swiper>
          </div>
        </>
      )}
    </Container>
  );
}
