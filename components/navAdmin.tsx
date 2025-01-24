"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import useStore from "./state";

interface SearchValue {
  text: string;
}

export default function Navadmin() {
  const { searchValue, setSearchValue } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [viewNav, setViewNav] = useState<boolean>(false);
  async function logout() {
    try {
      await fetch("/api/auth/logout");
      router.push("/");
    } catch (error: any) {
      console.log(error.message);
    }
  }

  return (
    <>
      <div className="w-full top-0 left-0">
        <div className="flex justify-between items-center px-2 md:px-4 py-2 text-white text-sm bg-1 w-full">
          <div></div>
          <div>
            <div className="items-center space-x-4 text-right hidden md:flex">
              <a href="/admin" className="cursor-pointer">
                Dashboard
              </a>
              <a href="/admin/products" className="cursor-pointer">
                Products
              </a>
              <a href="/admin/orders" className="cursor-pointer">
                Orders
              </a>
              <button
                className="flex items-center p-1 cursor-pointer"
                onClick={logout}
              >
                <span className="">Logout </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3 md:ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </button>
            </div>
            <div className="md:hidden cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
                onClick={() => setViewNav(!viewNav)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </div>
          </div>
        </div>
        {viewNav && (
          <div className="text-center bg-1 text-white space-y-4 md:hidden text-right px-2 py-4">
            <div>
              <a href="/admin/" className="cursor-pointer">
                Dashboard
              </a>
            </div>
            <div>
              <a href="/admin/products" className="cursor-pointer">
                Products
              </a>
            </div>
            <div>
              <a href="/admin/orders" className="cursor-pointer">
                Orders
              </a>
            </div>
            <div onClick={logout}>
              <span className="cursor-pointer">Logout</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
