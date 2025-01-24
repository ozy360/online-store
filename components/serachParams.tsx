"use client";
import { useSearchParams } from "next/navigation";

export default function SearchParams() {
  const searchParams = useSearchParams();
  const xSearchParams = searchParams.get("x");
  const xValue = xSearchParams;
  return <>{xValue}</>;
}
