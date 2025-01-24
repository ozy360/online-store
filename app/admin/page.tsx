"use client";
import { useState, useEffect } from "react";
import Navadmin from "@/components/navAdmin";
import LoadingSpinner from "@/components/loadingSpinner";
import { Package, Package2, Truck, Container } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Admin() {
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<any>();
  const [product, setProduct] = useState<any>();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res1 = await fetch("/api/postdata");
      const res2 = await fetch("/api/orderdata");

      if (res1.ok) {
        const cdata = await res1.json();
        setProduct(cdata);
      }

      if (res2.ok) {
        const cdata = await res2.json();
        setOrder(cdata);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  return (
    <div>
      <Navadmin />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="px-2 md:px-4 py-4 flex justify-between mt-[20px]">
            <div className="text-2xl md:text-3xl font-semibold text-1">
              Dashboard
            </div>
            <div></div>
          </div>
          <div>
            <div className="px-2 md:px-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:space-x-4 gap-5">
                <Cardx
                  text="All products"
                  icon={<Package />}
                  count={product?.length || 0}
                />
                <Cardx
                  text="Orders Placed"
                  icon={<Package2 />}
                  count={order?.length || 0}
                />
                <Cardx
                  text="Orders Shipped"
                  icon={<Container />}
                  count={
                    order?.filter((x: any) => x.status === "Shipped").length ||
                    0
                  }
                />
                <Cardx
                  text="Orders Delivered"
                  icon={<Truck />}
                  count={
                    order?.filter((x: any) => x.status === "Delivered")
                      .length || 0
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-4 md:gap-5 mt-10 gap-y-12 lg:gap-y-0">
                <div>
                  <div className="overflow-x-auto">
                    <Card>
                      <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">S/N</TableHead>
                            <TableHead>Product ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product
                            .slice(0, 8)
                            .reverse()
                            ?.map((x: any, index: number) => (
                              <TableRow key={x._id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell>
                                  {x._id.slice(0, 12) + "..."}
                                </TableCell>
                                <TableCell>{x.name}</TableCell>
                                <TableCell className="text-right">
                                  ${Number(x.price).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Card>
                    <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                      <p>Products summary</p>
                      <p>
                        <a
                          href="/admin/products"
                          className="hover:underline no-underline"
                        >
                          View All
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="overflow-x-auto">
                    <Card>
                      <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">S/N</TableHead>
                            <TableHead>Product ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order
                            .slice(0, 8)
                            .reverse()
                            ?.map((x: any, index: number) => (
                              <TableRow key={x._id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell>
                                  {x._id.slice(0, 12) + "..."}
                                </TableCell>
                                <TableCell>{x.orderDate}</TableCell>
                                <TableCell className="text-right">
                                  ${Number(x.subtotal).toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Card>
                    <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                      <p>Order summary</p>
                      <p>
                        <a
                          href="/admin/orders"
                          className="hover:underline no-underline"
                        >
                          View All
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardxProps {
  text: string;
  count: number;
  icon: any;
}

function Cardx(props: CardxProps) {
  return (
    <Card className="p-2">
      <div className="flex justify-between">
        <p className="text-2 text-muted-foreground">{props.icon}</p>
        <p className="text-sm font-medium uppercase">{props.text}</p>
      </div>
      <div className="text-4xl mt-8 text-end">{props.count}</div>
    </Card>
  );
}
