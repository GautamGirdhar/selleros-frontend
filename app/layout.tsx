import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SellerOS | Sign in",
  description: "The operating system for modern sellers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
