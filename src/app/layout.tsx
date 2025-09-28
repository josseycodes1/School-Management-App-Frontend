import type { Metadata } from "next";
import { Outfit } from "next/font/google";  
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] }); 

export const metadata: Metadata = {
  title: "Josseycodes School Management Dashboard",
  description: "School Management System built with Nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body> {/* applied Outfit */}
    </html>
  );
}
