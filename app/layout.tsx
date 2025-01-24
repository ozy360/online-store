import type { Metadata } from "next";
import "./globals.css";
import { Hanken_Grotesk, Poppins, Manrope } from "next/font/google";

const body = Hanken_Grotesk({
  // weight: ["100", "200", "300"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Online store",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={body.className}>
      <body className="mx-auto max-w-screen-2xl 4xl:mx-auto 4xl:max-w-screen-4x bg-white">
        {children}
      </body>
    </html>
  );
}
