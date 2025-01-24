"use client";
import Nav from "./nav";
import Foot from "./footer";
export default function Container({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="px-3 md:w-[90%] mx-auto">
      <div className="mb-[60px]">
        <Nav />
      </div>
      {children}
      <div className="mt-[80px]">
        <Foot />
      </div>
    </main>
  );
}
