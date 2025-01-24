"use client";
import { Package, X } from "lucide-react";
import { useState, useEffect } from "react";
import LoadingSpinner from "./loadingSpinner";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function Tracking() {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [emailText, setEmailText] = useState<string>("Enter Email Address...");
  const [orderText, setOrderText] = useState<string>("Enter Order ID...");
  const [order, setOrder] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>();
  const [orderFull, setOrderFull] = useState<any>();
  const [oid, setOid] = useState<string>();

  function handleEmailKeyUpFunc(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setLoading(true);
      const filtered = orderData.find((x: any) => x.email === email);

      if (!filtered) {
        setLoading(false);
        setEmailText("");
        setEmailText("Email not found");
      } else {
        setOid("");
        setLoading(false);
        setOrder(true);
      }
    }
  }

  function handleOrderKeyUpFunc(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setLoading(true);
      const filtered = orderData.find((x: any) => x._id === oid);

      if (!filtered) {
        setLoading(false);
        setOrderText("");
        setOrderText("Order not found");
      } else {
        setLoading(false);
        setOrderFull(filtered);
      }
    }
  }

  useEffect(() => {
    getOrderData();
  }, []);

  async function getOrderData() {
    try {
      const res = await fetch("/api/orderdata");

      if (res.ok) {
        const cdata = await res.json();
        if (!cdata.error) setOrderData(cdata);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            // size={"icon"}
            className="p-[9px] bg-transparent text-muted-foreground flex items-center"
          >
            <Package />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="pr-4">
            <DialogTitle className="text-left">Tracking</DialogTitle>
          </DialogHeader>
          {!order ? (
            <Input
              type="text"
              className="w-full"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={handleEmailKeyUpFunc}
            />
          ) : (
            <div className="pb-1">
              <Input
                type="text"
                className="w-full"
                placeholder="Order ID"
                onChange={(e) => setOid(e.target.value)}
                onKeyUp={handleOrderKeyUpFunc}
              />
            </div>
          )}
          <ScrollArea className="h-[65vh] pr-4">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div>
                {!order ? (
                  <>
                    <div className="centered-div text-muted-foreground">
                      <span>{emailText}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {orderFull ? (
                      <div className="h-[50vh]">
                        <div className="mb-3">
                          <span className="text-lg font-medium">
                            Order ID: <span>{orderFull._id}</span>
                          </span>
                        </div>
                        <div className="space-y-4 mb-8">
                          <div>
                            {" "}
                            {orderFull.items.map((x: any) => (
                              <div
                                key={x._id}
                                className="flex justify-between space-x-4 py-2"
                              >
                                <div className="flex space-x-2 items-center">
                                  <Avatar>
                                    <AvatarImage src={`${x.image}`} />
                                  </Avatar>

                                  <div>
                                    <div className="font-medium">{x.name}</div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <X size={14} strokeWidth={1.5} />
                                      {x.quantity}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-5 my-5">
                          <div
                            className={`${
                              orderFull.status === "Placed" ? "" : ""
                            }`}
                          >
                            <Timeline
                              number={1}
                              text1="Order Placed"
                              text2="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                              textclass={
                                orderFull.status === "Placed"
                                  ? ""
                                  : "line-through"
                              }
                            />
                          </div>
                          <div
                            className={`${
                              orderFull.status === "Shipped" ? "" : ""
                            }`}
                          >
                            <Timeline
                              number={2}
                              text1="En Route"
                              text2="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                              textclass={
                                orderFull.status === "Shipped"
                                  ? ""
                                  : "line-through"
                              }
                            />
                          </div>
                          <div
                            className={`${
                              orderFull.status === "Delivered" ? "" : ""
                            }`}
                          >
                            <Timeline
                              number={3}
                              text1="Delivered"
                              text2="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                              textclass={
                                orderFull.status === "Delivered"
                                  ? ""
                                  : "line-through"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="centered-div">
                        <span>{orderText}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface TimelineProps {
  number: number;
  text1: string;
  text2: string;
  textclass: string;
}

export function Timeline(props: TimelineProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row max-w-sm md:space-x-2 items-top">
        <div className="flex-shrink-0 z-20">
          <div className="size-5 text-sm bg-foreground rounded-md flex items-center justify-center text-white">
            {props.number}
          </div>
        </div>
        <div className="flex-1">
          <div className="px-4">
            <h3 className="font-medium text-base">
              <span className={props.textclass}>{props.text1}</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              <span className={props.textclass}>{props.text2}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
