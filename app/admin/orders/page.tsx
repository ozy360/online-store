"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Navadmin from "@/components/navAdmin";
import LoadingSpinner from "@/components/loadingSpinner";
import {
  X,
  CircleUserRound,
  Calendar,
  Mail,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";
import axios from "axios";
import useStore from "@/components/state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Orders() {
  const { searchValue } = useStore();
  interface odata {
    _id: string;
    firstname: string;
    lastname: string;
    orderDate: string;
    subtotal: number;
    status: string;
    email: string;
    date: string;
    street: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    items: any;
    shippingAddress: any;
  }
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [found, setFound] = useState<odata>();

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orderdata");

      if (res.ok) {
        const cdata = await res.json();
        if (!cdata.error) setOrderData(cdata);
        else return;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  function showFunc(id: string) {
    const filtered = orderData.find((x) => x._id === id);
    setFound(filtered);
    setShow(true);
  }

  async function updateStatus(status: string, id: string) {
    const data = {
      id: id,
      status: status,
    };

    try {
      setLoading(true);
      const res = await axios.post("/api/operations/status", data);

      const cdata = res.data;
      if (cdata.message) {
        window.location.reload();
      } else if (cdata.error) {
        setLoading(false);
        // toast.error("Login Failed")
      }
    } catch (error: any) {
      setLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  const columns = [
    {
      header: "S/N",
      cell: ({ row }: any) => {
        return <>{row.index + 1}</>;
      },
    },
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ row }: any) => {
        const x = row.original;
        return <>{x._id.slice(0, 12) + "..."}</>;
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }: any) => {
        const x = row.original;
        return (
          <>
            {x.items.map((x: string, index: number) => (
              <p key={index}>{x["name" as any]}</p>
            ))}
          </>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }: any) => {
        const x = row.original;
        return (
          <>
            <address className="truncate">
              <p>{x.shippingAddress["street"].slice(0, 20) + "..."}</p>
              <p>
                {x.shippingAddress["city"]}, {x.shippingAddress["state"]}{" "}
                {x.shippingAddress["zip"]}
              </p>
              <p>{x.shippingAddress["country"]}</p>
            </address>
          </>
        );
      },
    },
    {
      accessorKey: "orderDate",
      header: "Date",
    },
    {
      accessorKey: "subtotal",
      header: "Total",
      cell: ({ row }: any) => {
        const x = row.original;
        return <>${x.subtotal}</>;
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-right">Status</div>,
      cell: ({ row }: any) => {
        const x = row.original;
        return (
          <>
            <div className="text-right">
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => showFunc(x._id)}
              >
                {x.status}
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: orderData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <>
      <Navadmin />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="">
            <div className="px-2 md:px-4 py-4 flex justify-between mt-[20px]">
              <div className="text-2xl md:text-3xl font-semibold text-1">
                Orders
              </div>
              <div>
                <Input
                  placeholder="Search using order id..."
                  value={
                    (table.getColumn("_id")?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table.getColumn("_id")?.setFilterValue(event.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="px-2 md:px-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table
                      .getRowModel()
                      .rows.reverse()
                      .map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>

          <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="pr-4">
                <DialogTitle className="text-left">Order Summary</DialogTitle>
              </DialogHeader>

              <ScrollArea>
                <div>
                  {found && (
                    <>
                      <div className="space-y-2 my-4">
                        <p className="flex gap-x-2 items-center">
                          <CircleUserRound size={18} strokeWidth={2} />
                          <span className="">
                            {found.firstname} {found.lastname}
                          </span>
                        </p>
                        <p className="flex gap-x-2 items-center">
                          <Mail size={18} strokeWidth={2} />
                          <span className="">{found.email}</span>
                        </p>
                        <p className="flex gap-x-2 items-center">
                          <Calendar size={18} strokeWidth={2} />{" "}
                          <span className="">{found.orderDate}</span>
                        </p>
                        <p className="flex gap-x-2 items-center">
                          <ArrowUpRight size={18} strokeWidth={2} />{" "}
                          <span className="">{found.status}</span>
                        </p>
                        <p className="flex gap-x-2 items-center">
                          <CircleDollarSign size={18} strokeWidth={2} />
                          <span className="">${found.subtotal}</span>
                        </p>
                      </div>

                      <div className="my-[30px]">
                        {/* <h3>Items</h3> */}
                        <div className="grid grid-cols-4 font-semibold border-b border-b-[#374151]">
                          <div>Product</div>
                          <div>Quantity</div>
                          <div>Price</div>
                          <div>Subtotal</div>
                        </div>
                        {found.items.map((x: any) => (
                          <div
                            key={x._id}
                            className="grid grid-cols-4  my-2 text-left border-b border-b-[#374151]"
                          >
                            <div className="truncate">{x.name}</div>
                            <div className="truncate">{x.quantity}</div>
                            <div className="truncate">${x.price}</div>
                            <div className="truncate">${x.subtotal}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        {/* <div className="">Status</div> */}
                        <select
                          value={found.status}
                          onChange={(e) =>
                            updateStatus(e.target.value, found._id)
                          }
                          className="border border-[#374151] rounded-md cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-lg font-semibold">
                          Shipping Address
                        </h3>
                        <address>
                          <p>{found.shippingAddress["street"]}</p>
                          <p>
                            {found.shippingAddress["city"]},{" "}
                            {found.shippingAddress["state"]}{" "}
                            {found.shippingAddress["zip"]}
                          </p>
                          <p>{found.shippingAddress["country"]}</p>
                        </address>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
