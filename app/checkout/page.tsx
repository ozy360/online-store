"use client";
import Nav from "@/components/nav";
import useStore from "@/components/state";
import { X } from "lucide-react";
import LoadingSpinner from "@/components/loadingSpinner";
import { useState } from "react";
import axios from "axios";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

import Container from "@/components/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Checkout() {
  const [loading, setLoading] = useState<boolean>(false);
  interface fdata {
    firstname: string;
    lastname: string;
    email: string;
    street: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    items: any;
    total: number;
  }

  const { items } = useStore();
  console.log(items);
  const result = items.reduce(
    (acc, item) => {
      acc.totalPrice += item.price;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    { totalPrice: 0, totalQuantity: 0 }
  );

  const [shippingForm, setShippingForm] = useState<fdata>({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    country: "",
    state: "",
    zip: "",
    items: items,
    total: Number(result.totalPrice * result.totalQuantity),
  });

  async function paymentFunc() {
    if (items.length < 1) return;
    if (
      (shippingForm.firstname ||
        shippingForm.lastname ||
        shippingForm.email ||
        shippingForm.street ||
        shippingForm.city ||
        shippingForm.country ||
        shippingForm.country ||
        shippingForm.state ||
        shippingForm.zip) === ""
    )
      return;

    // Complete payment function
  }

  return (
    <Container>
      <div className="z-0">
        {loading ? (
          <></>
        ) : (
          <div className="px-3 md:px-4 md:w-[80%] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-20">
              <div className="lg:col-span-3">
                <div>
                  <Card className="bg-transparent space-y-5 p-4">
                    <div className="text-xl font-semibold">
                      Shipping Details
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-x-4 md:space-y-0">
                        <div>
                          <Label>
                            Firstname <span className="text-red-600">*</span>
                          </Label>
                          <br />
                          <Input
                            type="text"
                            className="text-base w-full"
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                firstname: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>
                            Lastname <span className="text-red-600">*</span>
                          </Label>
                          <br />
                          <Input
                            type="text"
                            className="text-base w-full"
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                lastname: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>
                          Email <span className="text-red-600">*</span>
                        </Label>
                        <br />
                        <Input
                          type="email"
                          className="text-base w-full"
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>
                          Street <span className="text-red-600">*</span>
                        </Label>
                        <br />
                        <Input
                          type="text"
                          className="text-base w-full"
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              street: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>
                          City <span className="text-red-600">*</span>
                        </Label>
                        <br />
                        <Input
                          type="text"
                          className="text-base w-full"
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 space-y-4 md:space-x-4 md:space-y-0">
                        <div className="col-span-5">
                          <Label>
                            Country <span className="text-red-600">*</span>
                          </Label>
                          <br />
                          <Input
                            type="text"
                            className="text-base w-full"
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                country: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-span-4">
                          <Label>
                            State <span className="text-red-600">*</span>
                          </Label>
                          <br />
                          <Input
                            type="text"
                            className="text-base w-full"
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                state: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-span-3">
                          <Label>
                            Zip <span className="text-red-600">*</span>
                          </Label>
                          <br />
                          <Input
                            type="text"
                            className="text-base w-full"
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                zip: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Button
                          className="w-full"
                          onClick={() => paymentFunc()}
                        >
                          Proceed to payment
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Cart Details */}

              <div className="lg:col-span-2 mt-12 lg:mt-0">
                <Card className="bg-transparent border-0 shadow-none drop-shadow-none p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-xl font-semibold">Your cart</span>
                    </div>
                    <div className="bg-foreground px-2 py-0 text-white rounded-md text-sm">
                      {items.length}
                    </div>
                  </div>

                  <div className="py-6 border-y">
                    <div>
                      {items.length ? (
                        <>
                          {items?.map((x, index) => (
                            <div key={index} className="">
                              <div
                                className={`flex border-b ${
                                  index === items.length - 1
                                    ? "border-none "
                                    : ""
                                } justify-between items-top p-1`}
                              >
                                <div className="text-left flex-1 min-w-0">
                                  <p className="font-base text-warp text-theader font-medium truncate">
                                    {x.name}
                                  </p>
                                  <p className="text-tbody flex items-center text-muted-foreground">
                                    <X size={14} strokeWidth={1.5} />
                                    {x.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="">
                                    ${Number(x.price * x.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <span>Nothing here...</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    {items.length && (
                      <>
                        <div className="text-right p-2 font-semibold text-xl">
                          ${result.totalPrice * result.totalQuantity}
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
