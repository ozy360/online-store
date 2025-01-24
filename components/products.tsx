"use client";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import useStore from "./state";
import LoadingSpinner from "./loadingSpinner";
import { useRouter, useSearchParams } from "next/navigation";
import SearchParams from "./serachParams";

import Container from "./container";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Plus, PlusIcon } from "lucide-react";

export default function Products() {
  const searchParams = (
    <Suspense>
      <SearchParams />
    </Suspense>
  );

  const router = useRouter();
  const { items, addItem } = useStore();
  interface udata {
    _id: string;
    name: string;
    price: string;
    images: string;
  }
  const [productData, setProductData] = useState<udata[]>([]);

  useEffect(() => {
    // const query = searchParams.get("query");
    fetchProducts(String(searchParams));
  }, []);

  async function fetchProducts(query: string) {
    if (query) {
      const formdata = new FormData();
      formdata.append("query", query as string);
      try {
        const res = await axios.post("/api/search", formdata);
        const cdata = res.data;
        if (cdata.error) {
          window.location.replace("/");
        } else {
          setProductData(cdata);
        }
      } catch (error: any) {
        console.error(error.response?.data?.error || "An error occurred");
      }
    } else {
      try {
        const res = await fetch("/api/postdata");

        if (res.ok) {
          const cdata = await res.json();
          if (!cdata.error) setProductData(cdata);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
  }

  function addItemFunc(item: string) {
    const filtered = productData.find((x) => x._id === item);
    addItem(filtered as any, 1);
  }

  if (!productData.length) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <div className="z-0">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 md:gap-8  sm:space-y-0">
          <>
            {productData?.map((x: any) => (
              <Card className="bg-transparent">
                <div key={x._id} className="px-2 pt-2 pb-1">
                  <img
                    src={x.images[0]}
                    className="w-full bg-gray-200 cursor-pointer rounded-md"
                    loading="lazy"
                    onClick={() => router.push(`product/${x._id}`)}
                  />
                  <div
                    className="rounded-b-lg flex justify-between items-center"
                    key={x._id}
                  >
                    <div>
                      <div className="font-medium">{x.name}</div>
                      <div className="text-muted-foreground text-sm">
                        ${x.price}
                      </div>
                    </div>

                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className="bg-transparent text-muted-foreground"
                      id={x._id}
                      onClick={() => addItemFunc(x._id)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </>
        </div>
      </div>
    </Container>
  );
}
