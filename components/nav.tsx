// 66ab883de11a0d1288e0743b

"use client";
import Tracking from "./tracking";
import Cart from "./cart";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Space_Grotesk } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
const re = Space_Grotesk({ weight: "400", subsets: ["latin"] });

import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Nav() {
  const router = useRouter();
  const [search, setSearch] = useState<string>();
  const pathname = usePathname();

  async function handleKeyUpFunc(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (search === null) return;
      window.location.assign(`/?query=${encodeURIComponent(search as string)}`);
    }
  }
  return (
    <>
      <div className="z-10 mt-5">
        <div className="flex justify-between gap-x-2 items-center">
          <Link href="/" className={re.className}>
            <Image src={"/logo.png"} width={40} height={40} alt="logo" />
          </Link>
          <div className="flex flex-grow">
            {(pathname === "/" || "/product/:path*") && (
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-transparent"
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={handleKeyUpFunc}
              />
            )}
          </div>

          <Tracking />
          <Cart />
        </div>
      </div>
    </>
  );
}
