import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopSphere | Modern Microservices E-Commerce",
  description: "Enterprise e-commerce platform built with Next.js, Express, PostgreSQL, Redis, Kafka, and Kubernetes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
