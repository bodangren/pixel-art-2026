import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Pixel Art Benchmark",
  description: "Benchmarking LLM pixel art generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-black text-[#f5f5f5] font-sans`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
