"use client";
import { useState } from "react";
import useStore from "./state";
import Randomstring from "randomstring";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MyComponentProps {
  onButtonClick: () => void;
}

export default function Cart() {
  const router = useRouter();
  const { items, addItem, deleteItem, incrementQuantity, decrementQuantity } =
    useStore();
  console.log(items);
  const result = items.reduce(
    (acc, item) => {
      acc.totalPrice += item.price;
      acc.totalQuantity += item.quantity;
      return acc;
    },
    { totalPrice: 0, totalQuantity: 0 }
  );

  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"outline"}
            // size={"icon"}
            className="p-[9px] bg-transparent text-muted-foreground flex items-center"
          >
            <ShoppingBag />
            {items.length > 0 && (
              <div className="-ml-1 text-sm">{items.length}</div>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-left">Cart</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            {items.length ? (
              <>
                {items?.map((x: any) => (
                  <div key={x._id}>
                    <div
                      className="my-6 grid grid-cols-2"
                      key={x._id + Randomstring.generate()}
                    >
                      <div className="flex space-x-3 items-center">
                        <div className="">
                          <Avatar>
                            <AvatarImage src={`${x.images[0]}`} />
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{x.name}</p>
                          <p className="text-muted-foreground">${x.price}</p>
                        </div>
                      </div>

                      <div className="flex flex-end">
                        <div className="flex space-x-3 items-center ml-auto">
                          <div>
                            <ToggleGroup type="multiple" variant="outline">
                              <ToggleGroupItem
                                value="plus"
                                onClick={() => incrementQuantity(x._id)}
                              >
                                <Plus size={15} />
                              </ToggleGroupItem>
                              <ToggleGroupItem value="number">
                                <span>{x.quantity}</span>
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="minus"
                                onClick={() => decrementQuantity(x._id)}
                              >
                                <Minus size={15} />
                              </ToggleGroupItem>
                              {/* <div
                                // size={"icon"}
                                // variant={"ghost"}
                                onClick={() => deleteItem(x._id)}
                                className="text-muted-foreground ml-1 hover:cursor-pointer"
                              >
                                <Trash2 size={18} strokeWidth={1.2} />
                              </div> */}
                            </ToggleGroup>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="centered-div text-muted-foreground text-center">
                <div className=""> Nothing here... </div>
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-between items-center bg-background">
            <span className="text-base font-semibold">Total:</span>
            <span className="text-base font-semibold">
              {" "}
              ${Number(result.totalPrice * result.totalQuantity).toFixed(2)}
            </span>
          </div>

          <Button
            variant={"outline"}
            onClick={() => router.push("/checkout")}
            className="w-full"
          >
            Checkout
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
