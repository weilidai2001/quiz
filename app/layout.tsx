import "../styles/globals.css";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="customlight">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className + " min-h-screen"}>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-2xl w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
