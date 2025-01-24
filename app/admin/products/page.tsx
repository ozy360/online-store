"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import Navadmin from "@/components/navAdmin";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import LoadingSpinner from "@/components/loadingSpinner";
import { X, CloudUpload } from "lucide-react";
import useStore from "@/components/state";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Admin() {
  const { searchValue } = useStore();
  const [productData, setProductData] = useState<string[]>([]);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    details: "",
  });

  const [xid, setXid] = useState<string>();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/postdata");

      if (res.ok) {
        const cdata = await res.json();
        if (!cdata.error) setProductData(cdata);
        else return;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openInsert, setOpenInsert] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    price: "",
    details: "",
  });
  const [uploadImages, setUploadImages] = useState([]);
  const toggleMenuInsert = () => {
    setOpenInsert(!openInsert);
  };

  const toggleMenuEdit = () => {
    setOpenEdit(!openEdit);
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    setUploadImages(acceptedFiles);
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    maxFiles: 3,
    onDrop,
  });

  const acceptedFileItems = acceptedFiles.map((file: any) => (
    <li key={file.path}>{file.path}</li>
  ));

  async function sendFile() {
    // if (uploadData.name || uploadData.price || uploadData.details === "")
    //   return;
    // if (!uploadImages.length) return;
    // console.log(uploadData);
    // console.log(uploadImages);

    const formdata = new FormData();
    formdata.append("text", JSON.stringify(uploadData) as any);

    uploadImages.forEach((x, index) => {
      console.log(`image-${index}`, x);
      formdata.append(`image-${index}`, x);
    });

    try {
      setLoading(true);
      const res = await axios.post("/api/operations/upload", formdata);

      const cdata = res.data;
      if (cdata.message) {
        setOpenInsert(false);
        console.log("sent");
        window.location.reload();
      } else if (cdata.error) {
        setOpenInsert(false);
        console.error(cdata.error);
        window.location.reload();
      }
    } catch (error: any) {
      setOpenInsert(false);
      setLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  async function getEditFunc(id: string) {
    try {
      setLoading(true);
      setXid(id);
      const res = await axios.get(`/api/postdata/${id}`);
      const cdata = res.data;
      console.log(cdata);
      if (!cdata.error) {
        setLoading(false);
        setEditData({
          name: cdata.name,
          price: cdata.price,
          details: cdata.details,
        });
        setOpenEdit(true);
      }
    } catch (error: any) {
      // setLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  async function editFunc() {
    if (!xid) return;
    if (
      editData.name === "" ||
      editData.price === "" ||
      editData.details === ""
    )
      return;
    const formdata = new FormData();
    formdata.append("id", xid);
    formdata.append("text", JSON.stringify(editData) as any);

    try {
      setLoading(true);
      const res = await axios.get(`/api/operations/edit`);
      const cdata = res.data;
      console.log(cdata);
      if (!cdata.error) {
        setLoading(false);
        setEditData({
          name: cdata.name,
          price: cdata.price,
          details: cdata.details,
        });
        setOpenEdit(true);
      }
    } catch (error: any) {
      // setLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  async function deleteFunc(id: string) {
    const formdata = new FormData();
    formdata.append("id", id);
    try {
      setLoading(true);
      const res = await axios.post("/api/operations/delete", formdata);
      const cdata = res.data;
      if (cdata.message) {
        window.location.reload();
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
      header: "Product ID",
      cell: ({ row }: any) => {
        const x = row.original;
        return (
          <div className="gap-x-2 flex items-center">
            {x._id.slice(0, 12) + "..."}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: any) => {
        const x = row.original;
        return <>${x.price}</>;
      },
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: ({ row }: any) => {
        const x = row.original;
        return (
          <div className="flex items-start">
            <ToggleGroup type="single" variant={"outline"} size={"sm"}>
              {x.images.map((x: string, index: number) => (
                <ToggleGroupItem value={`${x}`} key={index}>
                  <a
                    href={`${x}`}
                    target="blank"
                    className="hover:underline flex items-center gap-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                      />
                    </svg>
                  </a>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }: any) => {
        const x = row.original;
        return (
          <>
            <div className="float-end flex space-x-2 text-right">
              <Button
                size="sm"
                variant="outline"
                id={x._id}
                onClick={() => getEditFunc(x._id)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                id={x._id}
                onClick={() => deleteFunc(x._id)}
              >
                Delete
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
    data: productData,
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
        <div className="">
          <div className="">
            <div className="">
              <div className="px-2 md:px-4 py-4 flex justify-between mt-[20px]">
                <div className="text-2xl md:text-3xl font-semibold text-1">
                  Products
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Search using name..."
                    value={
                      (table.getColumn("name")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn("name")
                        ?.setFilterValue(event.target.value)
                    }
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant={"outline"}
                      // size={"icon"}
                      className="bg-transparent"
                      onClick={toggleMenuInsert}
                    >
                      <CloudUpload /> Upload
                    </Button>
                  </div>
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
          </div>

          <Dialog open={openInsert} onOpenChange={setOpenInsert}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="pr-4">
                <DialogTitle className="text-left">Create Product</DialogTitle>
              </DialogHeader>
              <>
                <Input
                  type="text"
                  placeholder="Name"
                  className="w-full"
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      name: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  className="w-full"
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      price: e.target.value,
                    })
                  }
                />
                <Textarea
                  placeholder="Details"
                  className="h-20 w-full"
                  onChange={(e) =>
                    setUploadData({
                      ...uploadData,
                      details: e.target.value,
                    })
                  }
                />
                <Card className="text-center text-muted-foreground bg-gray-100 py-10 px-4 rounded-lg cursor-pointer">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="flex justify-center items-center text-sm mb-1">
                      <CloudUpload size={30} strokeWidth={1.2} />
                    </div>
                    <span>
                      Drag n drop some files here, or click to select files
                    </span>
                    <p></p>
                    <em>(3 Max files)</em>
                    <ul>{acceptedFileItems}</ul>
                  </div>
                </Card>
                <Button className="w-full" onClick={sendFile}>
                  Submit
                </Button>
              </>
            </DialogContent>
          </Dialog>

          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="pr-4">
                <DialogTitle className="text-left">Edit Product</DialogTitle>
              </DialogHeader>
              <>
                <Input
                  type="text"
                  placeholder="Name"
                  value={editData.name}
                  className="w-full"
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={editData.price}
                  className="w-full"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      price: e.target.value,
                    })
                  }
                />
                <Textarea
                  placeholder="Details"
                  className="h-20 w-full"
                  value={editData.details}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      details: e.target.value,
                    })
                  }
                ></Textarea>

                <Button className="btn w-full" onClick={() => editFunc()}>
                  Submit
                </Button>
              </>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
}
