"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <div className="text-muted-foreground pt-[100px] text-sm">
        <div className="flex space-x-4 items-center justify-center md:justify-end mb-4">
          <a href="" className="hover:underline">
            Instagram
          </a>
          <a href="" className="hover:underline">
            Twitter
          </a>
          <a href="" className="hover:underline">
            Pinterest
          </a>
          <a href="" className="hover:underline">
            support@yourbusinessname.com
          </a>
        </div>
        <p className="w-full text-7xl sm:text-8xl font-medium">
          <Link href="/"></Link>
        </p>
      </div>
    </>
  );
}
